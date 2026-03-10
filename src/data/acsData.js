// ACS (Airman Certification Standards) Database
// FAA-S-ACS-6C - Private Pilot Airplane
// Format: Area.Task.Element (e.g., PA.I.H.K4)

export const acsData = {
  // AREA I: PREFLIGHT PREPARATION
  
  // Task H: Operation of Systems
  'PA.I.H.K1': {
    area: 'I', areaTitle: 'Preflight Preparation',
    task: 'H', taskTitle: 'Operation of Systems',
    element: 'K1', elementType: 'Knowledge',
    description: 'Primary flight controls and trim',
    references: ['FAA-H-8083-25'],
    objectives: ['Explain primary flight control systems', 'Describe trim systems and operation']
  },
  'PA.I.H.K2': {
    area: 'I', areaTitle: 'Preflight Preparation',
    task: 'H', taskTitle: 'Operation of Systems',
    element: 'K2', elementType: 'Knowledge',
    description: 'Flaps, leading edge devices, and spoilers',
    references: ['FAA-H-8083-25'],
    objectives: ['Explain flap systems and types', 'Describe leading edge devices', 'Explain spoiler operation']
  },
  'PA.I.H.K3': {
    area: 'I', areaTitle: 'Preflight Preparation',
    task: 'H', taskTitle: 'Operation of Systems',
    element: 'K3', elementType: 'Knowledge',
    description: 'Pitot-static system and associated flight instruments',
    references: ['FAA-H-8083-25'],
    objectives: [
      'Explain pitot-static system components and operation',
      'Describe airspeed indicator, altimeter, and VSI',
      'Identify pitot-static errors and malfunctions',
      'Explain effects of blockages'
    ]
  },
  'PA.I.H.K4': {
    area: 'I', areaTitle: 'Preflight Preparation',
    task: 'H', taskTitle: 'Operation of Systems',
    element: 'K4', elementType: 'Knowledge',
    description: 'Vacuum/pressure and electrical systems',
    references: ['FAA-H-8083-25'],
    objectives: [
      'Explain vacuum/pressure system operation',
      'Describe gyroscopic instruments',
      'Explain electrical system components',
      'Identify system failures and responses'
    ]
  },
  'PA.I.H.K5': {
    area: 'I', areaTitle: 'Preflight Preparation',
    task: 'H', taskTitle: 'Operation of Systems',
    element: 'K5', elementType: 'Knowledge',
    description: 'Powerplant and propeller',
    references: ['FAA-H-8083-25'],
    objectives: ['Explain engine operation', 'Describe propeller types and operation', 'Identify engine instruments']
  },
  'PA.I.H.K6': {
    area: 'I', areaTitle: 'Preflight Preparation',
    task: 'H', taskTitle: 'Operation of Systems',
    element: 'K6', elementType: 'Knowledge',
    description: 'Landing gear',
    references: ['FAA-H-8083-25'],
    objectives: ['Explain landing gear types', 'Describe retractable gear systems', 'Identify gear position indicators']
  },
  'PA.I.H.K7': {
    area: 'I', areaTitle: 'Preflight Preparation',
    task: 'H', taskTitle: 'Operation of Systems',
    element: 'K7', elementType: 'Knowledge',
    description: 'Fuel system',
    references: ['FAA-H-8083-25'],
    objectives: ['Explain fuel system components', 'Describe fuel types and grades', 'Identify fuel contamination']
  },
  'PA.I.H.K8': {
    area: 'I', areaTitle: 'Preflight Preparation',
    task: 'H', taskTitle: 'Operation of Systems',
    element: 'K8', elementType: 'Knowledge',
    description: 'Oil system',
    references: ['FAA-H-8083-25'],
    objectives: ['Explain lubrication system', 'Describe oil types and grades', 'Identify oil pressure and temperature']
  },
  'PA.I.H.K9': {
    area: 'I', areaTitle: 'Preflight Preparation',
    task: 'H', taskTitle: 'Operation of Systems',
    element: 'K9', elementType: 'Knowledge',
    description: 'Hydraulic system',
    references: ['FAA-H-8083-25'],
    objectives: ['Explain hydraulic system operation', 'Identify hydraulic components']
  },
  'PA.I.H.K10': {
    area: 'I', areaTitle: 'Preflight Preparation',
    task: 'H', taskTitle: 'Operation of Systems',
    element: 'K10', elementType: 'Knowledge',
    description: 'Environmental systems',
    references: ['FAA-H-8083-25'],
    objectives: ['Explain heating and cooling systems', 'Describe ventilation', 'Identify carbon monoxide hazards']
  },
  'PA.I.H.K11': {
    area: 'I', areaTitle: 'Preflight Preparation',
    task: 'H', taskTitle: 'Operation of Systems',
    element: 'K11', elementType: 'Knowledge',
    description: 'Deicing and anti-icing systems',
    references: ['FAA-H-8083-25'],
    objectives: ['Explain ice protection systems', 'Describe pitot heat and carburetor heat']
  },
  'PA.I.H.K12': {
    area: 'I', areaTitle: 'Preflight Preparation',
    task: 'H', taskTitle: 'Operation of Systems',
    element: 'K12', elementType: 'Knowledge',
    description: 'Avionics',
    references: ['FAA-H-8083-25'],
    objectives: ['Explain communication equipment', 'Describe navigation systems', 'Identify transponder operation']
  }
};

export const getACSInfo = (code) => {
  return acsData[code] || {
    area: code.split('.')[1],
    areaTitle: 'ACS Information',
    task: code.split('.')[2],
    taskTitle: 'See FAA-S-ACS-6C for details',
    element: code.split('.')[3] || code.split('.')[2],
    elementType: 'Knowledge',
    description: 'Full ACS database - 12 codes loaded',
    references: ['FAA-S-ACS-6C'],
    objectives: ['Refer to official ACS document for complete information']
  };
};

export const acsAreas = {
  'I': 'Preflight Preparation',
  'II': 'Preflight Procedures',
  'III': 'Airport Operations',
  'IV': 'Takeoffs, Landings, and Go-Arounds',
  'V': 'Performance and Ground Reference Maneuvers',
  'VI': 'Navigation',
  'VII': 'Slow Flight and Stalls',
  'VIII': 'Basic Instrument Maneuvers',
  'IX': 'Emergency Operations',
  'X': 'Night Operations',
  'XI': 'Postflight Procedures'
};
