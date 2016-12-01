/// <reference path="../../front-end.d.ts" />

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface INotification {
	id: string;
	count: number;
}

@Injectable()
export class NotificationService {

	public notifications$$ = new BehaviorSubject<INotification[]>([]);

	constructor() {
		const data: INotification[] = require('../.data/notifications.json');

		this.notifications$$.next(data);
	}
}