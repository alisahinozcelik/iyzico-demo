import { Component } from '@angular/core';
import { chain, defer } from 'lodash';
import { TweenLite } from 'gsap';

interface IPie {
	label: string;
	color: string;
	value: number;
	slice?: number;
	offset?: number;
	tween?: TweenLite;
}

const CIRCUMFERENCE = 2 * Math.PI * 25;

@Component({
	selector: 'pie-chart',
	template: String(require('./pie-chart.pug')),
	styles: [String(require('./pie-chart.scss'))]
})
export class PieChartComponent {
	private data: IPie[] = require('../../../.data/browser-usage.json');

	constructor() {
		let prevValue = 0;

		this.data = chain(this.data)
			.sortBy('value')
			.forEach((el, i, arr) => {
				prevValue += el.value;
				el.slice = CIRCUMFERENCE - (CIRCUMFERENCE / 100 * prevValue);
				el.offset = CIRCUMFERENCE;
			})
			.value();
	}

	private ngAfterViewInit():void {
		this.data.forEach(el => {
			let obj = {val: CIRCUMFERENCE};
			defer(() => {
				el.tween = TweenLite.to(obj, 1, {val: el.slice, onUpdate: () => {
					el.offset = obj.val;
				}});
			});
		});
	}

	private ngOnDestroy():void {
		this.data.forEach(val => {
			val.tween && val.tween.kill();
		});
	}
}