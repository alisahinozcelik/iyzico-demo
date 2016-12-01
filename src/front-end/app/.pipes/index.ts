export * from './values.pipe';
export * from './reverse.pipe';

import { ValuesPipe } from './values.pipe';
import { ReversePipe } from './reverse.pipe';

export const PIPES = [
	ValuesPipe,
	ReversePipe
];