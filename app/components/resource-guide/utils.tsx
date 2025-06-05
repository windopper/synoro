import {
  RESOURCE_DATABASE,
  ResourceRarity,
  getResourceByName,
} from "../../data/resourceTypes";
import {
  ManufacturingCategory,
  ManufacturingDifficulty,
  getManufacturingResourceByName,
} from "../../data/manufacturingResources";

export const getDifficultyColor = (
  difficulty: ManufacturingDifficulty | string
) => {
  switch (difficulty) {
    case ManufacturingDifficulty.EASY:
    case "easy":
      return "text-emerald-400";
    case ManufacturingDifficulty.MEDIUM:
    case "medium":
      return "text-yellow-400";
    case ManufacturingDifficulty.HARD:
    case "hard":
      return "text-red-400";
    case ManufacturingDifficulty.EXTREME:
      return "text-purple-400";
    default:
      return "text-zinc-400";
  }
};

export const getDifficultyLabel = (
  difficulty: ManufacturingDifficulty | string
) => {
  switch (difficulty) {
    case ManufacturingDifficulty.EASY:
    case "easy":
      return "쉬움";
    case ManufacturingDifficulty.MEDIUM:
    case "medium":
      return "보통";
    case ManufacturingDifficulty.HARD:
    case "hard":
      return "어려움";
    case ManufacturingDifficulty.EXTREME:
      return "극도로 어려움";
    default:
      return "알 수 없음";
  }
};

export const getRarityColor = (rarity: ResourceRarity | string) => {
  switch (rarity) {
    case ResourceRarity.COMMON:
    case "일반":
      return "bg-zinc-600/30 text-zinc-300 border-zinc-500/30";
    case ResourceRarity.UNCOMMON:
    case "비일반":
      return "bg-emerald-600/30 text-emerald-300 border-emerald-500/30";
    case ResourceRarity.RARE:
    case "희귀":
      return "bg-blue-600/30 text-blue-300 border-blue-500/30";
    case ResourceRarity.VERY_RARE:
    case "매우 희귀":
      return "bg-purple-600/30 text-purple-300 border-purple-500/30";
    case ResourceRarity.LEGENDARY:
    case "전설급":
      return "bg-yellow-600/30 text-yellow-300 border-yellow-500/30";
    case ResourceRarity.UNIQUE:
    case "고유":
      return "bg-red-600/30 text-red-300 border-red-500/30";
    default:
      return "bg-zinc-600/30 text-zinc-300 border-zinc-500/30";
  }
};

export const getCategoryColor = (category: ManufacturingCategory | string) => {
  switch (category) {
    case ManufacturingCategory.BASIC:
    case "기본":
      return "bg-zinc-600/30 text-zinc-300 border-zinc-500/30";
    case ManufacturingCategory.PROCESSED:
    case "가공":
      return "bg-emerald-600/30 text-emerald-300 border-emerald-500/30";
    case ManufacturingCategory.ADVANCED:
    case "고급":
      return "bg-purple-600/30 text-purple-300 border-purple-500/30";
    case ManufacturingCategory.COMPONENTS:
    case "부품":
      return "bg-blue-600/30 text-blue-300 border-blue-500/30";
    case ManufacturingCategory.SPECIAL:
    case "특수":
      return "bg-red-600/30 text-red-300 border-red-500/30";
    default:
      return "bg-zinc-600/30 text-zinc-300 border-zinc-500/30";
  }
};

export const getCategoryLabel = (category: ManufacturingCategory) => {
  switch (category) {
    case ManufacturingCategory.BASIC:
      return "기본 재료";
    case ManufacturingCategory.PROCESSED:
      return "가공 재료";
    case ManufacturingCategory.ADVANCED:
      return "고급 재료";
    case ManufacturingCategory.COMPONENTS:
      return "부품류";
    case ManufacturingCategory.SPECIAL:
      return "특수 재료";
    default:
      return "알 수 없음";
  }
};

export const getRarityLabel = (rarity: ResourceRarity) => {
  switch (rarity) {
    case ResourceRarity.COMMON:
      return "일반";
    case ResourceRarity.UNCOMMON:
      return "비일반";
    case ResourceRarity.RARE:
      return "희귀";
    case ResourceRarity.VERY_RARE:
      return "매우 희귀";
    case ResourceRarity.LEGENDARY:
      return "전설급";
    case ResourceRarity.UNIQUE:
      return "고유";
    default:
      return "알 수 없음";
  }
};

// 자원 정보 가져오기 함수
export const getResourceInfo = (resourceName: string) => {
  // 먼저 제조 자원에서 찾기
  const manufacturingInfo = getManufacturingResourceByName(resourceName);
  if (manufacturingInfo) {
    return {
      ...manufacturingInfo,
      type: "manufacturing" as const,
      rarity: getCategoryLabel(manufacturingInfo.category),
    };
  }

  // 항성 자원에서 찾기
  const stellarInfo = getResourceByName(resourceName);
  if (stellarInfo) {
    return {
      ...stellarInfo,
      type: "stellar" as const,
      sources: ["항성 채굴"],
      difficulty:
        stellarInfo.rarity === ResourceRarity.COMMON
          ? "easy"
          : stellarInfo.rarity === ResourceRarity.UNCOMMON
          ? "easy"
          : stellarInfo.rarity === ResourceRarity.RARE
          ? "medium"
          : stellarInfo.rarity === ResourceRarity.VERY_RARE
          ? "hard"
          : "hard",
      rarity: getRarityLabel(stellarInfo.rarity),
    };
  }

  return null;
};
