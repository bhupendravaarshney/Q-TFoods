import { ModulePage } from '../components/ModulePage';
import type { ScreenDefinition } from '../types/screen';

const screen: ScreenDefinition = {"code": "ADM-USER", "title": "Users & Invitations", "area": "Foundation / Admin", "batch": "B04", "description": "Users & Invitations workflow with server-authoritative scope, state, version, approval and audit."};

export default function ADM_USER() {
  return <ModulePage screen={screen} />;
}
