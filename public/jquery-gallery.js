(function($){

  // setup a couple of helper methods for the gallery
  $.fn.showPhoto = function(index) {
    var slide = $(this);

    if (!slide.hasClass("slide"))
      return;

    var div = slide.children().first(),
        photos = slide.parent().data("photo-info"),
        photo = photos[index];

    slide.data("photo-index", index);
    
    if (index >= 0 && index < photos.length) {
      // get the img loading
      var img = div.children("img");
      
      if (img.size() == 0) {
        img = $('<img src="' + photo.url + '" />');
        div.prepend(img);
      } else {
        img.attr('src', photo.url);
      }

      slide._scalePhoto(slide, photo, div, img);
      
      div.show();
    } else {
      div.hide();
    }
  };

  $.fn.rescalePhoto = function() {
    var slide = $(this);

    if (!slide.hasClass("slide"))
      return;

    var div = slide.children().first(),
        img = div.children("img"),
        index = slide.data("photo-index"),
        photos = slide.parent().data("photo-info");

    if (index >= 0 && index < photos.length) {
      slide._scalePhoto(slide, photos[index], div, img);
    }
  };

  $.fn._scalePhoto = function(slide, photo, div, img) {
    // work out how to scale the image
    var scale = 1.0,
        max_w = slide.width() - 10,
        max_h = slide.height() - 10;

    if (photo.width > max_w || photo.height > max_h) {
      var scale_w = max_w / photo.width,
          scale_h = max_h / photo.height;
          
      scale = Math.min(scale_w, scale_h);
    }

    var width = photo.width * scale,
        height = photo.height * scale,
        top = (slide.height() - height) / 2;

    // the -1 covers up any mismatches with the scaling; the div has overflow
    // set to hidden so it's better for the img to be slightly larger
    div.css({ 'width': width-1,
              'height': height-1,
              'top': top });

    img.css({ 'width': width,
              'height': height });
  };

  $.fn.clearPhoto = function() {
    var slide = $(this);

    if (!slide.hasClass("slide"))
      return;

    slide.find("img").remove();
  };

  var slideQueue = $({});

  $.fn.queueSlide = function(slideFunc) {
    slideQueue.queue(function(next) {
      slideFunc(function() {
        next();
      });
    });
  };

  $.fn.addTransitionClass = function(clazz, callback) {
    if ($.support.cssTransition) {
      // force browser to reflow before starting transition
      this.width();

      // setup the transition end callback
      this.one($.support.cssTransitionEnd, callback);

      // start the transition
      this.addClass(clazz);

    } else {
      // no transitions
      this.addClass(clazz);
      callback();
    }
  };

  $.fn.removeTransitionClass = function(clazz, callback) {
    if ($.support.cssTransition) {
      // force browser to reflow before starting transition
      this.width();

      // setup the transition end callback
      this.one($.support.cssTransitionEnd, callback);

      // start the transition
      this.removeClass(clazz);

    } else {
      // no transitions
      this.removeClass(clazz);
      callback();
    }
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
