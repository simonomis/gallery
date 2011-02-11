
/*var photos = [
  {
    "url": "photos/1.jpg",
    "height": 240,
    "width": 320
  },
  {
    "url": "photos/2.jpg",
    "height": 240,
    "width": 320
  },
  {
    "url": "photos/3.jpg",
    "height": 320,
    "width": 240
  },
  {
    "url": "photos/4.jpg",
    "height": 240,
    "width": 320
  },
  {
    "url": "photos/5.jpg",
    "height": 240,
    "width": 320
  },
  {
    "url": "photos/6.jpg",
    "height": 320,
    "width": 240
  },
  {
    "url": "photos/7.jpg",
    "height": 240,
    "width": 320
  },
  {
    "url": "photos/8.jpg",
    "height": 240,
    "width": 320
  },
  {
    "url": "photos/9.jpg",
    "height": 320,
    "width": 240
  }
];*/

$(document).ready(function() {
  // setup the swipes
  $("body").swipe({
    swipeLeft: queueSlideLeft,
    swipeRight: queueSlideRight
  });
  
  // setup the clicks
  setClickHandlers();
  
  // setup the error message
  $("#error").ajaxError(function(e, x, h, ex) {
    console.log(ex);
    $(this).show();
  });
  
  $.getJSON('/album/1', function(data) {
    $("#photoslider").data("photo-info", data.photos);
    populateSlides();
  });
  
});

function queueSlideLeft() {
  $().queueSlide(slideLeft);
}

function queueSlideRight() {
  $().queueSlide(slideRight);
}

function populateSlides() {
  $(".slide").each(function(i) {
    $(this).showPhoto(i-2);
  });
}

function clearClickHandlers() {
  $(".slide").unbind('click');
}

function setClickHandlers() {
  // set the slides immediately to the left and right
  // of the centre slide to handle the clicks
  var slides = $(".slide");
  $(slides[1]).bind('click', queueSlideRight);
  $(slides[3]).bind('click', queueSlideLeft);
}

function slideLeft(finished) {
  var slide = $(".slide:first");

  // check we can slide left
  if ($(".slide:last").data("photo-index") >
      $("#photoslider").data("photo-info").length) {
    finished();
    return;
  }

  // prevent any clicks while sliding and clear the
  // photo on the slide we're about to move
  clearClickHandlers();
  slide.clearPhoto();

  if ($.support.cssTransition) {
    // setup the transition end handler
    slide.one($.support.cssTransitionEnd, function() {
      moveSlideToTheRightEnd(slide);
      finished();
    });

    // start the animation
    slide.addClass("hidden");

  } else {
    // no transitions so just hide and move
    slide.addClass("hidden");
    moveSlideToTheRightEnd(slide);
    finished();
  }
}

function moveSlideToTheRightEnd(slide) {
  // detach the slide and stick it on the end of the list
  slide.detach();
  $("#photoslider").append(slide);

  // unhide it without animation
  slide.addClass("noanimation").removeClass("hidden").removeClass("noanimation");

  // register the click handlers on the new left and right slides
  setClickHandlers();

  // load the new img for this slide
  slide.showPhoto(slide.data("photo-index")+5);
}

function slideRight(finished) {
  var slide = $(".slide:last");

  // check we can slide right
  if ($(".slide:first").data("photo-index") < -1) {
    finished();
    return;
  }

  // prevent any clicks while sliding and clear the
  // photo on the slide we're about to move
  clearClickHandlers();
  slide.clearPhoto();

  moveSlideToTheLeftEnd(slide, finished);
}

function moveSlideToTheLeftEnd(slide, finished) {
  // hide the slide (i.e. width:0) without animation
  slide.addClass("noanimation").addClass("hidden").removeClass("noanimation");

  // detach the slide and stick it at the front of the list
  slide.detach();
  $("#photoslider").prepend(slide);

  if ($.support.cssTransition) {
    // setup the transition end handler
    slide.one($.support.cssTransitionEnd, function() {
      // register the click handlers on the new left and right slides
      setClickHandlers();

      // load the new img for this slide
      slide.showPhoto(slide.data("photo-index")-5);
      finished();
    });

    // start the animation (timeout works around issue in chrome)
    setTimeout(function() { slide.removeClass("hidden"); }, 10);

  } else {
    // no transitions so just unhide and setup the slide
    slide.removeClass("hidden");
    setClickHandlers();
    slide.showPhoto(slide.data("photo-index")-5);
    finished();
  }
}