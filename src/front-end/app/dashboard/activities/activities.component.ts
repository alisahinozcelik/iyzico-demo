import { Component } from '@angular/core';

@Component({
	selector: 'activities',
	template: String(require('./activities.pug')),
	styles: [String(require('./activities.scss'))]
})
export class ActivitiesComponent {
	private list = require('../../.data/activities.json');

	constructor() {}
}