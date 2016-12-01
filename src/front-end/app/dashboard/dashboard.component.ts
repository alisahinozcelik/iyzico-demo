import { Component } from '@angular/core';

@Component({
	selector: 'dashboard',
	template: String(require('./dashboard.pug'))
})
export class DashboardComponent {
	private whiteLabels = require('../.data/white-labels.json');
	private coloredLabels = require('../.data/colored-labels.json');
	private analyticsData = require('../.data/bar-chart.json');

	constructor() {
	}
}