(function($){

  // setup a couple of helper methods for the gallery
  $.fn.showPhoto = function(index) {
    var slide = $(this),
        photo = slide.children().first(),
        photos = slide.parent().data("photo-info");

    slide.data("photo-index", index);
    
    if (index >= 0 && index < photos.length) {
      // TODO: set the img's src
      //photo.children("img").attr("src", photos[index].id);
      photo.text(photos[index].id);
      /*photo.css({ 'width': photos[index].width,
                  'height': photos[index].height,
                  'top': (slide.height() - photos[index].height)/2});*/
      photo.css('top', '36px');
      photo.show();
    } else {
      photo.hide();
    }
  };

  $.fn.clearPhoto = function() {
    $(this).find("img").removeAttr("src");
  };

  var slideQueue = $({});

  $.fn.queueSlide = function(slideFunc) {
    slideQueue.queue(function(next) {
      slideFunc(function() {
        next();
      });
    });
  };

  // check whether the browser supports CSS transitions
  var doc = $(document),
      test = $('<div>').css({
        position: 'absolute',
        top: -10,
        width: 1,
        height: 1,
        WebkitTransition: 'top 0.001s linear',
        MozTransition:    'top 0.001s linear',
        OTransition:      'top 0.001s linear',
        transition:       'top 0.001s linear'
      }),
      timer;
  
  function removeTest(){
    clearTimeout(timer);
    timer = null;
    test.remove();

    // Stop listening for transitionend
    doc.unbind('transitionend webkitTransitionEnd oTransitionEnd', transitionEnd);
  }
  
  function transitionEnd(e){
    // Get rid of the test element
    removeTest();
    
    // Store flags in jQuery.support
    $.support.cssTransition = true;
    $.support.cssTransitionEnd = e.type;
  }
  
  doc
  .bind('transitionend webkitTransitionEnd oTransitionEnd', transitionEnd)
  .ready(function(){
    // Put the test element in the body
    document.body.appendChild( test[0] );
    
    // Apply CSS to trigger a transition
    setTimeout(function() { test.css({ top: -310 }); }, 1);
    
    // Wait for the transition test to finish, and if it does not,
    // get rid of the test element. Opera requires a much greater delay
    // than the time the transition should take, worryingly.
    timer = setTimeout(function(){
      removeTest();
      
      // Store flags in jQuery.support
      $.support.cssTransition = false;
      $.support.cssTransitionEnd = false;
      
    }, 1000);
  });
})(jQuery);
