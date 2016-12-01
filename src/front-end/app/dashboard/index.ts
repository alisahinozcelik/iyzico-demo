export * from './dashboard.component';
export * from './white-label';
export * from './colored-label';
export * from './activities';
export * from './browser-usage';

import { DashboardComponent } from './dashboard.component';
import { WhiteLabelComponent } from './white-label';
import { ColoredLabelComponent } from './colored-label';
import { ActivitiesComponent } from './activities';
import { BROWSER_USAGE_COMPONENTS } from './browser-usage';

export const DASHBOARD_COMPONENTS = [
	DashboardComponent,
	WhiteLabelComponent,
	ColoredLabelComponent,
	ActivitiesComponent,
	...BROWSER_USAGE_COMPONENTS
];