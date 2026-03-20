"""
PHAK Chapter HTML Extractor - v2
Converts Acrobat PDF-to-HTML export into structured chapter JSON.

Fixes:
  A. Continuation detection - merge blocks starting mid-sentence
  B. Figure-caused gap handling - don't break paragraphs across figure gaps
  C. Figure placement - assign figures to correct section by vertical position
  D. FAA Reference Material sidebar - don't create fake sections from sidebar bold
  E. NOTAM / table noise detection and removal
  F. List item bleed - strip trailing paragraph text from last list item
"""

from bs4 import BeautifulSoup
import re, json, sys

# ── Constants ──────────────────────────────────────────────────────────────
RED       = '#ef4043'
BLACK     = '#000000'
COL_SPLIT = 260
PAGE_FOOT = 720

# Fix A: words that signal a block is a mid-sentence continuation
CONTINUATION_RE = re.compile(
    r'^(and |or |but |the |that |which |in |of |to |a |an |as |at |by |for |'
    r'from |with |into |through |during |before |after |above |below |between |'
    r'however|therefore|thus |also |then |when |where |while |although |'
    r'including |such |these |those |this |its |it |he |she |they |we |'
    r'active |designated |flight |knowledge |serve |should |[a-z])',
    re.IGNORECASE
)

# Real subheadings — only these create new sections
REAL_SUBHEADINGS = {
    'Transcontinental Air Mail Route',
    'Federal Certification of Pilots and Mechanics',
    'The Civil Aeronautics Act of 1938',
    'The Federal Aviation Act of 1958',
    'Department of Transportation (DOT)',
    'ATC Automation',
    'The Professional Air Traffic Controllers Organization (PATCO) Strike',
    'The Airline Deregulation Act of 1978',
    'The Code of Federal Regulations (CFR)',
    'Overview of 14 CFR',
    'Primary Locations of the FAA',
    'Field Offices',
    'Flight Standards Service',
    'Flight Standards District Office (FSDO)',
    'Aviation Safety Inspector (ASI)',
    'FAA Safety Team (FAASTeam)',
    'Obtaining Assistance from the FAA',
    'FAA Reference Material',
    'Flight Publications',
    'Notices to Airmen (NOTAMs)',
    'NOTAM (D) Information',
    'FDC NOTAMs',
    'NOTAM Composition',
    'NOTAM Dissemination and Availability',
    'Safety Program Airmen Notification System (SPANS)',
    'How To Find a Reputable Flight Program',
    'How To Choose a Certificated Flight Instructor (CFI)',
    'Basic Requirements',
    'Medical Certification Requirements',
    'Student Pilot Solo Requirements',
    'Knowledge Tests',
    'When To Take the Knowledge Test',
    'Practical Test',
    'When To Take the Practical Test',
    'Who Administers the FAA Practical Tests?',
    'Role of the Certificated Flight Instructor',
    'Role of the Designated Pilot Examiner',
    'Sport Pilot',
    'Recreational Pilot',
    'Private Pilot',
    'Commercial Pilot',
    'Airline Transport Pilot',
    'Privileges:',
    'Limitations:',
}
REAL_SUBHEADINGS_SORTED = sorted(REAL_SUBHEADINGS, key=len, reverse=True)

# Fix D: sidebar bold text that should NOT become sections
SIDEBAR_SUBS = {
    'Aeronautical Information Manual (AIM)',
    'Aircraft Flying Handbooks (by category)',
    "Aviation Instructor's Handbook",
    'Instrument Flying Handbook',
    'Instrument Procedures Handbook',
}

# Fix E: noise patterns
NOISE_RE = re.compile(
    r'^(D-KC|FAA-S-\S+|Code of Federal Regulations|^Title$|Volume Chapter|'
    r'Subchapters|Keyword|Example|Meaning|Pilot and Aeronautical Information|'
    r'New York|Iowa City|Rock Springs|Bellefonte|Omaha|Salt Lake City|'
    r'Cleveland|North Platte|Elko|Bryan|Cheyenne|Reno|Chicago|Rawlins|'
    r'San Francisco|\d+\s*$|[A-Z]\s*$)$'
)
NOTAM_TABLE_RE = re.compile(
    r'^(RWY\s+RWY|NAV VOR|SVC TWR|SVC CUSTOMS|AIRSPACE AIRSHOW|'
    r'N E V ADA|\d+\s+\d+\s+\d+|H E LIP)'
)

# Fix F: paragraph text that bleeds into last list item — split these off
PARA_BLEED_RE = re.compile(
    r'(To earn a Sport Pilot Certificate|When operating as a sport pilot|'
    r'When operating as a recreational pilot|The sport pilot certificate does not|'
    r'Should a student pilot find|Designated to perform specific pilot|'
    r'NM range from the departure airport|For a detailed explanation|'
    r'The applicant must provide|NOTAM Composition|NOTAM Dissemination)'
)


# ── Step 1: Extract all text elements from HTML ───────────────────────────
def extract_elements(html_path):
    with open(html_path, encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')

    elements = []
    pages = soup.find_all('div', style=re.compile(r'position:relative'))

    for page_idx, page in enumerate(pages):
        for div in page.find_all('div', style=re.compile(r'position:absolute')):
            spans = div.find_all('span')
            if not spans:
                continue
            text = ''.join(s.get_text() for s in spans).strip()
            if not text:
                continue

            style = div.get('style', '')
            top_m  = re.search(r'top:([\d.]+)pt', style)
            left_m = re.search(r'left:([\d.]+)pt', style)
            if not top_m or not left_m:
                continue

            top  = float(top_m.group(1))
            left = float(left_m.group(1))

            if top > PAGE_FOOT and re.match(r'^\d+-\d+$', text.strip()):
                continue  # page number

            sp0     = spans[0].get('style', '')
            color_m = re.search(r'color:(#[a-f0-9]+)', sp0)
            size_m  = re.search(r'font-size:([\d.]+)pt', sp0)
            color   = color_m.group(1) if color_m else BLACK
            size    = float(size_m.group(1)) if size_m else 10.0
            bold    = 'font-weight:bold' in sp0
            italic  = 'font-style:italic' in sp0

            if color == RED and bold:
                kind = 'red_heading'
            elif bold and size <= 8.5 and re.match(r'^Figure\s+\d', text):
                kind = 'fig_label'
            elif italic and size <= 9.5:
                kind = 'caption'
            elif bold:
                kind = 'subheading'
            else:
                kind = 'body'

            elements.append({
                'page': page_idx, 'top': top, 'left': left,
                'col': 'right' if left > COL_SPLIT else 'left',
                'text': text, 'color': color, 'bold': bold,
                'italic': italic, 'size': size, 'kind': kind,
            })

    elements.sort(key=lambda e: (e['page'], 0 if e['col'] == 'left' else 1, e['top']))
    return elements


# ── Step 2: Build figure objects from fig_label + caption elements ─────────
def build_figure_objects(elements):
    fig_labels = [(i, e) for i, e in enumerate(elements) if e['kind'] == 'fig_label']
    used = set()
    figures = {}

    for idx, fl in fig_labels:
        fig_m = re.match(r'Figure\s+(\d+-\d+[a-z]?)\.?', fl['text'])
        if not fig_m:
            continue
        fig_num = fig_m.group(1)
        used.add(idx)

        cap_lines = []
        for j, e in enumerate(elements):
            if e['kind'] != 'caption':
                continue
            if e['page'] != fl['page'] or e['col'] != fl['col']:
                continue
            if abs(e['top'] - fl['top']) <= 120:
                cap_lines.append((j, e))

        cap_lines.sort(key=lambda x: x[1]['top'])
        caption = ''
        for j, e in cap_lines:
            used.add(j)
            caption = (caption[:-1] + e['text']) if caption.endswith('-') \
                      else (caption + ' ' + e['text']).strip()

        figures[idx] = {
            'kind': 'figure', 'figure_number': fig_num, 'caption': caption,
            'page': fl['page'], 'col': fl['col'], 'top': fl['top'],
        }

    clean = []
    for i, e in enumerate(elements):
        if i in used:
            if i in figures:
                clean.append(figures[i])
        else:
            clean.append(e)
    return clean


# ── Step 3: Merge lines into paragraph blocks ─────────────────────────────
def merge_lines_to_blocks(elements):
    # Build figure vertical ranges per (page, col) for Fix B
    fig_ranges = {}
    for e in elements:
        if e.get('kind') == 'figure':
            key = (e['page'], e['col'])
            fig_ranges.setdefault(key, []).append((e['top'], e['top'] + 100))

    def figure_gap(prev_col, prev_page, prev_last_top, curr_top):
        """Fix B: gap caused by figure in opposite column?"""
        opp = 'right' if prev_col == 'left' else 'left'
        for (ft, fb) in fig_ranges.get((prev_page, opp), []):
            if ft < curr_top and fb > prev_last_top:
                return True
        return False

    blocks = []
    cur = None

    def flush():
        if cur:
            blocks.append(dict(cur))

    for el in elements:
        kind = el.get('kind')

        if kind == 'red_heading':
            flush(); cur = None
            if blocks and blocks[-1]['kind'] == 'red_heading':
                blocks[-1]['text'] += ' ' + el['text']
            else:
                blocks.append({'kind': 'red_heading', 'text': el['text']})
            continue

        if kind == 'figure':
            flush(); cur = None
            blocks.append(el)
            continue

        if kind == 'subheading':
            flush(); cur = None
            blocks.append({'kind': 'subheading', 'text': el['text'],
                           'page': el['page'], 'col': el['col'], 'top': el['top']})
            continue

        if kind == 'body':
            text = el['text'].strip()
            if not text:
                continue

            if cur is None:
                cur = {'kind': 'body', 'text': text, 'page': el['page'],
                       'col': el['col'], 'top': el['top'], 'last_top': el['top']}
                continue

            gap       = el['top'] - cur['last_top']
            same_col  = el['col'] == cur['col']
            same_page = el['page'] == cur['page']

            # Fix A: continuation detection
            is_cont = bool(CONTINUATION_RE.match(text)) and same_page

            # Fix B: figure-caused gap
            is_fig_gap = (same_page and same_col and
                          figure_gap(cur['col'], cur['page'],
                                     cur['last_top'], el['top']))

            if same_page and same_col and gap < 18:
                # Normal same-line/next-line merge
                prev = cur['text']
                cur['text'] = (prev[:-1] + text) if prev.endswith('-') \
                              else (prev + ' ' + text)
                cur['last_top'] = el['top']

            elif is_cont or is_fig_gap:
                # Mid-sentence continuation across column/gap
                prev = cur['text']
                cur['text'] = (prev[:-1] + text) if prev.endswith('-') \
                              else (prev + ' ' + text)
                cur['last_top'] = el['top']
                cur['col'] = el['col']

            else:
                flush()
                cur = {'kind': 'body', 'text': text, 'page': el['page'],
                       'col': el['col'], 'top': el['top'], 'last_top': el['top']}

    flush()
    return blocks


# ── Step 4: Post-process blocks ───────────────────────────────────────────
def post_process(blocks):
    result = []
    seen_handbooks = False

    for b in blocks:
        kind = b['kind']
        text = b.get('text', '').strip()

        if kind == 'subheading':
            # Fix D: sidebar noise
            if text in SIDEBAR_SUBS:
                continue
            # Special case: Handbooks — keep first occurrence only as body
            if text == 'Handbooks':
                if not seen_handbooks:
                    seen_handbooks = True
                    # Treat as body paragraph under FAA Reference Material
                continue  # Skip — the body text below it handles this
            # Drop noise
            if NOISE_RE.match(text) or len(text) < 3:
                continue
            # Real subheading
            if text in REAL_SUBHEADINGS:
                result.append(b)
            else:
                # Unknown bold — demote to body
                result.append({**b, 'kind': 'body'})
            continue

        if kind == 'body':
            # Fix E: NOTAM table noise
            if NOTAM_TABLE_RE.match(text):
                continue
            if NOISE_RE.match(text) or len(text) < 8:
                continue
            # Map grid noise
            if len(re.findall(r'\d+', text)) > 5 and len(text) < 80:
                continue

            # Split inline subheadings
            matched = None
            for sub in REAL_SUBHEADINGS_SORTED:
                if text.startswith(sub):
                    matched = sub
                    break
            if matched:
                rest = text[len(matched):].strip()
                result.append({'kind': 'subheading', 'text': matched,
                               'page': b.get('page'), 'col': b.get('col'),
                               'top': b.get('top', 0)})
                if rest and len(rest) > 10:
                    result.append({**b, 'text': rest})
            else:
                result.append({**b, 'text': text})
            continue

        result.append(b)

    # Merge split PATCO heading
    merged = []
    i = 0
    while i < len(result):
        b = result[i]
        if (b['kind'] == 'subheading' and
                'Professional Air Traffic Controllers' in b['text'] and
                i + 1 < len(result) and
                result[i+1]['kind'] == 'subheading' and
                'PATCO' in result[i+1]['text']):
            merged.append({**b, 'text':
                'The Professional Air Traffic Controllers Organization (PATCO) Strike'})
            i += 2
            continue
        merged.append(b)
        i += 1

    return merged


# ── Step 5: Build pages ───────────────────────────────────────────────────
def build_pages(blocks, page_titles, fig_images):

    def split_bullets(text):
        """Convert bullet-embedded paragraph to list items."""
        parts = re.split(r'\s*•\s*', text)
        parts = [p.strip() for p in parts if p.strip()]
        return parts

    def fix_list_bleed(items):
        """
        Fix F: last list item may have trailing paragraph text appended.
        Split it off and return (clean_items, leftover_text).
        """
        if not items:
            return items, None
        last = items[-1]
        if not isinstance(last, str):
            return items, None
        m = PARA_BLEED_RE.search(last)
        if m and m.start() > 10:
            items[-1] = last[:m.start()].rstrip(' ;,')
            return items, last[m.start():]
        return items, None

    def make_content(b):
        text = b['text'].strip()
        if '•' in text:
            parts = split_bullets(text)
            if len(parts) >= 2:
                if parts[0].endswith(':') or len(parts[0]) < 80:
                    intro = parts[0] if parts[0].endswith(':') else None
                    list_items = parts[1:] if intro else parts
                    result = []
                    if intro:
                        result.append({'type': 'paragraph', 'text': intro,
                                       'glossary_terms': []})
                    result.append({'type': 'list', 'items': list_items})
                    return result
        return [{'type': 'paragraph', 'text': text, 'glossary_terms': []}]

    pages = []
    current_page = None
    current_section = None

    def flush_section():
        if current_section and current_page:
            current_page['sections'].append(dict(current_section))

    def flush_page():
        flush_section()
        if current_page:
            pages.append(dict(current_page))

    for b in blocks:
        kind = b.get('kind')
        text = b.get('text', '').strip()

        if kind == 'red_heading':
            flush_page()
            pg_num = page_titles.get(text, '?')
            current_page = {'page_number': pg_num, 'page_title': text, 'sections': []}
            current_section = {'title': text, 'level': 1, 'content': []}
            continue

        if current_page is None:
            continue

        if kind == 'subheading':
            flush_section()
            current_section = {'title': text, 'level': 2, 'content': []}
            continue

        if kind == 'figure':
            fig_num  = b.get('figure_number', '')
            num_part = fig_num.split('-')[1] if '-' in fig_num else fig_num
            fig_item = {
                'type':          'figure',
                'figure_number': fig_num,
                'caption':       b.get('caption', ''),
                'image':         fig_images.get(num_part),
            }
            if current_section is not None:
                current_section['content'].append(fig_item)
            continue

        if kind == 'body' and current_section is not None:
            if len(text) < 8:
                continue
            current_section['content'].extend(make_content(b))

    flush_page()

    # Post-build: fix list bleed and merge consecutive lists
    for page in pages:
        for sec in page['sections']:
            items = sec['content']

            # Fix F: split trailing paragraph text off last list item
            new_items = []
            for item in items:
                new_items.append(item)
                if item['type'] == 'list':
                    clean, leftover = fix_list_bleed(item['items'])
                    item['items'] = [i for i in clean if i and i.strip()]
                    if leftover and len(leftover) > 10:
                        new_items.append({'type': 'paragraph', 'text': leftover,
                                          'glossary_terms': []})
            sec['content'] = new_items

            # Merge consecutive lists
            merged = []
            for item in sec['content']:
                if (merged and merged[-1]['type'] == 'list' and
                        item['type'] == 'list'):
                    merged[-1]['items'].extend(item['items'])
                else:
                    merged.append(item)
            sec['content'] = merged

    return pages


# ── Main entry point ───────────────────────────────────────────────────────
def extract_chapter(html_path, chapter_config):
    print(f"Reading {html_path}...")
    elements = extract_elements(html_path)
    print(f"  {len(elements)} text elements")

    elements = build_figure_objects(elements)
    figs = len([e for e in elements if e.get('kind') == 'figure'])
    print(f"  {figs} figures identified")

    blocks = merge_lines_to_blocks(elements)
    print(f"  {len(blocks)} blocks after line merging")

    blocks = post_process(blocks)
    print(f"  {len(blocks)} blocks after post-processing")

    pages = build_pages(blocks, chapter_config['page_titles'],
                        chapter_config['fig_images'])
    print(f"  {len(pages)} pages built")

    chapter = {
        'chapter_id':     chapter_config['chapter_id'],
        'chapter_number': chapter_config['chapter_number'],
        'title':          chapter_config['title'],
        'emoji':          chapter_config['emoji'],
        'pages':          pages,
    }
    json.dumps(chapter)  # validate
    print(f"  ✅ Valid JSON")
    return chapter


# ── Chapter configs ────────────────────────────────────────────────────────
CH1_CONFIG = {
    'chapter_id': 'phak-01', 'chapter_number': 1,
    'title': 'Introduction to Flying', 'emoji': '🛫',
    'page_titles': {
        'Introduction':                                          '1-1',
        'History of Flight':                                     '1-2',
        'History of the Federal Aviation Administration (FAA)':  '1-3',
        'The Role of the FAA':                                   '1-4',
        'Aircraft Classifications and Ultralight Vehicles':      '1-5',
        'Pilot Certifications':                                  '1-6',
        'Selecting a Flight School':                             '1-7',
        'The Student Pilot':                                     '1-8',
        'Becoming a Pilot':                                      '1-9',
        'Knowledge and Skill Tests':                             '1-10',
        'Chapter Summary':                                       '1-11',
    },
    'fig_images': {str(n): f'fig1-{n}.jpg' for n in range(1, 26)},
}

CONFIGS = {'1': CH1_CONFIG}



# ── Save chapter to project ────────────────────────────────────────────────
def save_chapter(chapter, project_root):
    """
    Save extracted chapter to src/data/chapters/chXXData.js
    Does NOT touch phakContent.js — that file just imports all chapters.
    """
    import os
    num = str(chapter['chapter_number']).zfill(2)
    var_name = f"ch{num}Data"
    filename = f"{var_name}.js"
    out_dir  = os.path.join(project_root, "src", "data", "chapters")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, filename)

    content = f"export const {var_name} = {json.dumps(chapter, indent=2, ensure_ascii=False)};\n"
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"  💾 Saved → {out_path}  ({len(content)//1024}KB)")
    return out_path


# ── CLI usage: python extract_chapter.py <html_file> <chapter_number> ─────
if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python extract_chapter.py <html_file> <chapter_number>")
        print("  e.g. python extract_chapter.py 04_phak_ch2.html 2")
        sys.exit(1)

    html_file = sys.argv[1]
    ch_num    = sys.argv[2]
    config    = CONFIGS.get(ch_num)

    if config is None:
        print(f"No config for chapter {ch_num}. Add CH{ch_num}_CONFIG to the script.")
        sys.exit(1)

    chapter  = extract_chapter(html_file, config)
    project  = os.path.dirname(os.path.abspath(__file__))
    save_chapter(chapter, project)
