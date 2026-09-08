import { ModulePage } from '../components/ModulePage';
import type { ScreenDefinition } from '../types/screen';

const screen: ScreenDefinition = {"code": "ADM-ORG", "title": "Organisation Setup", "area": "Foundation / Admin", "batch": "B04", "description": "Organisation Setup workflow with server-authoritative scope, state, version, approval and audit."};

export default function ADM_ORG() {
  return <ModulePage screen={screen} />;
}
