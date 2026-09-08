import { ModulePage } from '../components/ModulePage';
import type { ScreenDefinition } from '../types/screen';

const screen: ScreenDefinition = {"code": "CON-WORK", "title": "Third-Party Work", "area": "Sales / Dispatch", "batch": "B13-B17", "description": "Third-Party Work workflow with server-authoritative scope, state, version, approval and audit."};

export default function CON_WORK() {
  return <ModulePage screen={screen} />;
}
