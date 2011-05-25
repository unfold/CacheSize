(function($) {
	$.fn.cachesize = function(options) {
		var canvases = [];
		var settings = {};

		$.extend(settings, options);

		var redraw = function(canvas, image) {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;

			var aspectRatio = image.width / image.height;
			var lockVert = (canvas.width / aspectRatio) >= canvas.height;
			var width = lockVert ? canvas.width : canvas.height * aspectRatio;
			var height = lockVert ? canvas.width / aspectRatio : canvas.height;
			var x = (lockVert ? 0 : Math.round((canvas.width - width) / 2));
			var y = (lockVert ? Math.round((canvas.height - height) / 2) : 0);
			
			var context = canvas.getContext('2d');
			context.drawImage(image, x, y, Math.ceil(width), Math.ceil(height));
		}
		

		$(window).resize(function() {
			for (var i in canvases) {
				var canvas = canvases[i];
				var original = canvas.data('original');

				if (original) {
					redraw(canvas.get(0), original);
				}
			}
		});

		$(this).each(function() {
			var image = $(this);
			var canvas = $('<canvas />');
			var original = new Image();

			original.onload = function() {
				canvas.data('original', original);
				redraw(canvas.get(0), original);
			}

			original.src = image.attr('src');
			image.replaceWith(canvas);
			
			canvases.push(canvas);
		});
		
		return $(canvases);
	};
})(jQuery);