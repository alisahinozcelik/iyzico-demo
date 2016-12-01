/// <reference path="../../../front-end.d.ts" />

import { Component, ElementRef } from '@angular/core';
import { defer } from 'lodash';
import { TweenLite, TweenMax, Cubic } from 'gsap';

@Component({
	selector: 'white-label',
	template: String(require('./white-label.pug')),
	styles: [String(require('./white-label.scss'))],
	inputs: ['title', 'subtitle', 'count']
})
export class WhiteLabelComponent {
	private title: string;
	private subtitle: string;
	private count: number;
	private tween: TweenLite;

	constructor(private el: ElementRef) {
	}

	private ngAfterViewInit():void {
		const obj = {val: 0};
		const countElement = ((this.el.nativeElement as HTMLElement).querySelector('.count') as HTMLElement);
		
		defer(() => {
			this.tween = TweenLite.to(obj, 1, {val: this.count, ease: Cubic.easeOut, onUpdate: () => {
				countElement.innerText = Math.ceil(obj.val).toString();
			}});
		});
	}

	private ngOnDestroy():void {
		this.tween && this.tween.kill();
	}
}