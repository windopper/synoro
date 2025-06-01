import { generateStellarResources, generateRandomStarResources } from '../utils/stellarResourceGenerator';

export interface StarData {
  id: string;
  name: string;
  designation: string;
  constellation: string;
  apparentMagnitude: number;
  absoluteMagnitude: number;
  distance: number; // light years
  spectralClass: string;
  temperature: number; // Kelvin
  mass: number; // solar masses
  radius: number; // solar radii
  luminosity: number; // solar luminosities
  rightAscension: string;
  declination: string;
  description: string;
  discoveryInfo?: string;
  variableType?: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
  color: string;
  size: number;
  // 항성 자원 정보 추가
  stellarResources?: {
    primaryResources: { [resourceType: string]: number }; // 주요 자원 (타입별 기본 채취량/시간)
    rareResources?: { [resourceType: string]: number }; // 희귀 자원 (낮은 확률로 획득)
    extractionDifficulty: 'easy' | 'medium' | 'hard' | 'extreme'; // 채취 난이도
    renewalRate: number; // 자원 재생성 비율 (0-100%)
    specialConditions?: string[]; // 특수 채취 조건들
    maxExtractionsPerHour?: number; // 시간당 최대 채취 횟수
  };
}

export const starDatabase: StarData[] = [
  {
    id: "sirius",
    name: "Sirius",
    designation: "α Canis Majoris",
    constellation: "Canis Major",
    apparentMagnitude: -1.46,
    absoluteMagnitude: 1.43,
    distance: 8.6,
    spectralClass: "A1V",
    temperature: 9940,
    mass: 2.063,
    radius: 1.711,
    luminosity: 25.4,
    rightAscension: "06h 45m 08.9s",
    declination: "-16° 42' 58.0\"",
    description: "The brightest star in the night sky, a binary system with a white dwarf companion",
    discoveryInfo: "Known since ancient times, binary nature discovered in 1862",
    position: { x: -0, y: 0, z: -0 },
    color: "#9bb0ff",
    size: 0.8,
    stellarResources: {
      primaryResources: {
        '플라즈마 에너지': 15,
        '수소': 20,
        '헬륨': 12
      },
      rareResources: {
        '중수소': 3,
        '항성풍 입자': 5
      },
      extractionDifficulty: 'medium',
      renewalRate: 85,
      specialConditions: ['고온 저항 필요', '방사선 차폐 필요'],
      maxExtractionsPerHour: 4
    }
  },
  {
    id: "canopus",
    name: "Canopus",
    designation: "α Carinae",
    constellation: "Carina",
    apparentMagnitude: -0.74,
    absoluteMagnitude: -5.60,
    distance: 309,
    spectralClass: "F0II",
    temperature: 7280,
    mass: 8.5,
    radius: 65,
    luminosity: 10700,
    rightAscension: "06h 23m 57.1s",
    declination: "-52° 41' 44.4\"",
    description: "Second brightest star, a bright giant in the southern hemisphere",
    discoveryInfo: "Named after the pilot of the ship Argo in Greek mythology",
    position: { x: 200, y: -96, z: -240 },
    color: "#f9f5ff",
    size: 0.7,
    stellarResources: {
      primaryResources: {
        '플라즈마 에너지': 25,
        '중원소': 8,
        '헬륨-3': 6
      },
      rareResources: {
        '초중원소': 2,
        '항성 물질': 3
      },
      extractionDifficulty: 'hard',
      renewalRate: 75,
      specialConditions: ['거대항성 전용 장비 필요', '고압 환경 대응'],
      maxExtractionsPerHour: 3
    }
  },
  {
    id: "arcturus",
    name: "Arcturus",
    designation: "α Bootis",
    constellation: "Boötes",
    apparentMagnitude: -0.05,
    absoluteMagnitude: -0.30,
    distance: 37,
    spectralClass: "K1.5III",
    temperature: 4290,
    mass: 1.08,
    radius: 25.4,
    luminosity: 170,
    rightAscension: "14h 15m 39.7s",
    declination: "+19° 10' 56.7\"",
    description: "Fourth brightest star, an orange giant moving through space at high velocity",
    discoveryInfo: "First star to be seen in daylight through a telescope (1635)",
    position: { x: 144, y: 120, z: -200 },
    color: "#ffb347",
    size: 0.6,
    stellarResources: {
      primaryResources: {
        '금속 증기': 12,
        '헬륨': 10,
        '탄소': 8
      },
      rareResources: {
        '거대항성 물질': 4,
        '중원소 화합물': 2
      },
      extractionDifficulty: 'easy',
      renewalRate: 95,
      specialConditions: ['거대항성 접근 프로토콜'],
      maxExtractionsPerHour: 6
    }
  },
  {
    id: "vega",
    name: "Vega",
    designation: "α Lyrae",
    constellation: "Lyra",
    apparentMagnitude: 0.03,
    absoluteMagnitude: 0.60,
    distance: 25,
    spectralClass: "A0V",
    temperature: 9602,
    mass: 2.135,
    radius: 2.362,
    luminosity: 40.12,
    rightAscension: "18h 36m 56.3s",
    declination: "+38° 47' 01.3\"",
    description: "Former pole star, standard candle for magnitude scale, has debris disk",
    discoveryInfo: "First star photographed (1850) and first spectrum recorded (1872)",
    position: { x: -64, y: 176, z: -120 },
    color: "#9bb0ff",
    size: 0.65,
    stellarResources: {
      primaryResources: {
        '플라즈마 에너지': 18,
        '탄소': 8,
        '실리콘': 6
      },
      rareResources: {
        '성간먼지 입자': 4,
        '희토류 원소': 3
      },
      extractionDifficulty: 'medium',
      renewalRate: 90,
      specialConditions: ['성간 원반 지역 주의', '먼지 필터링 필요'],
      maxExtractionsPerHour: 5
    }
  },
  {
    id: "capella",
    name: "Capella",
    designation: "α Aurigae",
    constellation: "Auriga",
    apparentMagnitude: 0.08,
    absoluteMagnitude: -0.51,
    distance: 43,
    spectralClass: "G8III+G0III",
    temperature: 4970,
    mass: 2.569,
    radius: 11.98,
    luminosity: 78.7,
    rightAscension: "05h 16m 41.4s",
    declination: "+45° 59' 52.8\"",
    description: "Sixth brightest star, actually a complex quadruple star system",
    discoveryInfo: "First spectroscopic binary discovered (1899)",
    position: { x: -96, y: 144, z: -144 },
    color: "#fff2a1",
    size: 0.63,
    stellarResources: {
      primaryResources: {
        '플라즈마 에너지': 22,
        '수소': 18,
        '헬륨': 14
      },
      rareResources: {
        '연성 물질': 3,
        '중력파 공명물질': 1
      },
      extractionDifficulty: 'hard',
      renewalRate: 80,
      specialConditions: ['다중성계 동기화 필요', '궤도 안정성 모니터링'],
      maxExtractionsPerHour: 3
    }
  },
  {
    id: "rigel",
    name: "Rigel",
    designation: "β Orionis",
    constellation: "Orion",
    apparentMagnitude: 0.13,
    absoluteMagnitude: -7.0,
    distance: 860,
    spectralClass: "B8Iab",
    temperature: 12100,
    mass: 21,
    radius: 78.9,
    luminosity: 120000,
    rightAscension: "05h 14m 32.3s",
    declination: "-08° 12' 05.9\"",
    description: "Blue supergiant, one of the most luminous stars known",
    discoveryInfo: "Name from Arabic meaning 'foot of the great one'",
    position: { x: 240, y: -64, z: -320 },
    color: "#92c5f7",
    size: 0.75,
    stellarResources: {
      primaryResources: {
        '플라즈마 에너지': 35,
        '항성풍 입자': 12,
        '중원소': 8
      },
      rareResources: {
        '항성 물질': 2,
        '핵융합 입자': 4
      },
      extractionDifficulty: 'extreme',
      renewalRate: 60,
      specialConditions: ['초거대질량성 안전 프로토콜', '고온 저항 필요', '방사선 차폐 필요'],
      maxExtractionsPerHour: 2
    }
  },
  {
    id: "betelgeuse",
    name: "Betelgeuse",
    designation: "α Orionis",
    constellation: "Orion",
    apparentMagnitude: 0.50,
    absoluteMagnitude: -5.14,
    distance: 522,
    spectralClass: "M2Iab",
    temperature: 3605,
    mass: 17.8,
    radius: 640,
    luminosity: 60000,
    rightAscension: "05h 55m 10.3s",
    declination: "+07° 24' 25.4\"",
    description: "Red supergiant, semi-regular variable star, candidate for supernova",
    discoveryInfo: "Arabic name meaning 'shoulder of Orion', dimming events observed",
    variableType: "Semi-regular variable",
    position: { x: -160, y: 80, z: -280 },
    color: "#ff4500",
    size: 0.85,
    stellarResources: {
      primaryResources: {
        '적색거성 물질': 30,
        '중원소': 15,
        '철': 10
      },
      rareResources: {
        '방사성 동위원소': 5,
        '중성자 물질': 1,
        '초신성 전구물질': 2
      },
      extractionDifficulty: 'extreme',
      renewalRate: 60,
      specialConditions: ['변광성 활동 모니터링 필요', '초고온 대응 장비', '중력장 안정화'],
      maxExtractionsPerHour: 2
    }
  },
  {
    id: "altair",
    name: "Altair",
    designation: "α Aquilae",
    constellation: "Aquila",
    apparentMagnitude: 0.77,
    absoluteMagnitude: 2.22,
    distance: 16.7,
    spectralClass: "A7V",
    temperature: 7550,
    mass: 1.791,
    radius: 1.63,
    luminosity: 10.6,
    rightAscension: "19h 50m 47.0s",
    declination: "+08° 52' 05.9\"",
    description: "Rapidly rotating star, part of the Summer Triangle asterism",
    discoveryInfo: "One of the first stars to have its surface imaged",
    position: { x: 96, y: 64, z: -96 },
    color: "#cad8ff",
    size: 0.55,
    stellarResources: {
      primaryResources: {
        '플라즈마 에너지': 16,
        '실리콘': 8,
        '수소': 20
      },
      rareResources: {
        '성간먼지 입자': 3
      },
      extractionDifficulty: 'medium',
      renewalRate: 85,
      specialConditions: ['고온 저항 필요'],
      maxExtractionsPerHour: 4
    }
  },
  {
    id: "aldebaran",
    name: "Aldebaran",
    designation: "α Tauri",
    constellation: "Taurus",
    apparentMagnitude: 0.85,
    absoluteMagnitude: -0.70,
    distance: 67,
    spectralClass: "K5III",
    temperature: 3910,
    mass: 1.16,
    radius: 44.2,
    luminosity: 518,
    rightAscension: "04h 35m 55.2s",
    declination: "+16° 30' 33.5\"",
    description: "Orange giant, appears to be in Hyades cluster but is much closer",
    discoveryInfo: "Arabic name meaning 'the follower', follows the Pleiades",
    position: { x: -144, y: 96, z: -176 },
    color: "#ff8c00",
    size: 0.68,
    stellarResources: {
      primaryResources: {
        '금속 증기': 18,
        '탄소': 14,
        '철': 8
      },
      rareResources: {
        '거대항성 물질': 4
      },
      extractionDifficulty: 'easy',
      renewalRate: 85,
      specialConditions: ['거대항성 접근 프로토콜'],
      maxExtractionsPerHour: 6
    }
  },
  {
    id: "spica",
    name: "Spica",
    designation: "α Virginis",
    constellation: "Virgo",
    apparentMagnitude: 1.04,
    absoluteMagnitude: -3.38,
    distance: 250,
    spectralClass: "B1V+B4V",
    temperature: 22400,
    mass: 11.43,
    radius: 7.47,
    luminosity: 20500,
    rightAscension: "13h 25m 11.6s",
    declination: "-11° 09' 40.8\"",
    description: "Close binary system, rotating ellipsoidal variable star",
    discoveryInfo: "Used by Hipparchus to discover precession of equinoxes",
    variableType: "Ellipsoidal variable",
    position: { x: 176, y: -120, z: -224 },
    color: "#92c5f7",
    size: 0.72
  },
  {
    id: "antares",
    name: "Antares",
    designation: "α Scorpii",
    constellation: "Scorpius",
    apparentMagnitude: 1.06,
    absoluteMagnitude: -5.28,
    distance: 604,
    spectralClass: "M1.5Ib",
    temperature: 3570,
    mass: 12,
    radius: 883,
    luminosity: 57500,
    rightAscension: "16h 29m 24.5s",
    declination: "-26° 25' 55.2\"",
    description: "Red supergiant, semi-regular variable, rival of Mars in brightness",
    discoveryInfo: "Greek name meaning 'rival of Mars' due to similar color",
    variableType: "Semi-regular variable",
    position: { x: 280, y: -160, z: -360 },
    color: "#ff6b6b",
    size: 0.9
  },
  {
    id: "pollux",
    name: "Pollux",
    designation: "β Geminorum",
    constellation: "Gemini",
    apparentMagnitude: 1.14,
    absoluteMagnitude: 1.06,
    distance: 34,
    spectralClass: "K0III",
    temperature: 4666,
    mass: 1.91,
    radius: 8.8,
    luminosity: 43,
    rightAscension: "07h 45m 18.9s",
    declination: "+28° 01' 34.3\"",
    description: "Orange giant with confirmed exoplanet, nearest giant star to Earth",
    discoveryInfo: "Named after one of the Gemini twins in Greek mythology",
    position: { x: -80, y: 200, z: -128 },
    color: "#ffb347",
    size: 0.58
  }
  ];

// 랜덤하게 추가 별들을 생성하는 함수 (구형 분포, 최적화됨)
export function generateRandomStars(count: number = 20): StarData[] {
  const randomStars: StarData[] = [];
  const starNames = [
    "Proxima Centauri", "Wolf 359", "Lalande 21185", "UV Ceti", "Ross 154",
    "Ross 248", "Epsilon Eridani", "Lacaille 9352", "Ross 128", "EZ Aquarii",
    "Procyon B", "61 Cygni A", "Struve 2398 A", "Groombridge 34 A", "DX Cancri",
    "Tau Ceti", "Epsilon Indi", "YZ Ceti", "Luyten's Star", "Teegarden's Star",
    "Kapteyn's Star", "Lacaille 8760", "Kruger 60 A", "Ross 614 A", "Wolf 1061",
    "Van Maanen's Star", "Gliese 1", "Wolf 424 A", "TZ Arietis", "Gliese 687",
    "LHS 292", "LP 731-58", "GJ 1002", "Groombridge 1618", "Gliese 380",
    "Gliese 832", "LP 944-20", "Gliese 570 A", "HD 219134", "Gliese 581",
    "Wolf 1453", "Ross 780", "Gliese 849", "LP 816-60", "Wolf 294",
    "Gliese 412 A", "AD Leonis", "Gliese 588", "Gliese 682", "Wolf 489"
  ];

  for (let i = 0; i < count; i++) {
    const spectralClasses = ["O", "B", "A", "F", "G", "K", "M"];
    const spectralClass = spectralClasses[Math.floor(Math.random() * spectralClasses.length)];
    const subclass = Math.floor(Math.random() * 10);
    const luminosityClasses = ["V", "IV", "III", "II", "I"];
    const luminosity = luminosityClasses[Math.floor(Math.random() * luminosityClasses.length)];
    
    const distance = Math.random() * 200 + 10; // 10-210 light years (increased)
    const temperature = Math.random() * 20000 + 3000; // 3000-23000 K
    const mass = Math.random() * 20 + 0.1; // 0.1-20 solar masses
    const radius = Math.random() * 50 + 0.5; // 0.5-50 solar radii
    
    // Generate spherical coordinates for better distribution (optimized)
    const theta = Math.random() * Math.PI * 2; // Azimuth angle (0 to 2π)
    const phi = Math.acos(2 * Math.random() - 1); // Inclination angle (uniform on sphere)
    const r = 80 + Math.random() * 120; // Radius (80-200 units, optimized for performance)
    
    const colors = {
      'O': '#92c5f7', 'B': '#a2d2ff', 'A': '#cad8ff',
      'F': '#fff2a1', 'G': '#ffeb99', 'K': '#ffb347', 'M': '#ff6b6b'
    };

    // 자원 할당 생성
    const stellarResources = generateRandomStarResources(
      `${spectralClass}${subclass}${luminosity}`,
      temperature,
      mass,
      Math.random() * 1000 + 0.1
    );

    randomStars.push({
      id: `random-${i}`,
      name: starNames[i] || `Star ${i + 1}`,
      designation: `Random ${i + 1}`,
      constellation: "Various",
      apparentMagnitude: Math.random() * 8 + 2, // 2-10 magnitude (fainter stars)
      absoluteMagnitude: Math.random() * 10 - 2,
      distance,
      spectralClass: `${spectralClass}${subclass}${luminosity}`,
      temperature,
      mass,
      radius,
      luminosity: Math.random() * 1000 + 0.1,
      rightAscension: `${Math.floor(Math.random() * 24)}h ${Math.floor(Math.random() * 60)}m`,
      declination: `${Math.random() > 0.5 ? '+' : '-'}${Math.floor(Math.random() * 90)}°`,
      description: "Distant star revealed by deep observation",
      position: {
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi)
      },
      color: colors[spectralClass as keyof typeof colors] || '#ffffff',
      size: Math.random() * 0.8 + 0.4, // Smaller size for distant stars
      stellarResources
    });
  }

  return randomStars;
}

export function generateRenderableStars(allStars: StarData[]) {
  const starLayers: StarData[] = []
  const cameraCenter = { x: 0, y: 0, z: 0 } // Camera position as center
    
    // Base stars layer - close to camera
    starLayers.push(...allStars.map((star, index) => ({
      ...star,
      id: `base-${star.id}`,
      position: {
        x: cameraCenter.x + star.position.x * 0.6 + Math.sin(index) * 12,
        y: cameraCenter.y + star.position.y * 0.6 + Math.cos(index) * 12,
        z: cameraCenter.z + star.position.z * 0.6 + Math.sin(index * 2) * 12
      }
    })))
    
    // Generate many random stars in spherical distribution around camera
    const randomStars1 = generateRandomStars(300).map((star, index) => {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const radius = 20 + Math.random() * 60
      
      return {
        ...star,
        id: `random1-${index}`,
        position: {
          x: cameraCenter.x + radius * Math.sin(phi) * Math.cos(theta),
          y: cameraCenter.y + radius * Math.sin(phi) * Math.sin(theta),
          z: cameraCenter.z + radius * Math.cos(phi)
        },
        size: Math.max(0.8, star.size * (0.5 + Math.random() * 0.5)),
        apparentMagnitude: star.apparentMagnitude + Math.random() * 2
      }
    })
    starLayers.push(...randomStars1)
    
    // Second layer of random stars
    const randomStars2 = generateRandomStars(300).map((star, index) => {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const radius = 60 + Math.random() * 80
      
      return {
        ...star,
        id: `random2-${index}`,
        position: {
          x: cameraCenter.x + radius * Math.sin(phi) * Math.cos(theta),
          y: cameraCenter.y + radius * Math.sin(phi) * Math.sin(theta),
          z: cameraCenter.z + radius * Math.cos(phi)
        },
        size: Math.max(0.8, star.size * (0.4 + Math.random() * 0.4)),
        apparentMagnitude: star.apparentMagnitude + 1 + Math.random() * 2
      }
    })
    starLayers.push(...randomStars2)
    
    // Third layer of random stars
    const randomStars3 = generateRandomStars(300).map((star, index) => {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const radius = 120 + Math.random() * 120
      
      return {
        ...star,
        id: `random3-${index}`,
        position: {
          x: cameraCenter.x + radius * Math.sin(phi) * Math.cos(theta),
          y: cameraCenter.y + radius * Math.sin(phi) * Math.sin(theta),
          z: cameraCenter.z + radius * Math.cos(phi)
        },
        size: Math.max(0.8, star.size * (0.3 + Math.random() * 0.4)),
        apparentMagnitude: star.apparentMagnitude + 2 + Math.random() * 2
      }
    })
    starLayers.push(...randomStars3)
    
    // Fourth layer - medium distance
    const randomStars4 = generateRandomStars(350).map((star, index) => {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const radius = 200 + Math.random() * 150
      
      return {
        ...star,
        id: `random4-${index}`,
        position: {
          x: cameraCenter.x + radius * Math.sin(phi) * Math.cos(theta),
          y: cameraCenter.y + radius * Math.sin(phi) * Math.sin(theta),
          z: cameraCenter.z + radius * Math.cos(phi)
        },
        size: Math.max(0.8, star.size * (0.25 + Math.random() * 0.35)),
        apparentMagnitude: star.apparentMagnitude + 3 + Math.random() * 2
      }
    })
    starLayers.push(...randomStars4)
    
    // Fifth layer - far distance
    const randomStars5 = generateRandomStars(300).map((star, index) => {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const radius = 300 + Math.random() * 200
      
      return {
        ...star,
        id: `random5-${index}`,
        position: {
          x: cameraCenter.x + radius * Math.sin(phi) * Math.cos(theta),
          y: cameraCenter.y + radius * Math.sin(phi) * Math.sin(theta),
          z: cameraCenter.z + radius * Math.cos(phi)
        },
        size: Math.max(0.8, star.size * (0.2 + Math.random() * 0.3)),
        apparentMagnitude: star.apparentMagnitude + 4 + Math.random() * 2
      }
    })
    starLayers.push(...randomStars5)
    
    // Additional layers using allStars variations
    // Close layer variations
    for (let layer = 0; layer < 3; layer++) {
      starLayers.push(...allStars.map((star, index) => ({
        ...star,
        id: `layer${layer}-${star.id}`,
        position: {
          x: cameraCenter.x + star.position.x * (1 + layer * 0.5) + Math.sin(index + layer) * (20 + layer * 15),
          y: cameraCenter.y + star.position.y * (1 + layer * 0.5) + Math.cos(index + layer) * (20 + layer * 15),
          z: cameraCenter.z + star.position.z * (1 + layer * 0.5) + Math.sin(index * 2 + layer) * (20 + layer * 15)
        },
        apparentMagnitude: star.apparentMagnitude + 0.5 + layer * 0.5,
        size: Math.max(0.8, star.size * (1 - layer * 0.1))
      })))
    }
    
    // Background distant stars
    const backgroundStars = generateRandomStars(700).map((star, index) => {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const radius = 400 + Math.random() * 300
      
      return {
        ...star,
        id: `background-${index}`,
        position: {
          x: cameraCenter.x + radius * Math.sin(phi) * Math.cos(theta),
          y: cameraCenter.y + radius * Math.sin(phi) * Math.sin(theta),
          z: cameraCenter.z + radius * Math.cos(phi)
        },
        size: Math.max(0.8, star.size * (0.15 + Math.random() * 0.25)),
        apparentMagnitude: star.apparentMagnitude + 5 + Math.random() * 3
      }
    })
    starLayers.push(...backgroundStars)
    
    console.log(`Generated ${starLayers.length} total stars`)
    return starLayers
}

// 기존 별들에 자원이 없는 경우 자원 할당
export function updateStarsWithResources(): StarData[] {
  return starDatabase.map(star => {
    if (!star.stellarResources) {
      const stellarResources = generateStellarResources(star);
      return {
        ...star,
        stellarResources
      };
    }
    return star;
  });
}

// 자원이 업데이트된 별 데이터베이스
export const starDatabaseWithResources = updateStarsWithResources();

export const allStars = [...starDatabaseWithResources]; // 자원이 포함된 별들 사용 