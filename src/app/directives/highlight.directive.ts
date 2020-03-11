import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {

  constructor(private el: ElementRef,
    private renderer: Renderer2) { }
   
    @HostListener('mouseenter') onMouseEnter() {
      if(window.innerWidth > 960) {
        this.renderer.addClass(this.el.nativeElement, 'highlight');
      }
    }
  
    @HostListener('mouseleave') onMouseLeave() {
      if(window.innerWidth > 960) {
        this.renderer.removeClass(this.el.nativeElement, 'highlight');
      }
    } 

}