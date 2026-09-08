import { ModulePage } from '../components/ModulePage';
import type { ScreenDefinition } from '../types/screen';

const screen: ScreenDefinition = {"code": "DSP-LOAD", "title": "Load & Dispatch", "area": "Sales / Dispatch", "batch": "B13-B17", "description": "Load & Dispatch workflow with server-authoritative scope, state, version, approval and audit."};

export default function DSP_LOAD() {
  return <ModulePage screen={screen} />;
}
