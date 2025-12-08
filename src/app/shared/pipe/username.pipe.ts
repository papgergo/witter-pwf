import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'username',
})
export class UsernamePipe implements PipeTransform {
  transform(text: string): unknown {
    if (!text) {
      return '';
    }
    return '@' + text;
  }
}
