import { ModulePage } from '../components/ModulePage';
import type { ScreenDefinition } from '../types/screen';

const screen: ScreenDefinition = {"code": "MD-PARTY", "title": "Parties", "area": "Master / Procurement / Stock", "batch": "B05-B07", "description": "Parties workflow with server-authoritative scope, state, version, approval and audit."};

export default function MD_PARTY() {
  return <ModulePage screen={screen} />;
}
