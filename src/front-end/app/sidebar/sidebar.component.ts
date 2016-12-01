import { Component, trigger, state, style, transition, animate } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { findIndex } from 'lodash';

import { WindowService, NotificationService } from '../.services';


type TStatesOverlay = 'opened' | 'closed';

interface IStates {
	thickness: 'thick' | 'thin',
	visibility: 'solid' | 'over' | 'hidden',
	overlay: TStatesOverlay
}

interface IMenuItem {
	name: string;
	id: string;
	notification: number;
	colorClass: string;
	icon: string;
	path: string;
}

const SMALL_SIDEBAR_CONTENT_WIDTH = 24;
const SMALL_SIDEBAR_WIDTH = 56; // 16 + 16 + 24
const ANIMATION_TIME = 500;
const ANIMATION_STYLE = ANIMATION_TIME + 'ms ease';

@Component({
	selector: 'aside',
	exportAs: 'sidebar',
	template: String(require('./sidebar.pug')),
	styles: [String(require('./sidebar.scss'))],
	animations: [
		trigger('thickness', [
			state('thick', style({width: 410})),
			state('thin', style({width: SMALL_SIDEBAR_WIDTH})),
			transition('thin <=> thick', animate(ANIMATION_STYLE))
		]),
		trigger('visibility', [
			state('solid', style({position: 'relative', transform: 'translateX(0)'})),
			state('over', style({transform: 'translateX(0)'})),
			state('hidden', style({transform: 'translateX(-100%)'})),
			transition('over <=> hidden', animate(ANIMATION_STYLE))
		]),
		trigger('overlay', [
			state('opened', style({transform: 'translateX(0)'})),
			state('closed', style({transform: 'translateX(-100%)'})),
			transition('opened <=> closed', animate(ANIMATION_STYLE))
		]),
		trigger('avatar', [
			state('big', style({width: '*', height: '*'})),
			state('small', style({width: SMALL_SIDEBAR_CONTENT_WIDTH, height: SMALL_SIDEBAR_CONTENT_WIDTH})),
			transition('big <=> small', animate(ANIMATION_STYLE))
		]),
		trigger('opacity', [
			state('opaque', style({opacity: 1})),
			state('transparent', style({opacity: 0})),
			transition('opaque <=> transparent', animate(ANIMATION_STYLE))
		])
	]
})
export class SidebarComponent {

	public states: IStates = {
		thickness: 'thick',
		visibility: 'solid',
		get overlay():TStatesOverlay {
			if (this.thickness === 'thick' && this.visibility === 'over') {
				return 'opened';
			}
			return 'closed';
		}
	};
	public contentMargin: number = 0;
	private menuList: {title: string, list: IMenuItem[]}[] = [
		{
			title: 'UI Kits',
			list: [
				{id: 'dashboard', name: 'Dashboard', colorClass: 'dark-indigo', icon: 'fa-home', notification: 0, path: 'dashboard'},
				{id: 'apps', name: 'Apps', colorClass: 'orange', icon: 'fa-bolt', notification: 0, path: 'apps'},
				{id: 'components', name: 'Components', colorClass: 'green', icon: 'fa-lock', notification: 0, path: 'components'},
				{id: 'mail', name: 'Email', colorClass: 'dark-indigo', icon: 'fa-envelope', notification: 0, path: 'email'}
			]
		},
		{
			title: '',
			list: [
				{id: 'settings', name: 'Settings', colorClass: 'amber', icon: 'fa-cog', notification: 0, path: 'settings'},
				{id: 'document', name: 'Document', colorClass: 'dark-indigo', icon: 'fa-paste', notification: 0, path: 'document'}
			]
		}
	];

	constructor(
		private window: WindowService,
		notification: NotificationService,
		router: Router
		) {

		router.events.filter(res => res instanceof NavigationEnd).subscribe(res => {
			this.closeMenu();
		});

		this.window.breakpoint$$.subscribe(res => {
			switch (res) {
				case 'xsmall':
					this.states.thickness = 'thick';
					this.states.visibility = 'hidden';
					this.contentMargin = 0;
				break;
				case 'small':
					this.states.thickness = 'thin';
					this.states.visibility = 'over';
					this.contentMargin = SMALL_SIDEBAR_WIDTH;
				break;
				case 'medium':
					this.states.visibility = 'solid';
					this.states.thickness = 'thin';
					this.contentMargin = 0;
				break;
				case 'large':
					this.states.visibility = 'solid';
					this.states.thickness = 'thick';
					this.contentMargin = 0;
			}

			notification.notifications$$.subscribe(res => {
				res.forEach(val => {
					this.menuList.forEach(menuGroup => {
						const index = findIndex(menuGroup.list, ['id', val.id]);
						if (index > -1) {
							menuGroup.list[index].notification = val.count;
						}
					});
				});
			});
		});
	}

	private closeMenu():void {
		switch (this.window.breakpoint) {
			case 'xsmall':
				this.states.visibility = 'hidden';
			break;
			case 'small':
			case 'medium':
				this.states.thickness = 'thin';
		}
	}

	private toggleMenu():void {
		switch (this.window.breakpoint) {
			case 'xsmall':
				this.states.visibility = 'hidden';
			break;
			case 'small':
			case 'medium':
				this.states.thickness = this.states.thickness === 'thin' ? 'thick' : 'thin'; 
		}
	}

	public get isOpened():boolean {
		return this.states.thickness === 'thick' && (this.states.visibility === 'solid' || this.states.visibility === 'over');
	}
}