import { ModulePage } from '../components/ModulePage';
import type { ScreenDefinition } from '../types/screen';

const screen: ScreenDefinition = {"code": "HR-PAY", "title": "People & Payroll", "area": "Finance / Support", "batch": "B18-B21", "description": "People & Payroll workflow with server-authoritative scope, state, version, approval and audit."};

export default function HR_PAY() {
  return <ModulePage screen={screen} />;
}
