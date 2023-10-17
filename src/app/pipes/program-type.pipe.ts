import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'programTypeInitials',
  standalone: true
})
export class ProgramTypePipe implements PipeTransform {
  transform(value: string): string {
    const words = value.split('-');
    const initials = words.map(word => word.charAt(0).toUpperCase()).join('');
    return initials;
  }
}
