import { ModulePage } from '../components/ModulePage';
import type { ScreenDefinition } from '../types/screen';

const screen: ScreenDefinition = {"code": "DSP-PICK", "title": "Allocation & Picking", "area": "Sales / Dispatch", "batch": "B13-B17", "description": "Allocation & Picking workflow with server-authoritative scope, state, version, approval and audit."};

export default function DSP_PICK() {
  return <ModulePage screen={screen} />;
}
