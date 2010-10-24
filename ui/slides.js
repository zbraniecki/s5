var S5 = function() {
}

S5.prototype = {
  currentSlide: null,
  slides: [],

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
    var n = this.currentSlide.nr-1;
    if (n<0)
      return;
    this.transitToSlide(n, -1);
  },
  transitToNextSlide: function() {
    var n = this.currentSlide !== null?this.currentSlide.nr+1:0;
    if (n>=this.slides.length)
      return;
    this.transitToSlide(n, 1);
  },
  transitToSlide: function(i, dir) {
    var slide = this.slides[i];
    this.transition.transitToSlide(i, this);
    if (this.transition.defaultAction) {
      if (this.currentSlide !== null) {
        this.currentSlide.removeClass('active');
        if (dir === 1) {
          slide.removeClass('next');
          if (i>1)
            this.slides[i-2].removeClass('prev');
        }
        if (dir === -1) {
          slide.removeClass('prev');
          if (i<this.slides.length-2)
            this.slides[i+2].removeClass('next');
        }
      }
      slide.addClass('active');
      if (i<this.slides.length-1)
        this.slides[i+1].addClass('next');
      if (i>0)
        this.slides[i-1].addClass('prev');
    }
    this.currentSlide = this.slides[i];
  },
  processSlides: function() {
    var slides = document.getElementsByClassName('slide');
    for (var i=0;i<slides.length;i++)
      this.slides.push(new Slide(slides[i], i));
    },
  setDefaultTransitionForSlide: function(name) {
    for (var i in this.slides) {
      this.slides[i].addClass('transition_'+name);
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
    this.processSlides();
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

var Slide = function (node, i) {
  this.node = node;
  this.nr = i;
}

Slide.prototype = {
  node: null,
  nr: null,
  removeClass: function(className) {
	this.node.className = this.node.className.replace(new RegExp('(^|\\s)'+className+'(\\s|$)'), RegExp.$1+RegExp.$2);
  },
  addClass: function(className) {
	if (this.node.className) {
		this.node.className += ' '+className;
	} else {
		this.node.className = className;
	}
  },
  hasClass: function(name) {
  },
 
}

var s5 = new S5();
s5.boot();
