import { ModulePage } from '../components/ModulePage';
import type { ScreenDefinition } from '../types/screen';

const screen: ScreenDefinition = {"code": "INV-TRF", "title": "Stock Transfers", "area": "Master / Procurement / Stock", "batch": "B05-B07", "description": "Stock Transfers workflow with server-authoritative scope, state, version, approval and audit."};

export default function INV_TRF() {
  return <ModulePage screen={screen} />;
}
