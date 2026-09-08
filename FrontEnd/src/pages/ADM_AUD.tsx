import { ModulePage } from '../components/ModulePage';
import type { ScreenDefinition } from '../types/screen';

const screen: ScreenDefinition = {"code": "ADM-AUD", "title": "Audit & Evidence", "area": "Foundation / Admin", "batch": "B04", "description": "Search audit events by request, actor, scope, entity, outcome and evidence."};

export default function ADM_AUD() {
  return <ModulePage screen={screen} />;
}
