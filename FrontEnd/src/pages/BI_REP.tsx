import { ModulePage } from '../components/ModulePage';
import type { ScreenDefinition } from '../types/screen';

const screen: ScreenDefinition = {"code": "BI-REP", "title": "Reports", "area": "Foundation / Admin", "batch": "B04", "description": "Controlled read models with filters, cutoff, freshness and export metadata."};

export default function BI_REP() {
  return <ModulePage screen={screen} />;
}
