import { ModulePage } from '../components/ModulePage';
import type { ScreenDefinition } from '../types/screen';

const screen: ScreenDefinition = {"code": "INV-ISS", "title": "Issue / Return", "area": "Master / Procurement / Stock", "batch": "B05-B07", "description": "Issue / Return workflow with server-authoritative scope, state, version, approval and audit."};

export default function INV_ISS() {
  return <ModulePage screen={screen} />;
}
