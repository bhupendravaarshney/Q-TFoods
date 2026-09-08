import { ModulePage } from '../components/ModulePage';
import type { ScreenDefinition } from '../types/screen';

const screen: ScreenDefinition = {"code": "INV-STK", "title": "Stock & Lots", "area": "Master / Procurement / Stock", "batch": "B05-B07", "description": "Stock & Lots workflow with server-authoritative scope, state, version, approval and audit."};

export default function INV_STK() {
  return <ModulePage screen={screen} />;
}
