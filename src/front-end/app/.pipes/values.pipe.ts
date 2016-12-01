import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'values',
	pure: false
})
export class ValuesPipe implements PipeTransform {
  transform<T>(value: {[key: string]: T}, args: any[] = null): T[] {
    return Object.keys(value).map(key => value[key]);
  }
}