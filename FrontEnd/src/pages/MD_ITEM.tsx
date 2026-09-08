import { ModulePage } from '../components/ModulePage';
import type { ScreenDefinition } from '../types/screen';

const screen: ScreenDefinition = {"code": "MD-ITEM", "title": "Items & UOM", "area": "Master / Procurement / Stock", "batch": "B05-B07", "description": "Items & UOM workflow with server-authoritative scope, state, version, approval and audit."};

export default function MD_ITEM() {
  return <ModulePage screen={screen} />;
}
