import { ModulePage } from '../components/ModulePage';
import type { ScreenDefinition } from '../types/screen';

const screen: ScreenDefinition = {"code": "BI-PROFIT", "title": "Profitability", "area": "Sales / Dispatch", "batch": "B13-B17", "description": "Profitability workflow with server-authoritative scope, state, version, approval and audit."};

export default function BI_PROFIT() {
  return <ModulePage screen={screen} />;
}
