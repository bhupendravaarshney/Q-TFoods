import { ModulePage } from '../components/ModulePage';
import type { ScreenDefinition } from '../types/screen';

const screen: ScreenDefinition = {"code": "CRM-ORDER", "title": "Sales Orders", "area": "Sales / Dispatch", "batch": "B13-B17", "description": "Sales Orders workflow with server-authoritative scope, state, version, approval and audit."};

export default function CRM_ORDER() {
  return <ModulePage screen={screen} />;
}
