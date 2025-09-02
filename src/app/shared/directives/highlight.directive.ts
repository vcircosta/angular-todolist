// src/app/shared/directives/highlight.directive.ts
import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true,
})
export class HighlightDirective implements OnInit {
  @Input() appHighlight: string = 'yellow';
  @Input() appHighlightDelay: number = 0;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.renderer.setStyle(this.el.nativeElement, 'background-color', this.appHighlight);
    }, this.appHighlightDelay);
  }
}
