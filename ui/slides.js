var S5 = function() {
}

S5.prototype = {
  currentSlide: null,
  slides: [],
  currentStep: null,
  transition: null,
  effect: null,
  node: null,

  setCurrentStep: function(node) {
    if (this.currentStep)
      this.currentStep.removeClass('current')
    if (node) {
      node.addClass('current')
      this.currentStep = node;
    }
  },
  bindInput: function() {
    var self = this;
    document.addEventListener('click', function(e) {
      self.goFwd();
    }, false);
    document.addEventListener('keyup', function(e) {
      e.stopPropagation();
      e.preventDefault();
    }, false);
    document.addEventListener('keydown', function(e) {
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
      if (blockDefault) {
        e.stopPropagation();
        e.preventDefault();
      } 
    }, false);
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
    //slide.reset();
    this.transition.transitToSlide(i, this);
    if (this.transition.defaultAction) {
      if (this.currentSlide !== null) {
        if (dir === 1) {
          slide.removeClass('next');
          this.currentSlide.removeClass('active');
          if (i>1)
            this.slides[i-2].removeClass('prev');
        }
        if (dir === -1) {
          slide.removeClass('prev');
          this.currentSlide.removeClass('active');
          if (i<this.slides.length-2)
            this.slides[i+2].removeClass('next');
        }
      }
      if (i<this.slides.length-1)
        this.slides[i+1].addClass('next');
      if (i>0)
        this.slides[i-1].addClass('prev');
      location.hash='slide'+i;
      this.slides[i].addClass('active');
    }
    this.currentSlide = this.slides[i];
  },
  processSlides: function() {
    var slides = document.getElementsByClassName('slide');
    for (var i=0;i<slides.length;i++)
      this.slides.push(new Slide(slides[i], i, this));
    },
  setDefaultTransitionForSlide: function(name) {
    for (var i in this.slides) {
      this.slides[i].addClass('transition_'+name);
    }
    this.transition.prepare(this);
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
          break;
        case 'effect':
          var str = allMetas[i].content;
          this.effect = str;
          var list = document.getElementsByClassName('buildin');
          for (var i=0;i<list.length;i++) {
            list[i].classList.add('buildin_'+this.effect);
          }
          break;
        case 'controls':
          var str = allMetas[i].content;
          this.controls = new ControlUI(this);
          this.controls.inject(document.getElementsByClassName('presentation')[0]);
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
    this.node = document.getElementsByClassName('presentation')[0];
    this.setMode();
    this.bindInput();
    this.convert(this.node);
    this.setParams();
    this.processSlides();
    //this.controlIU;
    this.setDefaultTransitionForSlide(this.transition.name);
    this.transitToNextSlide();
  },
  boot: function() {
    var self = this;
    window.addEventListener('load', function() {
      self.startup();
    }, true);
  },
  convert: function(node) {
    var nodes = node.children;
    for(var i=0;i<nodes.length;i++) {
      if (nodes[i].classList.contains('incremental')) {
        for (var j=0;j<nodes[i].children.length;j++) {
          nodes[i].children[j].classList.add("buildin");
        }
        if (j==0)
          nodes[i].className="incremental buildin";
      }
      this.convert(nodes[i]);
    }
  }
}

S5.transitions = {}

var Element = function(node, i, parent, slide, s5, proc) {
  this.node = node;
  this.nr = i;
  this.elements = [];
  this.steps = [];
  this.effects = {'buildin': null};
  if (parent)
    this.parent = parent;
  if (slide)
    this.slide = slide;
  if (s5)
    this.s5 = s5;
  if (proc)
    this.process();
}

Element.prototype = {
  node: null,
  nr: null,
  elements: null,
  steps: null,
  s5: null,
  slide: null,
  parent: null,
  effects: null,
  currentStep: -1,
  removeClass: function(className) {
    this.node.classList.remove(className);
  },
  addClass: function(className) {
    this.node.classList.add(className);
  },
  hasClass: function(className) {
    return this.node.classList.contains(className);
  },
  setCurrentStep: function() {
    if (this.currentStep>-1) {
      if (this.steps[this.currentStep].currentStep > -1)
        this.steps[this.currentStep].setCurrentStep()
      else
        this.s5.setCurrentStep(this.steps[this.currentStep])
    } else
      this.parent.setCurrentStep();
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
    if (this.currentStep===-1)
      return false;
    if (!this.steps[this.currentStep].goBack())
      return this.transitToPrevStep();
    else {
      if (this.steps[this.currentStep].currentStep==-1 &&
          this.steps[this.currentStep].effects['buildin']==null) {
        return this.transitToPrevStep();
      }
    }
    this.setCurrentStep();
    return true;
  },
  transitToNextStep: function() {
    if(this.currentStep<this.steps.length-1) {
      this.currentStep+=1;
      if (this.steps[this.currentStep].effects['buildin']) {
        this.steps[this.currentStep].addClass('active');
        this.setCurrentStep();
        return true;
      } else {
        return this.goFwd();
      }
    } else {
      return false;
    } 
  },
  transitToPrevStep: function() {
    if (this.currentStep>=0) {
      this.currentStep-=1;
      this.steps[this.currentStep+1].removeClass('active');
      return true;
    } else
      return false;
  },
  reset: function() {
    for (var i=0;i<this.steps.length;i++) {
      this.steps[i].removeClass('active');
      this.steps[i].reset();
    }
    this.currentStep=-1;
    this.parent.setCurrentStep();
  },
  process: function() {
    if(!this.node)return;
    var nodes = this.node.children;
    for(var i=0;i<nodes.length;i++) {
      var elem = new Element(nodes[i], i, this, this.slide, this.s5, true); 
      this.elements.push(elem)
    }
    for(i in this.elements) {
      var elem = this.elements[i];
      var style = document.defaultView.getComputedStyle(elem.node, null);
      if (this.elements[i].hasClass('buildin')){
        elem.effects['buildin'] = this.s5.effect;
        this.steps.push(this.elements[i]);
      }else if (this.elements[i].steps.length > 0) {
        this.steps.push(this.elements[i]);
      }
    }
  },
}

var Slide = function(node, i, s5) {
  Element.call(this, node, i, s5, this, s5, false);
  this.node.setAttribute('id', 'slide'+i);
  this.process();
}

Slide.prototype = new Element;
Slide.prototype.constructor = Slide;

Slide.prototype.notes = null;
Slide.prototype.process = function() {
    var nodes = this.node.children;
    for(var i=0;i<nodes.length;i++) {
      var elem = new Element(nodes[i], i, this, this, this.s5, true);
      if (elem.hasClass('notes'))
        this.notes = elem;
      else
        this.elements.push(elem);
    }
    for(i in this.elements) {
      var elem = this.elements[i];
      if (this.elements[i].hasClass('buildin')){
        elem.effects['buildin'] = this.s5.effect;
        this.steps.push(this.elements[i]);
      }else if (this.elements[i].steps.length > 0) {
        this.steps.push(this.elements[i]);
      }
    }
}

var s5 = new S5();
s5.boot();
