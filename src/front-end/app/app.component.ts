import { Component, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

import { SidebarComponent } from './sidebar';

import { WindowService } from './.services';

@Component({
	selector: 'app',
	template: String(require('./app.pug')),
	styles: [
		String(require('normalize.css')),
		String(require('font-awesome/scss/font-awesome.scss')),
		String(require('./.common/material.scss')),
		String(require('./.common/shared.scss')),
		String(require('./app.scss'))
	],
	encapsulation: ViewEncapsulation.None,
	animations: [
	]
})
export class AppComponent {
	private subs: {[key: string]: Subscription} = {};
	public pageTitle: string;

	constructor(
		private window:WindowService,
		router: Router,
		activated: ActivatedRoute
		) {

		router.events
			.filter(res => res instanceof NavigationEnd)
			.subscribe(res => {
				this.subs['router'] && this.subs['router'].unsubscribe();
				this.subs['router'] = activated.children[0].data.subscribe(res => {
					this.pageTitle = res['title'];
				});
			});
	}

	private ngAfterViewInit():void {
		setTimeout(() => {
			document.body.style.opacity = "1";
		}, 200);
	}

	private toggleSidebar(sidebar: SidebarComponent):void {
		switch (sidebar.states.visibility) {
			case 'over':
				sidebar.states.visibility = 'hidden';
			break;
			case 'hidden':
				sidebar.states.visibility = 'over';
			default:
		}
	}
}