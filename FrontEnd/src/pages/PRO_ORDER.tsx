import { ModulePage } from '../components/ModulePage';
import type { ScreenDefinition } from '../types/screen';

const screen: ScreenDefinition = {"code": "PRO-ORDER", "title": "Production Orders", "area": "Manufacturing / Quality", "batch": "B08-B12", "description": "Production Orders workflow with server-authoritative scope, state, version, approval and audit."};

export default function PRO_ORDER() {
  return <ModulePage screen={screen} />;
}
