(function($) {
	$.fn.cachesize = function(options) {
		var images = $(this);

		var canvas = $('<canvas/>').get(0);
		var context = canvas.getContext('2d');

		var settings = {
			loaded: null
		};
		$.extend(settings, options);

		var updateCanvasSize = function() {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};

		var getDataURL = function(image, width, height) {
			var target = { width: image.width, height: image.height };

			var aspectRatio = target.width / target.height;
			var lockVert = (width / aspectRatio) >= height;

			target.width = lockVert ? width : height * aspectRatio;
			target.height = lockVert ? width / aspectRatio : height;
			target.x = (lockVert ? 0 : Math.round((width - target.width) / 2));
			target.y = (lockVert ? Math.round((height - target.height) / 2) : 0);

			context.drawImage(image, target.x, target.y, Math.ceil(target.width), Math.ceil(target.height));
			return canvas.toDataURL("image/jpeg");
		};

		var updateImage = function(image) {
			image.attr('src', getDataURL(image.data('original'), canvas.width, canvas.height));
		}

		$(window).resize($.throttle(200, function() {
			updateCanvasSize();
			images.each(function(i) {
				var image = $(this);
				if(image.data('loaded')) {
					updateImage(image);
				}
			});
		}));

		updateCanvasSize();

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