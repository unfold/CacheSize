(function($) {
	$.fn.cachesize = function(options) {
		var images = $(this);

		var settings = {
			loaded: null
		};
		$.extend(settings, options);

		var redrawCanvas = function(canvas, image) {
			var aspectRatio = image.width / image.height;
			var lockVert = (canvas.width / aspectRatio) >= canvas.height;

			image.width = lockVert ? canvas.width : canvas.height * aspectRatio;
			image.height = lockVert ? canvas.width / aspectRatio : canvas.height;
			image.x = (lockVert ? 0 : Math.round((canvas.width - image.width) / 2));
			image.y = (lockVert ? Math.round((canvas.height - image.height) / 2) : 0);
			
			var context = canvas.getContext('2d');
			context.drawImage(image, image.x, image.y, Math.ceil(image.width), Math.ceil(image.height));
		}

		var updateImage = function(image) {
			var canvas = image.data('canvas');

			if (!canvas) {
				canvas = $('<canvas />').get(0);

				image.data('canvas', canvas);
				image.after(canvas);
				image.hide();
			}
			
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			
			redrawCanvas(canvas, image.data('original'));
		}

		$(window).resize($.throttle(200, function() {
			images.each(function(i) {
				var image = $(this);
				if(image.data('loaded')) {
					updateImage(image);
				}
			});
		}));

		images.each(function() {
			var image = $(this);
			var original = new Image();

			original.onload = function() {
				image.data('loaded', true);
				updateImage(image);
			}

			original.src = $(this).attr('src');
			$(this).data('original', original);
		});

		return images;
	};
})(jQuery);