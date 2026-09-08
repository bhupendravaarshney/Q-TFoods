import { ModulePage } from '../components/ModulePage';
import type { ScreenDefinition } from '../types/screen';

const screen: ScreenDefinition = {"code": "PORTAL-EXT", "title": "Partner Portal", "area": "Scale", "batch": "B22-B24", "description": "Partner-isolated workspace with explicit entitlements and no implicit internal approval."};

export default function PORTAL_EXT() {
  return <ModulePage screen={screen} />;
}
