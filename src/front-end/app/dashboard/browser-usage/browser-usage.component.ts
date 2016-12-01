import { Component } from '@angular/core';

@Component({
	selector: 'browser-usage',
	template: String(require('./browser-usage.pug')),
	styles: [String(require('./browser-usage.scss'))]
})
export class BrowserUsageComponent {
	constructor() {
		
	}
}