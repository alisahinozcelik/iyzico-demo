import { Component } from '@angular/core';
import { TweenLite } from 'gsap';
import { last, defer } from 'lodash';

import { IChartRaw, IChartRawData } from '../../bar-chart';

@Component({
	selector: 'colored-label',
	template: String(require('./colored-label.pug')),
	styles: [String(require('./colored-label.scss'))],
	inputs: ['color', 'title', 'icon', 'rawData: data']
})
export class ColoredLabelComponent {
	private color: string;
	private title: string;
	private icon: string;
	private rawData: IChartRawData[];
	private chartData: IChartRaw = {label: '', colorClass: 'white', data: []};
	private count: string = '0K';
	private tween: TweenLite;

	constructor() {

	}

	private ngAfterContentInit():void {
		const data = this.rawData.map(res => {
			return {value: Math.round(res.value / 1000)}
		});
		this.chartData.data = data;

		const tweenObj = {val: 0};
		defer(() => {
			this.tween = TweenLite.to(tweenObj, 1, {val: last(data).value, onUpdate: () => {
				this.count = Math.round(tweenObj.val).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + 'K';
			}});
		});
	}

	private ngOnDestroy():void {
		this.tween && this.tween.kill();
	}
}