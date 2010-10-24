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
    document.addEventListener('keyup', function(e) {
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
    if (!this.currentSlide.goFwd())
      this.transitToNextSlide();
  },
  goBack: function() {
    if (!this.currentSlide.goBack())
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

var Element = function(node, i) {
  this.node = node;
  this.nr = i;
  this.elements = [];
  this.steps = [];
  this.process();
}

Element.prototype = {
  node: null,
  nr: null,
  elements: null,
  steps: null,
  currentStep: -1,
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
  goFwd: function() {
    if (this.steps.length==0)
      return false;
    if (this.currentStep<0)
      return this.transitToNextStep();
    if (!this.steps[this.currentStep].goFwd())
      return this.transitToNextStep();
    return true;
  },
  goBack: function() {
    if (this.steps.length==0)
      return false;
    if (this.currentStep==-1)
      return false;
    if (!this.steps[this.currentStep].goBack())
      return this.transitToPrevStep();
    return true;
  },
  transitToNextStep: function() {
    if(this.currentStep<this.steps.length-1) {
      this.currentStep+=1;
      this.steps[this.currentStep].addClass('active');
      return true;
    } else
      return false; 
  },
  transitToPrevStep: function() {
    if (this.currentStep>=0) {
      this.steps[this.currentStep].removeClass('active');
      this.currentStep-=1;
      return true;
    } else
      return false;
  },
  process: function() {
    var nodes = this.node.children;
    for(var i=0;i<nodes.length;i++)
      this.elements.push(new Element(nodes[i], i))
    for(i in this.elements)
      this.steps.push(this.elements[i]);
  },
}

var Slide = function(node, i) {
  this.node = node;
  this.nr = i;
  this.elements = [];
  this.steps = [];
  this.process();
}

Slide.prototype = {
  node: null,
  nr: null,
  elements: null,
  steps: null,
  currentStep: -1,
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
  goFwd: function() {
    if (this.currentStep<0)
      return this.transitToNextStep();
    if (!this.steps[this.currentStep].goFwd())
      return this.transitToNextStep();
    return true;
  },
  goBack: function() {
    if (this.currentStep<0)
      return false;
    if (!this.steps[this.currentStep].goBack())
      return this.transitToPrevStep();
    return true;
  },
  transitToNextStep: function() {
    if (this.currentStep<this.steps.length-1) {
      this.currentStep+=1;
      this.steps[this.currentStep].addClass('active');
      return true;
    } else
      return false; 
  },
  transitToPrevStep: function() {
    if (this.currentStep>=0) {
      this.steps[this.currentStep].removeClass('active');
      this.currentStep-=1;
      return true;
    } else
      return false;
  },
  process: function() {
    var nodes = this.node.children;
    for(var i=0;i<nodes.length;i++)
      this.elements.push(new Element(nodes[i], i))
    for(i in this.elements)
      this.steps.push(this.elements[i]);
  }, 
}

var s5 = new S5();
s5.boot();
