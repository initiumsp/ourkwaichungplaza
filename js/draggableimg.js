;(function($) {
  var $window = $(window);

  // Helper function to guarantee a value between low and hi unless bool is false
  var limit = function(low, hi, value, bool) {
    if (arguments.length === 3 || bool) {
      if (value < low) return low;
      if (value > hi) return hi;
    }
    return value;
  };

  // Adds clientX and clientY properties to the jQuery's event object from touch
  var modifyEventForTouch = function(e) {
    e.clientX = e.originalEvent.touches[0].clientX;
    e.clientY = e.originalEvent.touches[0].clientY;
  };

  var getBackgroundImageDimensions = function($el) {
    var bgSrc = $el.find('img.dbg:eq(0)').attr('src');
    if (!bgSrc) return;

    var imageDimensions = { width: 0, height: 0 };

    imageDimensions.width = $el.find('img').width() + 50;
    imageDimensions.height = $el.find('img').height() + 50;
    return imageDimensions;
  };

  function Plugin(element, options) {
    this.element = element;
    this.options = options;
    this.init();
  }

  Plugin.prototype.init = function() {
    var $el = $(this.element),
        $tar = $el.find('.dbg-container'),
        $img = $el.find('.dbg'),
        options = this.options;

    // Get the image's width and height if bound
    var imageDimensions = { width: 0, height: 0 };
    if (options.bound) {
      imageDimensions = getBackgroundImageDimensions($el);
    }
    $tar.on('mousedown.dbg touchstart.dbg', function(e) {

      if (e.target !== $img[0]) {
        return;
      }
      e.preventDefault();

      if (e.originalEvent.touches) {
        modifyEventForTouch(e);
      } else if (e.which !== 1) {
        return;
      }

      var x0 = e.clientX,
          y0 = e.clientY,
          pos = $tar.position() || {},
          xPos = parseInt(pos.left) || 0,
          yPos = parseInt(pos.top) || 0;

      $window.on('mousemove.dbg touchmove.dbg', function(e) {
        e.preventDefault();

        if (e.originalEvent.touches) {
          modifyEventForTouch(e);
        }

        var x = e.clientX,
            y = e.clientY;
  
        xPos = options.axis === 'y' ? xPos : limit($el.innerWidth()-imageDimensions.width, 50, xPos+x-x0, options.bound);
        yPos = options.axis === 'x' ? yPos : limit($el.innerHeight()-imageDimensions.height, 50, yPos+y-y0, options.bound);
         if($el.innerWidth() > imageDimensions.width){
           xPos = 50;
         }
         if($el.innerHeight() > imageDimensions.height){
           yPos = 50;
         }
      
        x0 = x;
        y0 = y;
        $tar.css({top: yPos+ 'px ', left: xPos+ 'px '});

      });

      $window.on('mouseup.dbg touchend.dbg mouseleave.dbg', function() {
        if (options.done) {
          options.done();
        }

        $window.off('mousemove.dbg touchmove.dbg');
        $window.off('mouseup.dbg touchend.dbg mouseleave.dbg');
      });
    });
  };

  Plugin.prototype.disable = function() {
    var $el = $(this.element);
    $el.off('mousedown.dbg touchstart.dbg');
    $window.off('mousemove.dbg touchmove.dbg mouseup.dbg touchend.dbg mouseleave.dbg');
  }

  $.fn.imgDraggable = function(options) {
    var options = options;
    var args = Array.prototype.slice.call(arguments, 1);

    return this.each(function() {
      var $this = $(this);

      if (typeof options == 'undefined' || typeof options == 'object') {
        options = $.extend({}, $.fn.imgDraggable.defaults, options);
        var plugin = new Plugin(this, options);
        $this.data('dbg', plugin);
      } else if (typeof options == 'string' && $this.data('dbg')) {
        var plugin = $this.data('dbg');
        Plugin.prototype[options].apply(plugin, args);
      }
    });
  };

  $.fn.imgDraggable.defaults = {
    bound: true,
    axis: undefined
  };
}(jQuery));