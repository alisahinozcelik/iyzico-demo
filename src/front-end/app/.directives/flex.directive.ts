import { Directive, Input, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';

import { FlexService, WindowService, BREAKPOINT_ORDER } from '../.services';

@Directive({
	selector: '[flex-cont]'
})
export class FlexDirective {
	@Input('flex-cont') private temp: number[];
	private subs: Subscription;

	constructor(
		private el: ElementRef,
		private window: WindowService,
		private flex: FlexService
		) {
	}

	private ngOnInit():void {		
		this.subs = this.window.breakpoint$$.subscribe(res => {

			const index = BREAKPOINT_ORDER.indexOf(res);
			const count = this.temp[index];

			(this.el.nativeElement as HTMLElement).setAttribute('flex', String(count));
			this.flex.setStyle(count);

		});
	}

	private ngOnDestroy():void {
		this.subs.unsubscribe();
	}

}