S5.transitions.Basic = {
  defaultAction: true,
  name: 'basic',
  transitToSlide: function(i, s5) {
  }
}

S5.transitions.Dissolve = {
  defaultAction: true,
  name: 'dissolve',
  transitToSlide: function(i, s5) {
  }
}

S5.transitions.Push = {
  defaultAction: true,
  name: 'push',
  transitToSlide: function(i, s5) {
    document.getElementsByClassName('presentation')[0].style.marginLeft='-'+(i*100)+'%';
  },
  prepare: function(slides) {
    for(var i=0;i<slides.length;i++) {
      slides[i].node.style.left = (i*100)+'%';
    }
  }
}


S5.transitions.Slide = {
  defaultAction: true,
  name: 'slide',
  transitToSlide: function(i, s5) {
  }
}
