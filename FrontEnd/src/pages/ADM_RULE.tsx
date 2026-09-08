import { ModulePage } from '../components/ModulePage';
import type { ScreenDefinition } from '../types/screen';

const screen: ScreenDefinition = {"code": "ADM-RULE", "title": "Approval Rules", "area": "Foundation / Admin", "batch": "B04", "description": "Approval Rules workflow with server-authoritative scope, state, version, approval and audit."};

export default function ADM_RULE() {
  return <ModulePage screen={screen} />;
}
