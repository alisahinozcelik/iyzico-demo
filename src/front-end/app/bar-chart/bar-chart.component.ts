import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TweenLite, Cubic } from 'gsap';
import { filter, each, defer } from 'lodash';

import { WindowService } from '../.services';

interface IPosition {
	x1: number;
	x2: number;
	y1: number;
	y2: number;
}

const DEF_POSITIONS: {[key: string]: IPosition} = {
	labels: {x1: 10, y1: 0,  x2: 100, y2: 20},
	axisX:  {x1: 10, y1: 90, x2: 100, y2: 100},
	axisY:  {x1: 0,  y1: 20, x2: 10,  y2: 90},
	chart:  {x1: 10, y1: 20, x2: 100, y2: 90} 
};

export interface IChartRawData {
	label?: string;
	value: number;
}

export interface IChartRaw {
	label: string;
	colorClass: string;
	data: IChartRawData[];
}

class Position {
	constructor(
		private chart: BarChartComponent,
		private type: string
		) {
	}

	get x1():number {
		if ((this.type === 'chart' || this.type === 'axisX') && this.chart.showLabels === false) {
			return 0;
		}
		else {
			return this.chart.width / 100 * DEF_POSITIONS[this.type].x1;
		}
	}

	get x2():number {
		if ((this.type === 'chart' || this.type === 'axisX') && this.chart.showLabels === false) {
			return this.chart.width;
		}
		else {
			return this.chart.width / 100 * DEF_POSITIONS[this.type].x2;
		}
	}
	get y1():number {
		if (this.type === 'chart' && this.chart.showLabels === false) {
			return 0;
		}
		else {
			return this.chart.height / 100 * DEF_POSITIONS[this.type].y1;
		}
	}
	get y2():number {
		if (this.type === 'chart' && this.chart.showLabels === false) {
			return this.chart.height;
		}
		else {
			return this.chart.height / 100 * DEF_POSITIONS[this.type].y2;
		}
	}
}

class Bar {
	public y:number;
	public height: number;
	private lastValue: number = 0;
	public tween: TweenLite;

	constructor(
		private chart: BarChartComponent,
		private axisX: AxisX,
		public value: number
		) {
		this.y = this.chart.positions['chart'].y2;
		this.height = 0;
	}

	private get containerHeight():number {
		return this.chart.positions['chart'].y2 - this.chart.positions['chart'].y1; 
	}

	get x():number {
		return this.axisX.x1;
	}

	get width():number {
		return this.axisX.width;
	}

	get valueSetter():number {
		return this.lastValue;
	}
	set valueSetter(val: number) {
		this.y = this.chart.positions['chart'].y2 - val;
		this.height = val;
		this.lastValue = val;
	}

	public render():void {
		let unit = this.containerHeight / this.chart.maxValue;
		this.tween && this.tween.kill();
		this.tween = TweenLite.to(this, 1, {valueSetter: this.value * unit, ease: Cubic.easeOut});
	}
}

class AxisX {

	constructor(
		private chart: BarChartComponent,
		public index: number,
		public label: string = ""
		) {
	}

	private get containerWidth():number {
		return this.chart.positions['axisX'].x2 - this.chart.positions['axisX'].x1; 
	}

	private get totalCount():number {
		return this.chart.rawData[0].data.length;
	}

	public get width():number {
		return (this.containerWidth / (this.totalCount * 3)) * 2;
	}

	public get x1():number {
		return this.chart.positions['axisX'].x1 + ((this.index * this.width * 1.5) + this.width / 4);
	}

	public get x2():number {
		return this.x1 + this.width;
	}
}

class AxisY {
	public visible: boolean = true;
	private y: number;
	public tween: TweenLite;

	constructor(
		private chart:BarChartComponent,
		public value: number
		) {
		this.y = this.chart.positions['axisY'].y2;
	}

	render() {
		this.y = this.y || this.chart.positions['axisY'].y2;
		let unit = (this.chart.positions['axisY'].y2 - this.chart.positions['axisY'].y1) / this.chart.maxValue;

		this.tween && this.tween.kill();
		this.tween = TweenLite.to(this, 1, {y: this.chart.positions['axisY'].y2 - (this.value * unit), ease: Cubic.easeOut});
	}
}

class Group {
	public label: string;
	public active: boolean = true;
	public bars: Bar[];
	public colorClass: string;

	constructor(
		chart: BarChartComponent,
		data: IChartRaw
		) {
		this.label = data.label;

		this.bars = data.data.map((value, index) => {
			return new Bar(chart, chart.axisX[index], value.value);
		});

		this.colorClass = data.colorClass;
	}

	public render() {
		this.bars.forEach(bar => {
			bar.render();
		});
	}
}

@Component({
	selector: 'bar-chart',
	template: String(require('./bar-chart.pug')),
	styles: [String(require('./bar-chart.scss'))],
	inputs: ['width', 'height', 'showLabels', 'rawData: data']
})
export class BarChartComponent {
	public width = 150;
	public height = 100;
	public showLabels = false;
	public positions: {[key: string]: Position} = {};
	public rawData: IChartRaw[];
	public axisX: AxisX[];
	public maxValue: number = 0;
	public groups: Group[];
	@ViewChild('labelsRef') public labelsRef: ElementRef;
	public labelProps = {left: DEF_POSITIONS['labels'].x1, height: 0};
	private axisY: {[key: number]: AxisY} = {};

	constructor(
		private window: WindowService,
		private el: ElementRef) {
	}

	private ngAfterContentInit():void {

		// Get max data value
		this.rawData.forEach(group => {
			group.data.forEach(data => {
				this.maxValue = Math.max(data.value, this.maxValue);
			});
		});

		// Set container positions
		['labels', 'axisX', 'axisY', 'chart'].forEach(name => {
			this.positions[name] = new Position(this, name);
		});

		// Set axisX array
		this.axisX = this.rawData[0].data.map((val, index) => {
			return new AxisX(this, index, val.label);
		});

		// Set groups
		this.groups = this.rawData.map(res => {
			return new Group(this, res);
		});

		// Generate axisY
		const axisYcount = Math.floor(this.maxValue / 100);

		each<AxisY>(this.axisY, res => res.visible = false);

		for (let i = 1; i <= axisYcount; i++) {
			this.axisY[i * 100] = new AxisY(this, i * 100);
		}
	}

	private ngAfterViewInit():void {

		if (this.showLabels) {
			this.handleLabelPosition();
			this.window.resize$$.subscribe(res => {
				this.handleLabelPosition();
			});
		}
		defer(() => {
			this.render();
		});
	}

	private handleLabelPosition():void {
		this.labelProps.height = (this.labelsRef.nativeElement as SVGRectElement).getBoundingClientRect().height;
	}

	private toggleGroup(group:Group):void {

		if (group.active && this.groups.filter(group => group.active).length <= 1) {
			return;
		}

		group.active = !group.active;

		this.maxValue = 0;
		this.groups.filter(g => g.active).forEach(g => {
			g.bars.forEach(bar => {
				this.maxValue = Math.max(this.maxValue, bar.value); 
			});
		});
		this.render();
	}

	public render() {
		this.groups.forEach(group => {
			if (group.active) {
				group.render();
			}
		});
		this.toggleAxisY();
	}

	private toggleAxisY() {
		const count = Math.floor(this.maxValue / 100);

		each<AxisY>(this.axisY, res => {
			const condition = res.value / 100 <= count; 
			res.visible = condition;
			condition && res.render();
		});
	}

	private ngOnDestroy():void {
		each<AxisY>(this.axisY, axis => {
			axis.tween && axis.tween.kill();
		});

		this.groups.forEach(group => {
			group.bars.forEach(bar => {
				bar.tween && bar.tween.kill();
			});
		});
	}
}