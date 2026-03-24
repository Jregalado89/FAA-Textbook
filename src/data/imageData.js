// PHAK Images and Figures Database
// Maps figure numbers to their metadata and file locations

export const phakImages = {
  // Chapter 5: Aerodynamics
  '5-1': {
    chapter: 5,
    figureNumber: '5-1',
    title: 'Four Forces of Flight',
    caption: 'The four forces acting on an aircraft in straight-and-level, unaccelerated flight are thrust, drag, lift, and weight.',
    page: '5-2',
    filename: 'figure-5-1.png',
    alt: 'Diagram showing four forces: lift (up), weight (down), thrust (forward), drag (backward)'
  },
  '5-2': {
    chapter: 5,
    figureNumber: '5-2',
    title: 'Lift',
    caption: 'Lift is the upward force created by the effect of airflow as it passes over and under the wing.',
    page: '5-3',
    filename: 'figure-5-2.png',
    alt: 'Airfoil cross-section showing airflow and lift generation'
  },
  
  // Chapter 7: Aircraft Systems
  '7-1': {
    chapter: 7,
    figureNumber: '7-1',
    title: 'Pitot-Static System',
    caption: 'The pitot-static system provides pressure for the airspeed indicator, altimeter, and vertical speed indicator.',
    page: '7-2',
    filename: 'figure-7-1.png',
    alt: 'Diagram of pitot tube and static ports connected to flight instruments'
  },
  '7-2': {
    chapter: 7,
    figureNumber: '7-2',
    title: 'Airspeed Indicator',
    caption: 'The airspeed indicator shows the speed of the aircraft through the air.',
    page: '7-3',
    filename: 'figure-7-2.png',
    alt: 'Airspeed indicator with colored arcs and markings'
  },
  '7-3': {
    chapter: 7,
    figureNumber: '7-3',
    title: 'Altimeter',
    caption: 'The altimeter displays the aircraft altitude above mean sea level.',
    page: '7-5',
    filename: 'figure-7-3.png',
    alt: 'Altimeter with three hands and barometric pressure setting window'
  },
  '7-4': {
    chapter: 7,
    figureNumber: '7-4',
    title: 'Vertical Speed Indicator',
    caption: 'The VSI indicates the rate of climb or descent in feet per minute.',
    page: '7-7',
    filename: 'figure-7-4.png',
    alt: 'Vertical speed indicator showing climb and descent rates'
  },
  '7-5': {
    chapter: 7,
    figureNumber: '7-5',
    title: 'Attitude Indicator',
    caption: 'The attitude indicator displays the aircraft pitch and bank attitude.',
    page: '7-9',
    filename: 'figure-7-5.png',
    alt: 'Attitude indicator with miniature airplane and horizon line'
  },
  '7-6': {
    chapter: 7,
    figureNumber: '7-6',
    title: 'Heading Indicator',
    caption: 'The heading indicator displays the aircraft heading based on gyroscopic principles.',
    page: '7-11',
    filename: 'figure-7-6.png',
    alt: 'Heading indicator with compass card'
  },
  '7-7': {
    chapter: 7,
    figureNumber: '7-7',
    title: 'Turn Coordinator',
    caption: 'The turn coordinator indicates the rate of turn and coordination of the turn.',
    page: '7-13',
    filename: 'figure-7-7.png',
    alt: 'Turn coordinator with miniature airplane and inclinometer'
  },
  
  // Chapter 8: Flight Instruments
  '8-1': {
    chapter: 8,
    figureNumber: '8-1',
    title: 'Standard Six-Pack Instrument Panel',
    caption: 'Traditional "six-pack" arrangement of flight instruments.',
    page: '8-1',
    filename: 'figure-8-1.png',
    alt: 'Six flight instruments arranged in standard T-pattern'
  },
  
  // Chapter 12: Weather Theory
  '12-1': {
    chapter: 12,
    figureNumber: '12-1',
    title: 'Atmospheric Circulation',
    caption: 'Global wind patterns and atmospheric circulation cells.',
    page: '12-3',
    filename: 'figure-12-1.png',
    alt: 'Earth showing Hadley, Ferrel, and Polar cells'
  },
  '12-2': {
    chapter: 12,
    figureNumber: '12-2',
    title: 'Cloud Types',
    caption: 'Classification of clouds by altitude and form.',
    page: '12-8',
    filename: 'figure-12-2.png',
    alt: 'Diagram showing cumulus, stratus, and cirrus cloud types at different altitudes'
  },
  
  // Add more as needed - this is a starter set
};

export const getImageByFigure = (figureNumber) => {
  return phakImages[figureNumber] || null;
};

export const getImagesByChapter = (chapterNumber) => {
  return Object.values(phakImages).filter(img => img.chapter === chapterNumber);
};

// Placeholder image component data
export const imagePlaceholder = {
  filename: 'placeholder.png',
  alt: 'Figure placeholder - Image extraction in progress',
  showPlaceholder: true
};
