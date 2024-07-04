import { Directive, ElementRef, Renderer2, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appCheckFigure]'
})
export class CheckFigureDirective implements AfterViewInit {

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.checkForFigureTag();
  }

  checkForFigureTag(): void {
    const figureTag = this.el.nativeElement.querySelector('figure');
    const magnifyIcon = this.el.nativeElement.parentElement.querySelector('.zoom-icon');

    if (figureTag) {
      this.renderer.setStyle(magnifyIcon, 'display', 'block');
    } else {
      this.renderer.setStyle(magnifyIcon, 'display', 'none');
    }
  }
}
