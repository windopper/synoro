import { Vector3 } from "three";
import { ARM_X_DIST, SPIRAL } from "../config/galaxyConfig";

export function gaussianRandom(mean = 0, stdev = 1) {
  let u = 1 - Math.random();
  let v = Math.random();
  let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

  return z * stdev + mean;
}

export function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

export function spiral(x: number, y: number, z: number, offset: number) {
  let r = Math.sqrt(x ** 2 + z ** 2); // x, z축 평면에서의 거리
  let theta = offset;
  theta += x > 0 ? Math.atan(z / x) : Math.atan(z / x) + Math.PI; // x, z축 평면에서의 각도
  theta += (r / ARM_X_DIST) * SPIRAL;
  return new Vector3(r * Math.cos(theta), y, r * Math.sin(theta)); // y는 은하 두께 방향으로 그대로 유지
}
