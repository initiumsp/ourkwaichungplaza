define(["jquery", "jquery.mCustomScrollbar.min", "jquery.mousewheel.min", "jquery.colorbox-min","draggableimg", "scrollreveal", "slick.min" ,"jquery.scrollTo.min"], function($) {
  $(function(){
      var mode = 'd', offset = 100, win = {w: 0, h: 0}, can, hdc, img_scale=1, $curfloor, curfloor =0;

      $(document).ready(function() {


        function showVideo(){
          $('#videoOverlay, #videoLb').fadeIn(400, function(){
            //if(player) player.play();
          });
        }
        function hideVideo(){
          $('#videoOverlay, #videoLb').fadeOut(400, function(){
            //if(player) player.pause();
          });
        }
        function lbox_init() {
          // alert('yo');
          if (mode == 'd') {
             $(".ajax-lbox").colorbox({width:"100%", height:"80%", maxWidth: 800, onComplete: lbox_onload});
            //$(".ajax-lbox").colorbox({width:"600px", maxheight:"80%" });
          } else {
            // $(".ajax-lbox").colorbox({width:"90%", maxheight:"80%", maxWidth: 345, onComplete: lbox_onload});
            $(".ajax-lbox").colorbox({width:"100%", height:"100%", fixed: true, onComplete: lbox_onload });
          }

        }
        function lbox_onload(){
          // alert('loaded');
          $('#cboxLoadedContent meta').remove();
          $('#cboxLoadedContent script').remove();

          $('#cboxLoadedContent').mCustomScrollbar();

          ga('send', 'pageview', $(this).attr('href'));
        }
        function relayout(){
            $('#spacer').css('paddingTop', win.h - $('#section1').height());
        }

        function drawPoly(coOrdStr, adjust)
        {
            var mCoords = coOrdStr.split(',');
            var i, n, m1 = 0, m2 = 0;
            n = mCoords.length;
            hdc.beginPath();
            hdc.moveTo(mCoords[0], mCoords[1]);
            m1 = parseFloat(mCoords[0]);
            m2 = parseFloat(mCoords[1]);
            for (i=2; i<n; i+=2)
            {
                hdc.lineTo(mCoords[i], mCoords[i+1]);
                m1 += parseFloat(mCoords[i]);
                m2 += parseFloat(mCoords[i+1]);
            }
            hdc.lineTo(mCoords[0], mCoords[1]);
            hdc.stroke();
            hdc.fill();
            if(adjust) $curfloor.find('.dbg-container').stop(1, 1).animate({'left': win.w / 2 - m1/(n/2)+'px', 'top': win.h / 2 - m2/(n/2)+'px'}, 600);
        }
        var kc = {
          top: 0,
          loaded: function(){
            $(window).trigger('resize');
            if(window.location.hash) {

              var hash = window.location.hash;

            }
            else{
              $(window).scrollTop(0);
              setTimeout(function(){
                $(window).scrollTop(0);
              },100);
            }
            relayout();
            $('body').addClass('loaded');
            $curfloor = $('#current_floor');
            kc.showMall();
            $(document).bind('cbox_open', function () {
              // kc.top = $('body').scrollTop();
              // alert(kc.top);
              $('html').addClass('noscroll');
          }).bind('cbox_closed', function () {
              $('html').removeClass('noscroll');
              //$('body').scrollTo(kc.top, 0);
          }); 
          },
          scrollTo: function(top){
            if(mode == 'd'){
              $('#main-container').mCustomScrollbar("scrollTo",function(){
                return top;
              });
            }
            else{
              $(window).scrollTo(top, 400);
            }
          },
          triggerMenu: function(){
            $('body').toggleClass('showmenu');
            if($('body').hasClass('showmenu')){
              $('#m_menu').fadeIn(200);
            }
            else{
              $('#m_menu').fadeOut(200);
            }
          },
          showMall: function () {
            $('body').addClass('showmall');
            $('#mallOverlay').fadeIn(400, function(){kc.goToFloor(0);});
            // ga('send', 'pageview', '/mall-g');
            // $('#mallContent .layers').slick({
            //   vertical: true,
            //   verticalSwiping: true,
            //   slidesToShow: 3,
            //   slidesToScroll: 1,
            //   centerMode: true,
            //   prevArrow: '<a href="#" class="slick-prev"><span class="sp sp-lv-up"></span></a>',
            //   nextArrow: '<a href="#" class="slick-next"><span class="sp sp-lv-down"></span></a>'
            // });

          },
          hideMall: function () {
              $('body').removeClass('showmall');
            $('#mallOverlay').fadeOut();
          },
          fpinit: function (){
            // get the target image
            var img = document.getElementById('floorplan');
            if($(img).hasClass('initialized')) return;
            var x,y, w,h;
            var imgParent = img.parentNode;

            // get it's position and width+height
            x = img.offsetLeft;
            y = img.offsetTop;
            w = img.clientWidth;
            h = img.clientHeight;
            can = document.createElement('canvas');
            can.id = "canvas";
            imgParent.appendChild(can);
            can.style.zIndex = 1;
            can.style.left = x+'px';
            can.style.top = y+'px';
            can.setAttribute('width', w+'px');
            can.setAttribute('height', h+'px');
            img_scale = parseFloat(w/$(img).data('width'));
            hdc = can.getContext('2d');

            // set the 'default' values for the colour/width of fill/stroke operations
            hdc.strokeStyle = '#6ebde5';
            hdc.fillStyle = "rgba(110, 189, 229, 0.7)";
            hdc.lineWidth = 2;
            if(img_scale < 1){
              $('#current_floor .area').each(function(){
                var coordStr =  $(this).attr('coords');
                var mCoords = coordStr.split(',');
                var n = mCoords.length;
                var v = '';
                for (i=0; i<n; i+=2)
                {
                    v += (mCoords[i]*img_scale) + ', '+(mCoords[i+1]*img_scale+',');
                }
                v = v.substr(0, v.length-1);
                $(this).attr('coords', v);
              });
              img_scale = 1;
            }
            if(mode != 'm'){
              $('#current_floor .area').hover(function(e){kc.highlight($(e.target), 0);},kc.resetHighlight);
              $('#current_floor .bot a, #current_floor .tips a').hover(function(e){kc.highlight($curfloor.find('area.'+$(this).data('ref')), 1);},kc.resetHighlight);
            }
            else{
            $('#current_floor .area').on('mousedown touchstart', function(e) {
              e.stopPropagation();
              kc.highlight($(e.target), 0);}).on('mouseup touchend mouseleave', function(e) {e.stopPropagation();kc.resetHighlight();});
            $('#current_floor .bot a').bind('click', function(e) {
              e.preventDefault();
              kc.resetHighlight();
              kc.highlight($curfloor.find('area.'+$(this).data('ref')), 1);
              });

            }
            $(img).addClass('initialized');
        },
        highlight: function(el, bool){ //highlight store
          var str = el.attr('coords');
          drawPoly(str, bool);
          $curfloor.find('.tips .'+el.data('ref')).addClass('on');
        }
        ,resetHighlight: function(){
          hdc.clearRect(0, 0, can.width, can.height);
          $curfloor.find('.tips .on').removeClass('on');
        }
        ,goToFloor: function(f){
            var t = 0;
            curfloor = parseInt(f);
            if($('#current_floor').hasClass('active')){
              $('#current_floor').removeClass('active');
              t = 800;
            }
            setTimeout(function(){

              $('#current_floor').html($('#f'+f).html());
              setTimeout(function(){
                $('#current_floor').addClass('active');
                kc.fpinit();
                $('#current_floor').imgDraggable();

                $('#mallContent .bot').slick({
                  slidesToShow: ((mode == 'm')? 3 : 4),
                  slidesToScroll: 3,
                  centerMode: false,
                  prevArrow: '<a href="#" class="slick-prev"><span class="sp sp-arrow-prev"></span></a>',
                  nextArrow: '<a href="#" class="slick-next"><span class="sp sp-arrow-next"></span></a>'
                });
                lbox_init();
              }, 100);
            }, t);
            $('#cur_floor').text(((f == '0')? 'G' : f) + '/F');
            ga('send', 'pageview', '/mall-'+((f == '0')? 'g' : f));
            $('#choose_floor .f'+f).addClass('on').siblings('.on').removeClass('on');
            if(f >= 3){
              $('#levelup').addClass('dim');
            }
            else if(f <=0){
              $('#leveldown').addClass('dim');
            }
            else{
              $('.ctr').removeClass('dim');
            }
          }
        };
        $(window).resize(function(e){
          //$.colorbox.resize();
        });


        $("#menu-btn, #menu_close").bind("click", function(e){
          e.preventDefault();
          kc.triggerMenu();
        });
        $(".mall_close").bind("click", function(e){
          e.preventDefault();
          kc.hideMall();
        });
        $(".mall-btn").bind("click", function(e){
          e.preventDefault();
          kc.showMall();
        });
         $("body").delegate(".floor-link", "click", function(e){
          e.preventDefault();
          if(!$(this).hasClass('on'))
          kc.goToFloor($(this).data('floor'));
         });
        $("#levelup").bind("click", function(e){
          e.preventDefault();
          if($(this).hasClass('dim')) return;
          var f = Math.max(curfloor+1, 0);
          kc.goToFloor(f);
        });
        $("#leveldown").bind("click", function(e){
          e.preventDefault();
          if($(this).hasClass('dim')) return;
          var f = Math.min(curfloor-1, 3);

          kc.goToFloor(f);
        });

        $(".video-link").bind("click", function(e){
          e.preventDefault();
          showVideo();
        });
        $('#videoOverlay').bind("click", function(e){
          e.preventDefault();
          hideVideo();
        });
        // Append span of close button background image
        $(".scroll-link").bind("click", function(e){
          e.preventDefault();
          var href= $(this).attr('href');
          console.log($(href).position().top-offset);
          kc.scrollTo($(href).position().top-offset);

        });
        $(".ajax-lbox").bind("click", function(e){
            if ( $("body").find("#colorbox").length > 0 ) {
              $("#cboxClose").append("<span class=\"sp-l sp-mall-close\"></span>");
            }
        });


        $(window).resize(function(){
          var w = $(window).width();
          win.h = $(window).height();
          win.w = w;
          if(w >=1024){
            mode = 'd';
            offset = 100;
          }
          else if(w >=768){
            mode = 't';
            offset = 60;
          }
          else{
            mode = 'm';
            offset = 60;
          }
          relayout();
        }).load(function(){
          kc.loaded();
          if(window.location.hash) {
            // Fragment exists
            var hash = window.location.hash;
            $('a.ajax-lbox[href="'+hash.substr(1)+'.html"]').first().click();
            history.pushState(null,null,'#');
          }
        });
        kc.loaded();

        if(mode !='m'){
          window.sr = ScrollReveal();
          if (sr.isSupported() ) {
            $('body').addClass('sr');
            sr.reveal('.anim', {mobile: false, viewFactor:  0.5, useDelay: 'onload', delay: '50'});
            $('body').bind('scrolling', function(e, t){

                var p = Math.abs(t/ (win.h - offset));
              if(Math.abs(t) <= win.h){
                $('#header').css('opacity', 1-p);
              }
              if(Math.abs(t) <= win.h * 1.2){

                $('#section1').css({
                  '-webkit-transform' : 'scale(' + Math.min(1.2, (0.2*p*1.8 + 1)) + ')',
                  '-moz-transform'    : 'scale(' + Math.min(1.2, (0.2*p*1.8 + 1)) + ')',
                  '-ms-transform'     : 'scale(' + Math.min(1.2, (0.2*p*1.8 + 1)) + ')',
                  '-o-transform'      : 'scale(' + Math.min(1.2, (0.2*p*1.8 + 1)) + ')',
                  'transform'         : 'scale(' + Math.min(1.2, (0.2*p*1.8 + 1)) + ')'
                });
                $('#section1 .scroll-link').css('opacity', Math.max(0, 1-p*1.4));
              }
            });
          }
        }
        else{
          $(window).bind('scroll', function(){
            var t = document.body.scrollTop;
            if(t >= win.h){
              if(!$('body').hasClass('sticky'))
                $('body').addClass('sticky');
            }
            else{
              if($('body').hasClass('sticky'))
                $('body').removeClass('sticky');
            }
          });
        }
      });
  });
});
