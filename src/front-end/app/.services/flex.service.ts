import { Injectable } from '@angular/core';

@Injectable()
export class FlexService {
	private styles: {[key: number]: HTMLStyleElement} = {};
	private gap = 30;
	private element = document.createElement('style');
	private template =`
		[flex="#{count}"] > * {
			width: #{width};
		}`;

	constructor() {
	}

	public setStyle(count: number):void {
		if (!this.styles[count]) {
			this.styles[count] = (this.element.cloneNode(true) as HTMLStyleElement);

			const width = 'calc('+ (100 / count) +'% - ' + (((count - 1) * this.gap) / count) + 'px)';
			const css = this.template.replace('#{count}', String(count)).replace('#{width}', width);

			this.styles[count].appendChild(document.createTextNode(css.trim().replace(/\r?\n|\r/g, '').replace(/\s\s/g, ' ')));
			document.head.appendChild(this.styles[count]);
		}
	}
}