import { Color, type IUniform, Vector2 } from 'three';

// A flat ground plane with the hole drawn as a shader cutout: a dark radial
// interior, a bright rim ring, and a faint world-space grid. This is purely
// visual — the real swallow math lives in @gape/shared. No CSG / boolean geo.

export const holeVertexShader = /* glsl */ `
  varying vec2 vWorldXZ;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldXZ = wp.xz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

export const holeFragmentShader = /* glsl */ `
  uniform vec2 uHoleCenter;
  uniform float uHoleRadius;
  uniform vec3 uGroundColor;
  uniform vec3 uRimColor;
  uniform vec3 uHoleColor;
  varying vec2 vWorldXZ;

  float gridFactor(vec2 p) {
    vec2 grid = abs(fract(p * 0.25 - 0.5) - 0.5) / fwidth(p * 0.25);
    return 1.0 - min(min(grid.x, grid.y), 1.0);
  }

  void main() {
    float d = distance(vWorldXZ, uHoleCenter);
    float r = max(uHoleRadius, 0.0001);
    vec3 ground = mix(uGroundColor, uGroundColor + 0.06, gridFactor(vWorldXZ));
    vec3 hole = mix(vec3(0.0), uHoleColor, smoothstep(0.0, r, d));
    float rim = smoothstep(0.35, 0.0, abs(d - r));
    vec3 col = mix(d < r ? hole : ground, uRimColor, rim * 0.9);
    gl_FragColor = vec4(col, 1.0);
  }
`;

export interface HoleUniforms {
  // Index signature lets this satisfy three's `uniforms` prop type.
  [name: string]: IUniform;
  uHoleCenter: IUniform<Vector2>;
  uHoleRadius: IUniform<number>;
  uGroundColor: IUniform<Color>;
  uRimColor: IUniform<Color>;
  uHoleColor: IUniform<Color>;
}

export function makeHoleUniforms(): HoleUniforms {
  return {
    uHoleCenter: { value: new Vector2(0, 0) },
    uHoleRadius: { value: 1.5 },
    uGroundColor: { value: new Color('#3a7d44') },
    uRimColor: { value: new Color('#e7d9a8') },
    uHoleColor: { value: new Color('#11161f') },
  };
}
