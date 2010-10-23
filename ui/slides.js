var S5 = function() {
}

S5.prototype = {
  currentSlide: {'nr': null, 'handler': null},

  removeClass: function(object, className) {
	object.className = object.className.replace(new RegExp('(^|\\s)'+className+'(\\s|$)'), RegExp.$1+RegExp.$2);
  },
  addClass: function(object, className) {
	if (object.className) {
		object.className += ' '+className;
	} else {
		object.className = className;
	}
  },

  bindInput: function() {
    var self = this;
    document.addEventListener('click', function() {
      self.goFwd();
    }, true);
    document.addEventListener('keypress', function(e) {
      var key = e.keyCode;
      var blockDefault = true;
      switch (key) {
        case 37: // left arrow key
          self.goBack();
          break;
        case 39: // right arrow key
          self.goFwd();
          break;
        default:
          blockDefault = false;
      }
      if (blockDefault)
        e.preventDefault(); 
    }, true);
  },
  goFwd: function() {
    this.transitToNextSlide();
  },
  goBack: function() {
    this.transitToPrevSlide();
  },
  transitToPrevSlide: function() {
    var slides = document.getElementsByClassName('slide');
    var n = this.currentSlide.nr-1;
    if (n<0)
      return;
    this.transitToSlide(n, -1);
  },
  transitToNextSlide: function() {
    var slides = document.getElementsByClassName('slide');
    var n = this.currentSlide.nr !== null?this.currentSlide.nr+1:0;
    if (n>=slides.length)
      return;
    this.transitToSlide(n, 1);
  },
  transitToSlide: function(i, dir) {
    var slides = document.getElementsByClassName('slide');
    this.transition.transitToSlide(i, this);
    if (this.transition.defaultAction) {
      if (this.currentSlide.nr !== null) {
        this.removeClass(this.currentSlide.handler, 'active');
        if (dir === 1) {
          this.removeClass(slides[i], 'next');
          if (i>1)
            this.removeClass(slides[i-2], 'prev');
        }
        if (dir === -1) {
          this.removeClass(slides[i], 'prev');
          if (i<slides.length-2)
            this.removeClass(slides[i+2], 'next');
        }
      }
      this.addClass(slides[i], 'active');
      if (i<slides.length-1)
        this.addClass(slides[i+1], 'next');
      if (i>0)
        this.addClass(slides[i-1], 'prev');
    }
    this.currentSlide.nr = i;
    this.currentSlide.handler = slides[i];
  },
  setDefaultTransitionForSlide: function(name) {
    var slides = document.getElementsByClassName('slide');
    for (var i in slides) {
      this.addClass(slides[i], 'transition_'+name);
    }
  },
  setParams: function() {
    var allMetas = document.getElementsByTagName('meta');
    for(var i in allMetas) {
      switch (allMetas[i].name) {
        case 'defaultView':
          break;
        case 'transition':
          var str = allMetas[i].content;
          this.transition = S5.transitions[str.slice(0,1).toUpperCase() + str.slice(1)];
          this.setDefaultTransitionForSlide(str);
          break;
        case 'controlVis':
          break;
      }
    }
  },
  setMode: function() {
    var slides = document.getElementById('slideProj');
    slides.setAttribute('media','screen');
    slides.disabled=false;
  },
  startup: function() {
    this.setMode();
    this.bindInput();
    this.setParams();
    this.transitToNextSlide();
  },
  boot: function() {
    var self = this;
    window.addEventListener('load', function() {
      self.startup();
    }, true);
  }
}

S5.transitions = {}

var s5 = new S5();
s5.boot();
