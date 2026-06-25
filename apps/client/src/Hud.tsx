import { TIERS } from '@gape/shared';
import { useSyncExternalStore } from 'react';
import { getHud, subscribeHud } from './game/store';

export function Hud() {
  const hud = useSyncExternalStore(subscribeHud, getHud);
  const tierName = TIERS[hud.tier]?.name ?? '';
  return (
    <div className="hud">
      <div className="hud__score">
        {hud.score} pts · {tierName}
      </div>
      <div className="hud__hint">WASD / arrow keys or tap to move · swallow what fits</div>
    </div>
  );
}
