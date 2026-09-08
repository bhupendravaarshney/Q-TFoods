import { ModulePage } from '../components/ModulePage';
import type { ScreenDefinition } from '../types/screen';

const screen: ScreenDefinition = {"code": "INV-EXP", "title": "Expiry / Disposal", "area": "Master / Procurement / Stock", "batch": "B05-B07", "description": "Expiry / Disposal workflow with server-authoritative scope, state, version, approval and audit."};

export default function INV_EXP() {
  return <ModulePage screen={screen} />;
}
