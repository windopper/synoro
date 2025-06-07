import { ARM_Y_DIST, ARM_Y_MEAN } from "../config/galaxyConfig";
import { ARM_X_DIST, ARM_X_MEAN, ARMS, SPIRAL } from "../config/galaxyConfig";
import {
  CORE_X_DIST,
  CORE_Y_DIST,
  GALAXY_THICKNESS,
  OUTER_CORE_X_DIST,
  OUTER_CORE_Y_DIST,
} from "../config/galaxyConfig";
import { gaussianRandom, spiral } from "../utils/math";
import {
  generateStellarResources,
  generateRandomStarResources,
} from "../utils/stellarResourceGenerator";
import * as THREE from "three";

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
    extractionDifficulty: "easy" | "medium" | "hard" | "extreme"; // 채취 난이도
    renewalRate: number; // 자원 재생성 비율 (0-100%)
    specialConditions?: string[]; // 특수 채취 조건들
    maxExtractionsPerHour?: number; // 시간당 최대 채취 횟수
  };
  isVisible?: boolean;
  isScanned?: boolean;
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
    description:
      "The brightest star in the night sky, a binary system with a white dwarf companion",
    discoveryInfo:
      "Known since ancient times, binary nature discovered in 1862",
    position: { x: -0, y: 0, z: -0 },
    color: "#9bb0ff",
    size: 0.3,
    stellarResources: {
      primaryResources: {
        "플라즈마 에너지": 15,
        수소: 20,
        헬륨: 12,
      },
      rareResources: {
        중수소: 3,
        "항성풍 입자": 5,
      },
      extractionDifficulty: "medium",
      renewalRate: 85,
      specialConditions: ["고온 저항 필요", "방사선 차폐 필요"],
      maxExtractionsPerHour: 4,
    },
  },
  {
    id: "canopus",
    name: "Canopus",
    designation: "α Carinae",
    constellation: "Carina",
    apparentMagnitude: -0.74,
    absoluteMagnitude: -5.6,
    distance: 309,
    spectralClass: "F0II",
    temperature: 7280,
    mass: 8.5,
    radius: 65,
    luminosity: 10700,
    rightAscension: "06h 23m 57.1s",
    declination: "-52° 41' 44.4\"",
    description:
      "Second brightest star, a bright giant in the southern hemisphere",
    discoveryInfo: "Named after the pilot of the ship Argo in Greek mythology",
    position: { x: 200, y: -96, z: -240 },
    color: "#f9f5ff",
    size: 0.25,
    stellarResources: {
      primaryResources: {
        "플라즈마 에너지": 25,
        중원소: 8,
        "헬륨-3": 6,
      },
      rareResources: {
        초중원소: 2,
        "항성 물질": 3,
      },
      extractionDifficulty: "hard",
      renewalRate: 75,
      specialConditions: ["거대항성 전용 장비 필요", "고압 환경 대응"],
      maxExtractionsPerHour: 3,
    },
  },
  {
    id: "arcturus",
    name: "Arcturus",
    designation: "α Bootis",
    constellation: "Boötes",
    apparentMagnitude: -0.05,
    absoluteMagnitude: -0.3,
    distance: 37,
    spectralClass: "K1.5III",
    temperature: 4290,
    mass: 1.08,
    radius: 25.4,
    luminosity: 170,
    rightAscension: "14h 15m 39.7s",
    declination: "+19° 10' 56.7\"",
    description:
      "Fourth brightest star, an orange giant moving through space at high velocity",
    discoveryInfo:
      "First star to be seen in daylight through a telescope (1635)",
    position: { x: 144, y: 120, z: -200 },
    color: "#ffb347",
    size: 0.22,
    stellarResources: {
      primaryResources: {
        "금속 증기": 12,
        헬륨: 10,
        탄소: 8,
      },
      rareResources: {
        "거대항성 물질": 4,
        "중원소 화합물": 2,
      },
      extractionDifficulty: "easy",
      renewalRate: 95,
      specialConditions: ["거대항성 접근 프로토콜"],
      maxExtractionsPerHour: 6,
    },
  },
  {
    id: "vega",
    name: "Vega",
    designation: "α Lyrae",
    constellation: "Lyra",
    apparentMagnitude: 0.03,
    absoluteMagnitude: 0.6,
    distance: 25,
    spectralClass: "A0V",
    temperature: 9602,
    mass: 2.135,
    radius: 2.362,
    luminosity: 40.12,
    rightAscension: "18h 36m 56.3s",
    declination: "+38° 47' 01.3\"",
    description:
      "Former pole star, standard candle for magnitude scale, has debris disk",
    discoveryInfo:
      "First star photographed (1850) and first spectrum recorded (1872)",
    position: { x: -64, y: 176, z: -120 },
    color: "#9bb0ff",
    size: 0.23,
    stellarResources: {
      primaryResources: {
        "플라즈마 에너지": 18,
        탄소: 8,
        실리콘: 6,
      },
      rareResources: {
        "성간먼지 입자": 4,
        "희토류 원소": 3,
      },
      extractionDifficulty: "medium",
      renewalRate: 90,
      specialConditions: ["성간 원반 지역 주의", "먼지 필터링 필요"],
      maxExtractionsPerHour: 5,
    },
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
    description:
      "Sixth brightest star, actually a complex quadruple star system",
    discoveryInfo: "First spectroscopic binary discovered (1899)",
    position: { x: -96, y: 144, z: -144 },
    color: "#fff2a1",
    size: 0.21,
    stellarResources: {
      primaryResources: {
        "플라즈마 에너지": 22,
        수소: 18,
        헬륨: 14,
      },
      rareResources: {
        "연성 물질": 3,
        "중력파 공명물질": 1,
      },
      extractionDifficulty: "hard",
      renewalRate: 80,
      specialConditions: ["다중성계 동기화 필요", "궤도 안정성 모니터링"],
      maxExtractionsPerHour: 3,
    },
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
    size: 0.27,
    stellarResources: {
      primaryResources: {
        "플라즈마 에너지": 35,
        "항성풍 입자": 12,
        중원소: 8,
      },
      rareResources: {
        "항성 물질": 2,
        "핵융합 입자": 4,
      },
      extractionDifficulty: "extreme",
      renewalRate: 60,
      specialConditions: [
        "초거대질량성 안전 프로토콜",
        "고온 저항 필요",
        "방사선 차폐 필요",
      ],
      maxExtractionsPerHour: 2,
    },
  },
  {
    id: "betelgeuse",
    name: "Betelgeuse",
    designation: "α Orionis",
    constellation: "Orion",
    apparentMagnitude: 0.5,
    absoluteMagnitude: -5.14,
    distance: 522,
    spectralClass: "M2Iab",
    temperature: 3605,
    mass: 17.8,
    radius: 640,
    luminosity: 60000,
    rightAscension: "05h 55m 10.3s",
    declination: "+07° 24' 25.4\"",
    description:
      "Red supergiant, semi-regular variable star, candidate for supernova",
    discoveryInfo:
      "Arabic name meaning 'shoulder of Orion', dimming events observed",
    variableType: "Semi-regular variable",
    position: { x: -160, y: 80, z: -280 },
    color: "#ff4500",
    size: 0.3,
    stellarResources: {
      primaryResources: {
        "적색거성 물질": 30,
        중원소: 15,
        철: 10,
      },
      rareResources: {
        "방사성 동위원소": 5,
        "중성자 물질": 1,
        "초신성 전구물질": 2,
      },
      extractionDifficulty: "extreme",
      renewalRate: 60,
      specialConditions: [
        "변광성 활동 모니터링 필요",
        "초고온 대응 장비",
        "중력장 안정화",
      ],
      maxExtractionsPerHour: 2,
    },
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
    size: 0.19,
    stellarResources: {
      primaryResources: {
        "플라즈마 에너지": 16,
        실리콘: 8,
        수소: 20,
      },
      rareResources: {
        "성간먼지 입자": 3,
      },
      extractionDifficulty: "medium",
      renewalRate: 85,
      specialConditions: ["고온 저항 필요"],
      maxExtractionsPerHour: 4,
    },
  },
  {
    id: "aldebaran",
    name: "Aldebaran",
    designation: "α Tauri",
    constellation: "Taurus",
    apparentMagnitude: 0.85,
    absoluteMagnitude: -0.7,
    distance: 67,
    spectralClass: "K5III",
    temperature: 3910,
    mass: 1.16,
    radius: 44.2,
    luminosity: 518,
    rightAscension: "04h 35m 55.2s",
    declination: "+16° 30' 33.5\"",
    description:
      "Orange giant, appears to be in Hyades cluster but is much closer",
    discoveryInfo: "Arabic name meaning 'the follower', follows the Pleiades",
    position: { x: -144, y: 96, z: -176 },
    color: "#ff8c00",
    size: 0.24,
    stellarResources: {
      primaryResources: {
        "금속 증기": 18,
        탄소: 14,
        철: 8,
      },
      rareResources: {
        "거대항성 물질": 4,
      },
      extractionDifficulty: "easy",
      renewalRate: 85,
      specialConditions: ["거대항성 접근 프로토콜"],
      maxExtractionsPerHour: 6,
    },
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
    size: 0.26,
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
    description:
      "Red supergiant, semi-regular variable, rival of Mars in brightness",
    discoveryInfo: "Greek name meaning 'rival of Mars' due to similar color",
    variableType: "Semi-regular variable",
    position: { x: 280, y: -160, z: -360 },
    color: "#ff6b6b",
    size: 0.32,
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
    description:
      "Orange giant with confirmed exoplanet, nearest giant star to Earth",
    discoveryInfo: "Named after one of the Gemini twins in Greek mythology",
    position: { x: -80, y: 200, z: -128 },
    color: "#ffb347",
    size: 0.2,
  },
];

const spectralClasses = ["O", "B", "A", "F", "G", "K", "M"];
const luminosityClasses = ["V", "IV", "III", "II", "I"];

export function generateRandomStars(count: number = 20): StarData[] {
  const randomStars: StarData[] = [];
  const starNames = [
    "Proxima Centauri",
    "Wolf 359",
    "Lalande 21185",
    "UV Ceti",
    "Ross 154",
    "Ross 248",
    "Epsilon Eridani",
    "Lacaille 9352",
    "Ross 128",
    "EZ Aquarii",
    "Procyon B",
    "61 Cygni A",
    "Struve 2398 A",
    "Groombridge 34 A",
    "DX Cancri",
    "Tau Ceti",
    "Epsilon Indi",
    "YZ Ceti",
    "Luyten's Star",
    "Teegarden's Star",
    "Kapteyn's Star",
    "Lacaille 8760",
    "Kruger 60 A",
    "Ross 614 A",
    "Wolf 1061",
    "Van Maanen's Star",
    "Gliese 1",
    "Wolf 424 A",
    "TZ Arietis",
    "Gliese 687",
    "LHS 292",
    "LP 731-58",
    "GJ 1002",
    "Groombridge 1618",
    "Gliese 380",
    "Gliese 832",
    "LP 944-20",
    "Gliese 570 A",
    "HD 219134",
    "Gliese 581",
    "Wolf 1453",
    "Ross 780",
    "Gliese 849",
    "LP 816-60",
    "Wolf 294",
    "Gliese 412 A",
    "AD Leonis",
    "Gliese 588",
    "Gliese 682",
    "Wolf 489",
  ];

  const positions = [];

  for (let i = 0; i < count / 4; i++) {
    let pos = new THREE.Vector3(
      gaussianRandom(0, CORE_X_DIST),
      gaussianRandom(0, GALAXY_THICKNESS),
      gaussianRandom(0, CORE_Y_DIST),
    );
    positions.push(pos);
  }

  for (let i = 0; i < count / 4; i++) {
    let pos = new THREE.Vector3(
      gaussianRandom(0, OUTER_CORE_X_DIST),
      gaussianRandom(0, GALAXY_THICKNESS),
      gaussianRandom(0, OUTER_CORE_Y_DIST),
    );
    positions.push(pos);
  }

  for (let j = 0; j < ARMS; j++) {
    for (let i = 0; i < count / 4; i++) {
      let pos = spiral(
        gaussianRandom(ARM_X_MEAN, ARM_X_DIST),
        gaussianRandom(0, GALAXY_THICKNESS),
        gaussianRandom(ARM_Y_MEAN, ARM_Y_DIST),
        (j * 2 * Math.PI) / ARMS
      );
      positions.push(pos);
    }
  }

  for (let i = 0; i < count; i++) {
    const spectralClass =
      spectralClasses[Math.floor(Math.random() * spectralClasses.length)];
    const subclass = Math.floor(Math.random() * 10);
    const luminosity =
      luminosityClasses[Math.floor(Math.random() * luminosityClasses.length)];

    const distance = Math.random() * 200 + 10; // 10-210 light years (increased)
    const temperature = Math.random() * 20000 + 3000; // 3000-23000 K
    const mass = Math.random() * 20 + 0.1; // 0.1-20 solar masses
    const radius = Math.random() * 50 + 0.5; // 0.5-50 solar radii

    // Generate spherical coordinates for better distribution (wider spacing)
    const theta = Math.random() * Math.PI * 2; // Azimuth angle (0 to 2π)
    const phi = Math.acos(2 * Math.random() - 1); // Inclination angle (uniform on sphere)
    const r = 200 + Math.random() * 400; // Radius (200-600 units, wider distribution for realistic spacing)

    const colors = {
      O: "#92c5f7",
      B: "#a2d2ff",
      A: "#cad8ff",
      F: "#fff2a1",
      G: "#ffeb99",
      K: "#ffb347",
      M: "#ff6b6b",
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
      rightAscension: `${Math.floor(Math.random() * 24)}h ${Math.floor(
        Math.random() * 60
      )}m`,
      declination: `${Math.random() > 0.5 ? "+" : "-"}${Math.floor(
        Math.random() * 90
      )}°`,
      description: "Distant star revealed by deep observation",
      position: positions[i],
      color: colors[spectralClass as keyof typeof colors] || "#ffffff",
      size: Math.random() * 0.4 + 0.2, // Much smaller size for realistic scale and distance perception
      stellarResources,
    });
  }

  return randomStars;
}

// 은하 위치에 따른 항성 밀도 계산 함수 (x, z축에 평행한 은하)
function getGalacticDensity(x: number, y: number, z: number): number {
  const r = Math.sqrt(x * x + z * z); // x, z축 평면에서의 거리
  const yFactor = Math.exp(-(y * y) / (2 * GALAXY_THICKNESS * GALAXY_THICKNESS)); // y축이 은하 두께
  
  // 중심 영역 밀도 (x, z축 평면)
  const coreDistance = Math.sqrt((x * x) / (CORE_X_DIST * CORE_X_DIST) + (z * z) / (CORE_Y_DIST * CORE_Y_DIST));
  const coreDensity = coreDistance < 1 ? Math.exp(-coreDistance * 2) * 3.0 : 0;
  
  // 외곽 중심 영역 밀도 (x, z축 평면)
  const outerCoreDistance = Math.sqrt((x * x) / (OUTER_CORE_X_DIST * OUTER_CORE_X_DIST) + (z * z) / (OUTER_CORE_Y_DIST * OUTER_CORE_Y_DIST));
  const outerCoreDensity = outerCoreDistance < 1 ? Math.exp(-outerCoreDistance) * 1.5 : 0;
  
  // 나선팔 밀도 계산 (x, z축 평면)
  let spiralDensity = 0;
  for (let arm = 0; arm < ARMS; arm++) {
    const armAngle = (arm * 2 * Math.PI) / ARMS;
    let theta = Math.atan2(z, x); // x, z축 평면에서의 각도
    if (theta < 0) theta += 2 * Math.PI;
    
    const expectedTheta = armAngle + (r / ARM_X_DIST) * SPIRAL;
    let deltaTheta = Math.abs(theta - expectedTheta);
    
    // 각도 차이를 최소화 (원형이므로)
    if (deltaTheta > Math.PI) deltaTheta = 2 * Math.PI - deltaTheta;
    
    const armWidth = Math.PI / 8; // 나선팔 너비
    if (deltaTheta < armWidth) {
      const armStrength = Math.exp(-(deltaTheta * deltaTheta) / (2 * (armWidth / 3) * (armWidth / 3)));
      const radialFalloff = Math.exp(-Math.abs(r - ARM_X_MEAN) / ARM_X_DIST);
      spiralDensity += armStrength * radialFalloff * 2.0;
    }
  }
  
  return (coreDensity + outerCoreDensity + spiralDensity) * yFactor;
}

// 은하 분포에 따른 항성 종류 결정 (x, z축에 평행한 은하)
function getStarTypeByLocation(x: number, y: number, z: number): { spectralClass: string; luminosityClass: string; temperature: number; mass: number; color: string } {
  const r = Math.sqrt(x * x + z * z); // x, z축 평면에서의 거리
  const coreDistance = Math.sqrt((x * x) / (CORE_X_DIST * CORE_X_DIST) + (z * z) / (CORE_Y_DIST * CORE_Y_DIST));
  
  const spectralClasses = ["O", "B", "A", "F", "G", "K", "M"];
  const luminosityClasses = ["V", "IV", "III", "II", "I"];
  const colors = {
    O: "#92c5f7", B: "#a2d2ff", A: "#cad8ff", 
    F: "#fff2a1", G: "#ffeb99", K: "#ffb347", M: "#ff6b6b"
  };
  
  let spectralClass: string;
  let luminosityClass: string;
  let temperature: number;
  let mass: number;
  
  // 중심부일수록 더 무겁고 뜨거운 별
  if (coreDistance < 0.5) {
    // 은하 중심 - 무거운 별들이 많음
    const rand = Math.random();
    if (rand < 0.1) spectralClass = "O";
    else if (rand < 0.25) spectralClass = "B";
    else if (rand < 0.4) spectralClass = "A";
    else if (rand < 0.6) spectralClass = "F";
    else if (rand < 0.8) spectralClass = "G";
    else if (rand < 0.9) spectralClass = "K";
    else spectralClass = "M";
    
    temperature = 20000 + Math.random() * 25000;
    mass = 5 + Math.random() * 30;
  } else if (coreDistance < 1.0) {
    // 중간 영역
    const rand = Math.random();
    if (rand < 0.05) spectralClass = "O";
    else if (rand < 0.15) spectralClass = "B";
    else if (rand < 0.3) spectralClass = "A";
    else if (rand < 0.5) spectralClass = "F";
    else if (rand < 0.7) spectralClass = "G";
    else if (rand < 0.85) spectralClass = "K";
    else spectralClass = "M";
    
    temperature = 10000 + Math.random() * 15000;
    mass = 2 + Math.random() * 15;
  } else {
    // 외곽 영역 - 작고 차가운 별들이 많음
    const rand = Math.random();
    if (rand < 0.01) spectralClass = "O";
    else if (rand < 0.05) spectralClass = "B";
    else if (rand < 0.15) spectralClass = "A";
    else if (rand < 0.3) spectralClass = "F";
    else if (rand < 0.5) spectralClass = "G";
    else if (rand < 0.75) spectralClass = "K";
    else spectralClass = "M";
    
    temperature = 3000 + Math.random() * 10000;
    mass = 0.3 + Math.random() * 5;
  }
  
  // 광도 계급 결정
  const lumRand = Math.random();
  if (mass > 20) luminosityClass = lumRand < 0.7 ? "I" : "II";
  else if (mass > 8) luminosityClass = lumRand < 0.4 ? "I" : lumRand < 0.7 ? "II" : "III";
  else if (mass > 3) luminosityClass = lumRand < 0.2 ? "III" : lumRand < 0.4 ? "IV" : "V";
  else luminosityClass = lumRand < 0.1 ? "III" : lumRand < 0.2 ? "IV" : "V";
  
  return {
    spectralClass,
    luminosityClass,
    temperature,
    mass,
    color: colors[spectralClass as keyof typeof colors] || "#ffffff"
  };
}

export function generateRenderableStars(allStars: StarData[]) {
  const starLayers: StarData[] = [];
  const cameraCenter = { x: 0, y: 0, z: 0 };

  // 기존 베이스 별들 추가 (은하 구조에 맞게 위치 조정)
  starLayers.push(
    ...allStars.map((star, index) => ({
      ...star,
      id: `base-${star.id}`,
      position: star.position, // 기존 위치 유지
    }))
  );

  // 은하 분포에 따른 별 생성 함수 (generateRandomStars의 위치 생성 방식 사용)
  function generateGalacticStars(
    count: number, 
    layerName: string, 
    regionType: "core" | "outercore" | "spiral" | "disk"
  ): StarData[] {
    const stars: StarData[] = [];
    const positions: THREE.Vector3[] = [];
    
    // regionType에 따른 위치 생성
    if (regionType === "core") {
      // 코어 영역 위치 생성
      for (let i = 0; i < count; i++) {
        let pos = new THREE.Vector3(
          gaussianRandom(0, CORE_X_DIST),
          gaussianRandom(0, GALAXY_THICKNESS),
          gaussianRandom(0, CORE_Y_DIST),
        );
        positions.push(pos);
      }
    } else if (regionType === "outercore") {
      // 외곽 코어 영역 위치 생성
      for (let i = 0; i < count; i++) {
        let pos = new THREE.Vector3(
          gaussianRandom(0, OUTER_CORE_X_DIST),
          gaussianRandom(0, GALAXY_THICKNESS),
          gaussianRandom(0, OUTER_CORE_Y_DIST),
        );
        positions.push(pos);
      }
         } else if (regionType === "spiral") {
       // 나선팔 영역 위치 생성
       for (let arm = 0; arm < ARMS; arm++) {
         for (let i = 0; i < count / ARMS; i++) {
           let pos = spiral(
             gaussianRandom(ARM_X_MEAN, ARM_X_DIST),
             gaussianRandom(0, GALAXY_THICKNESS),
             gaussianRandom(ARM_Y_MEAN, ARM_Y_DIST),
             (arm * 2 * Math.PI) / ARMS
           );
           positions.push(pos);
         }
       }
    } else if (regionType === "disk") {
      // 디스크 영역 위치 생성 (원형 분포, 더 넓은 반지름)
      for (let i = 0; i < count; i++) {
        const theta = Math.random() * 2 * Math.PI;
        const r = 400 + Math.random() * 600; // 디스크 반지름 대폭 증가 (400-1000 units)
        let pos = new THREE.Vector3(
          r * Math.cos(theta) + gaussianRandom(0, 80),
          gaussianRandom(0, GALAXY_THICKNESS),
          r * Math.sin(theta) + gaussianRandom(0, 80),
        );
        positions.push(pos);
      }
    }
    
    // 생성된 위치에 별 데이터 할당
    for (let i = 0; i < positions.length; i++) {
      const pos = positions[i];
      const x = pos.x;
      const y = pos.y;
      const z = pos.z;
      
      // 해당 위치의 은하 밀도 확인
      const density = getGalacticDensity(x, y, z);
      
      // 밀도가 낮으면 별 생성 확률 대폭 감소 (더 희박한 분포)
      if (Math.random() < Math.min(density * 0.3 + 0.1, 0.8)) {
        const starType = getStarTypeByLocation(x, y, z);
        const subclass = Math.floor(Math.random() * 10);
        
        // 거리 계산 (x, z 평면 + y축)
        const distance = Math.sqrt(x * x + y * y + z * z);
        const distanceFactor = Math.max(0.1, 1.0 - distance / 500);
        
        const stellarResources = generateRandomStarResources(
          `${starType.spectralClass}${subclass}${starType.luminosityClass}`,
          starType.temperature,
          starType.mass,
          Math.random() * 1000 + distance
        );

        stars.push({
          id: `${layerName}-${stars.length}`,
          name: `${layerName.charAt(0).toUpperCase() + layerName.slice(1)} ${stars.length + 1}`,
          designation: `${layerName.toUpperCase()} ${stars.length + 1}`,
          constellation: "Generated",
          apparentMagnitude: 2 + Math.random() * 6 + (distance / 100),
          absoluteMagnitude: Math.random() * 10 - 2,
          distance: distance * 3.26, // 광년 단위
          spectralClass: `${starType.spectralClass}${subclass}${starType.luminosityClass}`,
          temperature: starType.temperature,
          mass: starType.mass,
          radius: Math.pow(starType.mass, 0.8) * (0.5 + Math.random() * 1.5),
          luminosity: Math.pow(starType.mass, 3.5) * (0.1 + Math.random() * 2),
          rightAscension: `${Math.floor(Math.random() * 24)}h ${Math.floor(Math.random() * 60)}m`,
          declination: `${Math.random() > 0.5 ? "+" : "-"}${Math.floor(Math.random() * 90)}°`,
          description: `Generated star in galactic ${layerName} region`,
          position: { x, y, z },
          color: starType.color,
          size: Math.max(0.1, distanceFactor * (0.2 + Math.random() * 0.3)), // 훨씬 작은 크기로 거리감 증대
          stellarResources,
        });
      }
    }
    
    return stars;
  }

  // 은하 중심 코어 영역 별들 (밀도 감소)
  const coreStars = generateGalacticStars(1000, "core", "core");
  starLayers.push(...coreStars);

  // 외곽 코어 영역 별들 (밀도 감소) 
  const outerCoreStars = generateGalacticStars(5000, "outercore", "outercore");
  starLayers.push(...outerCoreStars);

  // 나선팔 영역 별들 (밀도 대폭 감소)
  const spiralArmStars = generateGalacticStars(5000, "spiral", "spiral");
  starLayers.push(...spiralArmStars);

  // 은하 디스크 영역 별들 (밀도 감소)
  const diskStars = generateGalacticStars(3000, "disk", "disk");
  starLayers.push(...diskStars);

  // 은하 헤일로 영역 별들 (구형 분포, x,z축 평면 중심, 더 희박하고 더 멀리)
  const haloStars: StarData[] = [];
  for (let i = 0; i < 150; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const radius = 800 + Math.random() * 800; // 헤일로 반지름 대폭 증가 (800-1600 units)
    
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi); // y축이 은하 두께 방향
    const z = radius * Math.sin(phi) * Math.sin(theta);
    
    const starType = getStarTypeByLocation(x, y, z);
    const subclass = Math.floor(Math.random() * 10);
    
    const stellarResources = generateRandomStarResources(
      `${starType.spectralClass}${subclass}${starType.luminosityClass}`,
      starType.temperature,
      starType.mass,
      radius * 3.26
    );

    haloStars.push({
      id: `halo-${i}`,
      name: `Halo ${i + 1}`,
      designation: `HALO ${i + 1}`,
      constellation: "Halo",
      apparentMagnitude: 8 + Math.random() * 4,
      absoluteMagnitude: Math.random() * 10 - 2,
      distance: radius * 3.26,
      spectralClass: `${starType.spectralClass}${subclass}${starType.luminosityClass}`,
      temperature: starType.temperature,
      mass: starType.mass,
      radius: Math.pow(starType.mass, 0.8) * (0.3 + Math.random()),
      luminosity: Math.pow(starType.mass, 3.5) * (0.05 + Math.random()),
      rightAscension: `${Math.floor(Math.random() * 24)}h ${Math.floor(Math.random() * 60)}m`,
      declination: `${Math.random() > 0.5 ? "+" : "-"}${Math.floor(Math.random() * 90)}°`,
      description: "Ancient halo population star",
      position: { x, y, z },
      color: starType.color,
      size: Math.max(0.05, 0.1 + Math.random() * 0.15), // 헤일로 별들은 매우 작게
      stellarResources,
    });
  }
  starLayers.push(...haloStars);

  console.log(`Generated ${starLayers.length} total stars following galactic distribution`);
  console.log(`- Core stars: ${coreStars.length}`);
  console.log(`- Outer core stars: ${outerCoreStars.length}`);
  console.log(`- Spiral arm stars: ${spiralArmStars.length}`);
  console.log(`- Disk stars: ${diskStars.length}`);
  console.log(`- Halo stars: ${haloStars.length}`);
  
  return starLayers;
}

// 기존 별들에 자원이 없는 경우 자원 할당
export function updateStarsWithResources(): StarData[] {
  return starDatabase.map((star) => {
    if (!star.stellarResources) {
      const stellarResources = generateStellarResources(star);
      return {
        ...star,
        stellarResources,
      };
    }
    return star;
  });
}

// 자원이 업데이트된 별 데이터베이스
export const starDatabaseWithResources = updateStarsWithResources();

export const allStars = [...starDatabaseWithResources]; // 자원이 포함된 별들 사용
