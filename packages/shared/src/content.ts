import type { ContentManifest } from './manifest.js';

// Canonical prop set, owned by shared so the authoritative server and the client
// build the identical world from one seed. Primitive shapes/colors are render
// hints (client-only); the server reads footprint/height/topple/points.
export const MANIFEST: ContentManifest = {
  props: [
    { id: 'pebble', shape: 'box', class: 'small', footprintRadius: 0.35, height: 0.4, topple: false, points: 1, color: '#9aa0a6', spawnCount: 40, maxInstances: 40 },
    { id: 'cone', shape: 'cone', class: 'small', footprintRadius: 0.4, height: 1.0, topple: true, points: 2, color: '#f4a259', spawnCount: 24, maxInstances: 24 },
    { id: 'bin', shape: 'cylinder', class: 'medium', footprintRadius: 0.55, height: 1.1, topple: true, points: 4, color: '#4c6e5d', spawnCount: 16, maxInstances: 16 },
    { id: 'lamp', shape: 'cylinder', class: 'medium', footprintRadius: 0.25, height: 3.2, topple: true, points: 6, color: '#cdd3df', spawnCount: 12, maxInstances: 12 },
    { id: 'crate', shape: 'box', class: 'large', footprintRadius: 1.0, height: 1.8, topple: false, points: 12, color: '#b5651d', spawnCount: 8, maxInstances: 8 },
    { id: 'kiosk', shape: 'box', class: 'huge', footprintRadius: 1.8, height: 3.0, topple: false, points: 25, color: '#6d6875', spawnCount: 4, maxInstances: 4 },
  ],
};
