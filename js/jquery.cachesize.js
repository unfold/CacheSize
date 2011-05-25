(function($) {
	$.fn.cachesize = function(options) {
		var containers = [];
		var settings = {};
		var supportsCanvas = (function() {
			var elem = document.createElement('canvas');
			return !!(elem.getContext && elem.getContext('2d'));
		})();

		$.extend(settings, options);
		
		var calculateRect = function(image) {
			var width = window.innerWidth;
			var height = window.innerHeight;
			var aspectRatio = image.width / image.height;
			var lockVert = (width / aspectRatio) >= height;
			
			var rect = {};
			rect.width = lockVert ? width : height * aspectRatio;
			rect.height = lockVert ? width / aspectRatio : height;
			rect.left = lockVert ? 0 : Math.round((width - rect.width) / 2)
			rect.top = lockVert ? Math.round((height - rect.height) / 2) : 0;

			return rect;
		}

		var updateCanvas = function(canvas, original) {
			var rect = calculateRect(original);
			canvas.width = rect.width;
			canvas.height = rect.height;
			
			var context = canvas.getContext('2d');
			context.drawImage(original, rect.left, rect.top, Math.ceil(rect.width), Math.ceil(rect.height));
		}
		
		var updateImage = function(image) {
			var rect = calculateRect(image);
			image.css(rect);
		}
		
		$(window).resize(function() {
			for (var i in containers) {
				var container = $(containers[i]);
				
				if (supportsCanvas) {
					var canvas = container.data('canvas');
					var original = container.data('original');
					
					if (original) {
						updateCanvas(canvas, original);
					}
				} else {
					updateImage(image);
				}
			}
		});

		$(this).each(function() {
			var image = $(this);
			var container = $('<div />');
			
			if (supportsCanvas) {
				var canvas = $('<canvas />').appendTo(container).get(0);
				var original = new Image();
				
				container.data('canvas', canvas);

				original.onload = function() {
					container.data('original', original);
					
					updateCanvas(canvas, original);
				}
				
				original.src = image.attr('src');
				
				image.replaceWith(container);
			} else {
				container.data('original', image);
				
				image.wrap(container);
			}
			
			containers.push(container.get(0));
		});
		
		return $(containers);
	};
})(jQuery);