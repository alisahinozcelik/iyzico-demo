export * from './window.service';
export * from './notification.service';
export * from './flex.service';

import { WindowService } from './window.service';
import { NotificationService } from './notification.service';
import { FlexService } from './flex.service';

export const SERVICES = [
	WindowService,
	NotificationService,
	FlexService
];