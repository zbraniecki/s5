var ControlUI = function(s5) {
  this.s5 = s5;
}

ControlUI.prototype = {
  node: null,
  selectorNode: null, 
  bindInput: function() {
    var self = this;
  },
  inject: function(parent) {
    var panel = document.createElement('div');
    var nav = document.createElement('nav');
    var fwdButton = document.createElement('button');
    var backButton = document.createElement('button');
    panel.setAttribute('class', 'control_panel');
    fwdButton.setAttribute('class', 'fwd_button');
    backButton.setAttribute('class', 'back_button');
    var self = this;
    fwdButton.addEventListener('click', function(e) {
      self.s5.goFwd();  
    }, false);
    backButton.addEventListener('click', function(e) {
      self.s5.goBack();  
    }, false);
    nav.appendChild(backButton);
    nav.appendChild(fwdButton);

    var selector = document.createElement('select');
    this.selectorNode = selector;
    nav.appendChild(selector);
    panel.appendChild(nav);

    var debugButton = document.createElement('button');
    debugButton.innerHTML = "debug";
    debugButton.addEventListener('click', function(e) {
      self.s5.node.classList.toggle('debug');  
    }, false);

    panel.appendChild(debugButton);

    parent.appendChild(panel);
    this.node = panel;
    this.node.addEventListener('click', function(e) {
      e.stopPropagation();
      e.preventDefault();
    }, false);
  },
  setSlideList: function(slides) {
    for(var i=0;i<slides.length;i++) {
      var option = document.createElement('option');
      option.innerHTML="foo";
      this.selector.appendChild(option);
    }
  }
}
