import { ModulePage } from '../components/ModulePage';
import type { ScreenDefinition } from '../types/screen';

const screen: ScreenDefinition = {"code": "ADM-HELP", "title": "Help & Support", "area": "Foundation / Admin", "batch": "B04", "description": "Help & Support workflow with server-authoritative scope, state, version, approval and audit."};

export default function ADM_HELP() {
  return <ModulePage screen={screen} />;
}
