/// <reference path="../../front-end.d.ts" />

import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { noop, last } from 'lodash';

type TBreakpoints = 'xsmall' | 'small' | 'medium' | 'large';

const BREAKPOINTS: {[key: string]: number} = {
	'large': 1280,
	'medium': 960,
	'small': 600,
	'xsmall': 0
};

export const BREAKPOINT_ORDER: TBreakpoints[] = ['xsmall', 'small', 'medium', 'large'];

@Injectable()
export class WindowService {
	public resize$$: Observable<Event>;
	private _currentBreakpoint: TBreakpoints;
	public breakpoint$$ = new BehaviorSubject<TBreakpoints>('large');

	constructor() {
		this.resize$$ = Observable.fromEvent(window, 'resize').bufferTime(300).filter(res => !!res.length).map(res => last(res)).share();
		this.getBreakpoint();

		this.resize$$.subscribe(res => {
			this.getBreakpoint();
		});
	}

	get breakpoint():TBreakpoints {
		return this._currentBreakpoint;
	}
	set breakpoint(val: TBreakpoints) {
		if (val !== this._currentBreakpoint) {
			this._currentBreakpoint = val;
			this.breakpoint$$.next(val);
		}
	}

	private getBreakpoint():void {
		Object.getOwnPropertyNames(BREAKPOINTS).some((val: TBreakpoints) => {
			if (window.innerWidth > BREAKPOINTS[val]) {
				this.breakpoint = val;
				return true;
			}
			return false;
		});
	}
}