import { ModulePage } from '../components/ModulePage';
import type { ScreenDefinition } from '../types/screen';

const screen: ScreenDefinition = {"code": "OPT-PLAN", "title": "Optimisation", "area": "Scale", "batch": "B22-B24", "description": "Forecasts and recommendations with versioned inputs, limitations and human review."};

export default function OPT_PLAN() {
  return <ModulePage screen={screen} />;
}
