class TempScrollBox {
    constructor() {
      this.scrollBarWidth = 0;
  
      this.measureScrollbarWidth();
    }
  
    measureScrollbarWidth() {
      // Add temporary box to wrapper
      let scrollbox = document.createElement('div');
  
      // Make box scrollable
      scrollbox.style.overflow = 'scroll';
  
      // Append box to document
      document.body.appendChild(scrollbox);
  
      // Measure inner width of box
      this.scrollBarWidth = scrollbox.offsetWidth - scrollbox.clientWidth;
  
      // Remove box
      document.body.removeChild(scrollbox);
    }
  
    get width() {
      return this.scrollBarWidth;
    }
  }

  export default TempScrollBox;