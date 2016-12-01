/// <reference path="../common.d.ts" />
/// <reference path="../../typings/globals/greensock/index.d.ts" />

declare class MTweenLite extends TweenLite  {
	public to(target: Object, duration: number, vars: TweenConfig): TweenLite;
	public ticker: {fps: (framerate: number)=>void};
}
declare class MTweenMax extends MTweenLite  {
}
declare class MCubic extends Cubic {
	public easeIn: MCubic;
	public easeInOut: MCubic;
	public easeOut: MCubic;
}

declare module 'gsap' {
	const TweenMax: MTweenMax;
	const TweenLite: MTweenLite;
	const Cubic: MCubic;
}