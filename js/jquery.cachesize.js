(function($) {
	$.fn.cachesize = function(options) {
		var containers = [];
		var supportsCanvas = (function() {
			var elem = document.createElement('canvas');
			return !!(elem.getContext && elem.getContext('2d'));
		})();
		
		var settings = {
			getSize: function() {
				return {
					width: window.innerWidth, 
					height: window.innerHeight
				};
			}
		};

		$.extend(settings, options);
		
		var calculateRect = function(image, size) {
			var aspectRatio = image.width / image.height;
			var lockVert = (size.width / aspectRatio) >= size.height;
			
			var rect = {};
			rect.width = lockVert ? size.width : size.height * aspectRatio;
			rect.height = lockVert ? size.width / aspectRatio : size.height;
			rect.left = lockVert ? 0 : Math.round((size.width - rect.width) / 2);
			rect.top = lockVert ? Math.round((size.height - rect.height) / 2) : 0;

			return rect;
		}

		var updateCanvas = function(canvas, original) {
			var size = settings.getSize();
			var rect = calculateRect(original, size);
			canvas.width = size.width;
			canvas.height = size.height;
			
			var context = canvas.getContext('2d');
			context.drawImage(original, rect.left, rect.top, Math.ceil(rect.width), Math.ceil(rect.height));
		}
		
		var updateImage = function(container) {
			var image = container.data('image');
			var size = settings.getSize();
			var rect = calculateRect(image.get(0), size);

			image.css(rect);
			container.css({width: size.width, height: size.height});
		}
		
		$(window).resize(function() {
			for (var i in containers) {
				var container = $(containers[i]);
				
				if (supportsCanvas) {
					var original = container.data('original');

					if (original) {
						var canvas = container.data('canvas');
						updateCanvas(canvas, original);
					}
				} else {
					var image = container.data('image');
					updateImage(container);
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
				container.css('overflow', 'hidden');
				container.data('image', image);
				
				updateImage(container);
				
				container.insertAfter(image).wrapInner(image);
			}
			
			containers.push(container.get(0));
		});
		
		return $(containers);
	};
})(jQuery);