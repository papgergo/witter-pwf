import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'date',
})
export class DatePipe implements PipeTransform {
  transform(value: string): Date | null {
    if (!value || typeof value !== 'string') {
      return null;
    }

    const parts = value.split('.');
    const [year, month, day, hour, minute, second] = parts.map((part) => parseInt(part));
    const date = new Date(year, month - 1, day, hour, minute, second);

    return date;
  }
}
