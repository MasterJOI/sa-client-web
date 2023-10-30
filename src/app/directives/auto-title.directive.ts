import {AfterViewInit, Directive, ElementRef, Input} from '@angular/core';

@Directive({
  selector: 'th, td',
  standalone: true
})
export class AutoTitleDirective implements AfterViewInit {

  @Input() autoTitle: string = '';

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    const element = this.el.nativeElement;
    const content = this.autoTitle || element.textContent;

    if (content) {
      element.setAttribute('title', content);
    }
  }

}
