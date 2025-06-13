import { text } from "stream/consumers";
import * as THREE from "three";

/**
 * Three.js에서 메시가 화면상에 보이는 크기가 최소로 고정되도록 동적으로 스케일을 조정합니다.
 * 카메라가 멀어질수록 메시가 너무 작아지는 것을 방지하고, 특정 픽셀 크기 이하로 줄어들지 않게 합니다.
 *
 * @param {THREE.Mesh} mesh - 크기를 조정할 메시 객체. 메시의 geometry에는 boundingSphere가 계산되어 있어야 합니다.
 * @param {THREE.PerspectiveCamera} camera - 장면을 렌더링하는 퍼스펙티브 카메라.
 * @param {THREE.WebGLRenderer} renderer - WebGL 렌더러. 화면 높이 정보를 가져오는 데 사용됩니다.
 * @param {number} minScreenRadiusPixels - 메시가 화면에서 가져야 할 최소 반경 (픽셀 단위). 예를 들어, 50px.
 */
export function updateMeshScaleForMinScreenSize(
  mesh: THREE.Mesh,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
  minScreenRadiusPixels: number
) {
  // 1. 메시의 초기 스케일과 기본 반경을 저장합니다. (이 부분은 메시 생성 또는 초기화 시 최초 한 번만 실행되도록 userData에 저장)
  if (!mesh.userData.initialScale) {
    mesh.userData.initialScale = mesh.scale.clone();
  }

  // 메시의 geometry에 boundingSphere가 있는지 확인하고 없으면 계산합니다.
  // boundingSphere는 메시의 스케일이 (1,1,1)일 때의 대략적인 반경을 제공합니다.
  if (!mesh.geometry || !mesh.geometry.boundingSphere) {
    if (mesh.geometry) {
      mesh.geometry.computeBoundingSphere();
    } else {
      console.warn(
        "경고: 메시의 geometry가 없거나 boundingSphere를 계산할 수 없습니다. 최소 화면 크기 기능을 사용할 수 없습니다.",
        mesh
      );
      return;
    }
  }
  const originalBaseRadius = mesh.geometry.boundingSphere?.radius || 0;

  // 2. 카메라에서 메시의 중심(월드 좌표계 상의 위치)까지의 거리를 계산합니다.
  const objectCenterWorld = new THREE.Vector3();
  mesh.getWorldPosition(objectCenterWorld); // 메시의 월드 좌표계 상의 실제 위치를 가져옵니다.
  const distance = camera.position.distanceTo(objectCenterWorld);

  // 카메라의 시야각(FOV)을 라디안으로 변환합니다.
  const fovRad = THREE.MathUtils.degToRad(camera.fov);
  // 렌더러의 캔버스(DOM 요소)의 높이를 픽셀 단위로 가져옵니다.
  const screenHeightPixels = renderer.domElement.clientHeight;

  // 3. 메시가 현재 '초기 스케일' 상태일 때 화면에 보이는 반경(픽셀)을 계산합니다.
  // (메시의 initialScale이 균일하다고 가정하고 x축 스케일을 대표값으로 사용합니다.)
  const currentNaturalWorldRadius =
    originalBaseRadius * mesh.userData.initialScale.x;
  // 물체의 각도 크기(라디안) = 2 * arctan(월드_반경 / (2 * 거리))
  const currentNaturalAngularSizeRad =
    2 * Math.atan(currentNaturalWorldRadius / (2 * distance));
  // 화면상의 픽셀 반경 = (물체_각도_크기 / 카메라_FOV_라디안) * 화면_높이_픽셀
  const currentNaturalScreenRadiusPixels =
    (currentNaturalAngularSizeRad / fovRad) * screenHeightPixels;

  // 4. 계산된 화면 반경이 설정한 최소 요구치(minScreenRadiusPixels)보다 작은지 확인하고 스케일을 조정합니다.
  if (currentNaturalScreenRadiusPixels < minScreenRadiusPixels) {
    // 메시가 너무 작아지고 있으므로, 최소 픽셀 크기를 유지하기 위한 필요한 '월드 반경'을 계산합니다.
    // 필요한 각도 크기(라디안) = (최소_픽셀_반경 / 화면_높이_픽셀) * 카메라_FOV_라디안
    const requiredAngularSizeRad =
      (minScreenRadiusPixels / screenHeightPixels) * fovRad;
    // 필요한 월드 반경 = 거리 * tan(필요한_각도_크기 / 2)
    const requiredWorldRadius = distance * Math.tan(requiredAngularSizeRad / 2);

    // 메시의 'originalBaseRadius'에 대해 'requiredWorldRadius'를 달성하기 위한 스케일 팩터를 계산합니다.
    const dynamicScaleFactor = requiredWorldRadius / originalBaseRadius;

    // 계산된 스케일 팩터를 메시 스케일에 적용합니다.
    // 이 경우, 메시의 스케일을 직접 dynamicScaleFactor로 설정하여,
    // 카메라가 멀어질 때 항상 minScreenRadiusPixels 이상으로 보이도록 강제합니다.
    mesh.scale.set(dynamicScaleFactor, dynamicScaleFactor, dynamicScaleFactor);
  } else {
    // 메시가 자연스럽게 충분히 크거나 최소 요구치보다 크다면, 초기 스케일로 되돌립니다.
    // 이 부분은 메시가 카메라에 가까이 있을 때 원래 크기로 보이도록 합니다.
    mesh.scale.copy(mesh.userData.initialScale);
  }
}

/**
 * 반짝임 효과를 위한 THREE.Sprite를 생성합니다.
 * @returns {THREE.Sprite} 반짝임 스프라이트 객체.
 */
function createSparkleSprite() {
  // 2~5 사이의 랜덤 숫자
  const randomIndex = Math.floor(Math.random() * 5) + 4;

  const map = new THREE.TextureLoader().load(
    `/textures/starSprite${randomIndex}.png`
  );

  const material = new THREE.SpriteMaterial({
    map: map, // 공유 텍스처 사용
    color: 0xffffff, // 반짝임 색상 (예: 0xFFFFDD로 약간 노란빛을 줄 수 있음)
    transparent: true,
    blending: THREE.AdditiveBlending, // 광원 효과 (더 밝게 보임)
    depthWrite: false, // 투명한 오브젝트의 z-fighting 방지
    depthTest: true, // 다른 오브젝트 뒤로 가려지는 것은 유지
  });
  const sprite = new THREE.Sprite(material);

  // 초기에는 보이지 않도록 설정
  sprite.visible = false;

  // 각 스프라이트의 반짝임 위상(phase)을 무작위로 설정하여 자연스러운 효과
  sprite.userData.twinklePhaseOffset = Math.random() * Math.PI * 2;
  sprite.userData.twinkleSpeed = 3 + Math.random() * 2; // 반짝임 속도도 약간 무작위로

  return sprite;
}

/**
 * 별의 거리에 따라 반짝임 효과를 업데이트합니다.
 * 별이 카메라로부터 일정 거리 이상 멀어지면 다이아몬드 모양의 반짝임이 활성화됩니다.
 *
 * @param {THREE.Object3D} groupMesh - 반짝임 효과를 적용할 별의 그룹 객체.
 * @param {THREE.Mesh} starMesh - 별의 Mesh 객체.
 * @param {THREE.PerspectiveCamera} camera - 장면을 렌더링하는 퍼스펙티브 카메라.
 * @param {number} distanceThreshold - 반짝임 효과가 활성화될 최소 카메라-별 거리 (월드 단위).
 */
export function updateStarSparkle(
  groupMesh: THREE.Object3D,
  starMesh: THREE.Mesh,
  camera: THREE.PerspectiveCamera,
  distanceThreshold: number,
) {
  // 1. 별에 반짝임 스프라이트가 부착되어 있는지 확인하고, 없으면 생성하여 부착합니다.
  if (!groupMesh.userData.sparkleSprite) {
    const sparkleSprite = createSparkleSprite();
    groupMesh.add(sparkleSprite);
    groupMesh.userData.sparkleSprite = sparkleSprite;
  }

  const sparkleSprite = groupMesh.userData.sparkleSprite as THREE.Sprite;

  // 2. 별의 월드 좌표와 카메라 사이의 거리를 계산합니다.
  const starWorldPos = new THREE.Vector3();
  groupMesh.getWorldPosition(starWorldPos);
  const distance = camera.position.distanceTo(starWorldPos);

  // 3. 전환 구간을 설정합니다 (임계값 전후로 부드러운 전환)
  const transitionRange = distanceThreshold * 0.2; // 임계값의 20%를 전환 구간으로 설정
  const fadeStartDistance = distanceThreshold - transitionRange;
  const fadeEndDistance = distanceThreshold + transitionRange;

  // 4. 거리에 따른 전환 비율을 계산합니다 (0: 별만 보임, 1: 스프라이트만 보임)
  let transitionRatio = 0;
  if (distance <= fadeStartDistance) {
    transitionRatio = 0; // 별만 보임
  } else if (distance >= fadeEndDistance) {
    transitionRatio = 1; // 스프라이트만 보임
  } else {
    // 전환 구간에서는 선형 보간
    transitionRatio = (distance - fadeStartDistance) / (fadeEndDistance - fadeStartDistance);
  }

  // 5. 스프라이트와 별의 투명도를 설정합니다
  sparkleSprite.visible = true;
  starMesh.visible = true;

  // 별의 투명도 (거리가 멀어질수록 투명해짐)
  const starOpacity = 1 - transitionRatio;
  if (starMesh.material && 'opacity' in starMesh.material) {
    (starMesh.material as any).opacity = starOpacity;
    (starMesh.material as any).transparent = true;
  }

  // 6. 스프라이트의 반짝임 효과와 투명도를 설정합니다
  const currentTime = performance.now() * 0.001;
  const twinklePhase =
    currentTime * sparkleSprite.userData.twinkleSpeed +
    sparkleSprite.userData.twinklePhaseOffset;
  const twinkleIntensity = Math.sin(twinklePhase) * 0.5 + 0.5; // 0.0에서 1.0 사이

  // 스프라이트의 기본 투명도 (거리가 멀어질수록 불투명해짐)
  const baseSparkleOpacity = transitionRatio;
  // 반짝임 효과를 적용한 최종 투명도 (완전히 사라지지 않도록 최소값 설정)
  const finalSparkleOpacity = baseSparkleOpacity * (twinkleIntensity * 0.7 + 0.3);
  
  sparkleSprite.material.opacity = finalSparkleOpacity;
  sparkleSprite.material.transparent = true;

  // 7. 완전히 가까운 거리에서는 스프라이트를 숨기고, 완전히 먼 거리에서는 별을 숨깁니다
  if (transitionRatio === 0) {
    // remove sparkleSprite
    groupMesh.remove(sparkleSprite);
    groupMesh.userData.sparkleSprite = null;
  }
  if (transitionRatio === 1) {
    starMesh.visible = false;
  }
}
