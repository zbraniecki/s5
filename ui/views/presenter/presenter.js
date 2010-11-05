var PresenterScreen = function() {
}

PresenterScreen.prototype = {
  inject: function() {
    var currentSlide = document.createElement('div');
    var nextSlide = document.createElement('div');
    currentSlide.setAttribute('class', 'currentSlide');
    nextSlide.setAttribute('class', 'nextSlide');
    document.body.appendChild(currentSlide);
    document.body.appendChild(nextSlide);
    var pres = document.getElementsByClassName('presentation')[0];
    pres.setAttribute('id', 'presentation');
    //pres.parentNode.removeChild(pres);
    //currentSlide.appendChild(pres);
  },
  initialize: function() {
    this.inject();
  }
}
