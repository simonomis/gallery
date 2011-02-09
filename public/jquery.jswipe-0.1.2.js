/*
 * jSwipe - jQuery Plugin
 * http://plugins.jquery.com/project/swipe
 * http://www.ryanscherf.com/demos/swipe/
 *
 * Copyright (c) 2009 Ryan Scherf (www.ryanscherf.com)
 * Licensed under the MIT license
 *
 * $Date: 2009-07-14 (Tue, 14 Jul 2009) $
 * $version: 0.1.2
 * 
 * This jQuery plugin will only run on devices running Mobile Safari
 * on iPhone or iPod Touch devices running iPhone OS 2.0 or later. 
 * http://developer.apple.com/iphone/library/documentation/AppleApplications/Reference/SafariWebContent/HandlingEvents/HandlingEvents.html#//apple_ref/doc/uid/TP40006511-SW5
 */
(function($) {
	$.fn.swipe = function(options) {
		
		// Default thresholds & swipe functions
		var defaults = {
			threshold: {
				x: 20,
				y: 30
			},
			swipeLeft: function() { alert('swiped left') },
			swipeRight: function() { alert('swiped right') }
		};
		
		var options = $.extend(defaults, options);
		
		if (!this) return false;
		
		return this.each(function() {
			
			var me = $(this)
			
			// Private variables for each element
			var originalCoord = { x: 0, y: 0 }
			var finalCoord = { x: 0, y: 0 }
			
			// Screen touched, store the original coordinate
			function touchStart(event) {
				var e = event.originalEvent;
				//console.log('Starting swipe gesture...')
				originalCoord.x = e.targetTouches[0].pageX
				originalCoord.y = e.targetTouches[0].pageY
				
				finalCoord.x = originalCoord.x
				finalCoord.y = originalCoord.y
			}
			
			// Store coordinates as finger is swiping
			function touchMove(event) {
			    event.preventDefault();
				var e = event.originalEvent;
				finalCoord.x = e.targetTouches[0].pageX // Updated X,Y coordinates
				finalCoord.y = e.targetTouches[0].pageY
			}
			
			// Done Swiping
			// Swipe should only be on X axis, ignore if swipe on Y axis
			// Calculate if the swipe was left or right
			function touchEnd(event) {
				//console.log('Ending swipe gesture...')
				var changeY = originalCoord.y - finalCoord.y,
					changeX = originalCoord.x - finalCoord.x;
					
				if (Math.abs(changeY) < Math.abs(changeX)) {
					
					if(changeX > defaults.threshold.x) {
						options.swipeLeft()
					}
					if(changeX < (defaults.threshold.x*-1)) {
						options.swipeRight()
					}
				}
			}
			
			// Swipe was canceled
			function touchCancel(event) { 
				//console.log('Canceling swipe gesture...')
			}
			
			// Add gestures to all swipable areas
			me.bind("touchstart", touchStart);
			me.bind("touchmove", touchMove);
			me.bind("touchend", touchEnd);
			me.bind("touchcancel", touchCancel);
				
		});
	};
})(jQuery);