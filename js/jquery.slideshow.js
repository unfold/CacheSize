(function($) {
	$.fn.slideshow = function() {
		var images = $(this);
		var zIndex = 0;
		var currentImage = 0;
		
		var changeImage = function(i) {
			images.eq(i).hide().css('zIndex', ++zIndex).fadeIn(1000);
			currentImage = i;
		}
		
		var nextImage = function() {
			var i = currentImage < images.length -1 ? ++currentImage : 0;
			changeImage(i);
		}
		
		var interval = setInterval(nextImage, 2000);
		changeImage(0);
		return $(this);
	}
})(jQuery);