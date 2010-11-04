S5.transitions.Basic = {
  defaultAction: true,
  name: 'basic',
  transitToSlide: function(i, s5) {
  },
  prepare: function(s5) {
  }
}

S5.transitions.Dissolve = {
  defaultAction: true,
  name: 'dissolve',
  transitToSlide: function(i, s5) {
  },
  prepare: function(s5) {
  }
}

S5.transitions.Push = {
  defaultAction: true,
  name: 'push',
  transitToSlide: function(i, s5) {
    s5.node.style.marginLeft='-'+(i*100)+'%';
  },
  prepare: function(s5) {
    for(var i=0;i<s5.slides.length;i++) {
      s5.slides[i].node.style.left = (i*100)+'%';
      s5.slides[i].node.removeAttribute('id');
    }
  }
}


S5.transitions.Slide = {
  defaultAction: true,
  name: 'slide',
  transitToSlide: function(i, s5) {
    s5.node.style.marginLeft='-'+(i*50+i*10)+'%';
  },
  prepare: function(s5) {
    document.body.style.backgroundColor = 'black';
    for(var i=0;i<s5.slides.length;i++) {
      s5.slides[i].node.style.left = (25+(i*50)+(i*10))+'%';
      s5.slides[i].node.removeAttribute('id');
    }
  }
}
