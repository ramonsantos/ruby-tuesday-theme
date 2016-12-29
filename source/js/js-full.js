var Layout = function() {

  // IE mode
  var isRTL = false;
  var isIE8 = false;
  var isIE9 = false;
  var isIE10 = false;
  var isIE11 = false;

  var responsive = true;

  var responsiveHandlers = [];

  var handleInit = function() {

    if ($('body').css('direction') === 'rtl') {
      isRTL = true;
    }

    isIE8 = !!navigator.userAgent.match(/MSIE 8.0/);
    isIE9 = !!navigator.userAgent.match(/MSIE 9.0/);
    isIE10 = !!navigator.userAgent.match(/MSIE 10.0/);
    isIE11 = !!navigator.userAgent.match(/MSIE 11.0/);

    if (isIE10) {
      jQuery('html').addClass('ie10'); // detect IE10 version
    }
    if (isIE11) {
      jQuery('html').addClass('ie11'); // detect IE11 version
    }
  }

  // runs callback functions set by App.addResponsiveHandler().
  var runResponsiveHandlers = function() {
    // reinitialize other subscribed elements
    for (var i in responsiveHandlers) {
      var each = responsiveHandlers[i];
      each.call();
    }
  }

  // handle the layout reinitialization on window resize
  var handleResponsiveOnResize = function() {
    var resize;
    if (isIE8) {
      var currheight;
      $(window).resize(function() {
        if (currheight == document.documentElement.clientHeight) {
          return; //quite event since only body resized not window.
        }
        if (resize) {
          clearTimeout(resize);
        }
        resize = setTimeout(function() {
          runResponsiveHandlers();
        }, 50); // wait 50ms until window resize finishes.
        currheight = document.documentElement.clientHeight; // store last body client height
      });
    } else {
      $(window).resize(function() {
        if (resize) {
          clearTimeout(resize);
        }
        resize = setTimeout(function() {
          runResponsiveHandlers();
        }, 50); // wait 50ms until window resize finishes.
      });
    }
  }

  var handleIEFixes = function() {
    //fix html5 placeholder attribute for ie7 & ie8
    if (isIE8 || isIE9) { // ie8 & ie9
      // this is html5 placeholder fix for inputs, inputs with placeholder-no-fix class will be skipped(e.g: we need this for password fields)
      jQuery('input[placeholder]:not(.placeholder-no-fix), textarea[placeholder]:not(.placeholder-no-fix)').each(function() {

        var input = jQuery(this);

        if (input.val() == '' && input.attr("placeholder") != '') {
          input.addClass("placeholder").val(input.attr('placeholder'));
        }

        input.focus(function() {
          if (input.val() == input.attr('placeholder')) {
            input.val('');
          }
        });

        input.blur(function() {
          if (input.val() == '' || input.val() == input.attr('placeholder')) {
            input.val(input.attr('placeholder'));
          }
        });
      });
    }
  }

  // Handles scrollable contents using jQuery SlimScroll plugin.
  var handleScrollers = function() {
    $('.scroller').each(function() {
      var height;
      if ($(this).attr("data-height")) {
        height = $(this).attr("data-height");
      } else {
        height = $(this).css('height');
      }
      $(this).slimScroll({
        allowPageScroll: true, // allow page scroll when the element scroll is ended
        size: '7px',
        color: ($(this).attr("data-handle-color") ? $(this).attr("data-handle-color") : '#bbb'),
        railColor: ($(this).attr("data-rail-color") ? $(this).attr("data-rail-color") : '#eaeaea'),
        position: isRTL ? 'left' : 'right',
        height: height,
        alwaysVisible: ($(this).attr("data-always-visible") == "1" ? true : false),
        railVisible: ($(this).attr("data-rail-visible") == "1" ? true : false),
        disableFadeOut: true
      });
    });
  }

  var handleSearch = function() {
    $('.search-btn').click(function() {
      if ($('.search-btn').hasClass('show-search-icon')) {
        if ($(window).width() > 767) {
          $('.search-box').fadeOut(300);
        } else {
          $('.search-box').fadeOut(0);
        }
        $('.search-btn').removeClass('show-search-icon');
      } else {
        if ($(window).width() > 767) {
          $('.search-box').fadeIn(300);
        } else {
          $('.search-box').fadeIn(0);
        }
        $('.search-btn').addClass('show-search-icon');
      }
    });

    // close search box on body click
    if ($('.search-btn').size() != 0) {
      $('.search-box, .search-btn').on('click', function(e) {
        e.stopPropagation();
      });

      $('body').on('click', function() {
        if ($('.search-btn').hasClass('show-search-icon')) {
          $('.search-btn').removeClass("show-search-icon");
          $('.search-box').fadeOut(300);
        }
      });
    }
  }

  var handleMenu = function() {
    $(".header .navbar-toggle").click(function() {
      if ($(".header .navbar-collapse").hasClass("open")) {
        $(".header .navbar-collapse").slideDown(300)
          .removeClass("open");
      } else {
        $(".header .navbar-collapse").slideDown(300)
          .addClass("open");
      }
    });
  }
  var handleSubMenuExt = function() {
    $(".header-navigation .dropdown").on("hover", function() {
      if ($(this).children(".header-navigation-content-ext").show()) {
        if ($(".header-navigation-content-ext").height() >= $(".header-navigation-description").height()) {
          $(".header-navigation-description").css("height", $(".header-navigation-content-ext").height() + 22);
        }
      }
    });
  }

  var handleSidebarMenu = function() {
    $(".sidebar .dropdown > a").click(function(event) {
      if ($(this).next().hasClass('dropdown-menu')) {
        event.preventDefault();
        if ($(this).hasClass("collapsed") == false) {
          $(this).addClass("collapsed");
          $(this).siblings(".dropdown-menu").slideDown(300);
        } else {
          $(this).removeClass("collapsed");
          $(this).siblings(".dropdown-menu").slideUp(300);
        }
      }
    });
  }

  function handleDifInits() {
    $(".header .navbar-toggle span:nth-child(2)").addClass("short-icon-bar");
    $(".header .navbar-toggle span:nth-child(4)").addClass("short-icon-bar");
  }

  function handleUniform() {
    if (!jQuery().uniform) {
      return;
    }
    var test = $("input[type=checkbox]:not(.toggle), input[type=radio]:not(.toggle, .star)");
    if (test.size() > 0) {
      test.each(function() {
        if ($(this).parents(".checker").size() == 0) {
          $(this).show();
          $(this).uniform();
        }
      });
    }
  }

  var handleFancybox = function() {
    if (!jQuery.fancybox) {
      return;
    }

    jQuery(".fancybox-fast-view").fancybox();

    if (jQuery(".fancybox-button").size() > 0) {
      jQuery(".fancybox-button").fancybox({
        groupAttr: 'data-rel',
        prevEffect: 'none',
        nextEffect: 'none',
        closeBtn: true,
        helpers: {
          title: {
            type: 'inside'
          }
        },
        beforeLoad: function() {
          var el, id = $(this.element).data('title-id');

          if (id) {
            el = $('#' + id);
            if (el.length) {
              this.title = el.html();
            }
          }
        }
      });

      $('.fancybox-video').fancybox({
        type: 'iframe'
      });
    }
  }

  // Handles Bootstrap Accordions.
  var handleAccordions = function() {

    jQuery('body').on('shown.bs.collapse', '.accordion.scrollable', function(e) {
      Layout.scrollTo($(e.target), -100);
    });

  }

  // Handles Bootstrap Tabs.
  var handleTabs = function() {
    // fix content height on tab click
    $('body').on('shown.bs.tab', '.nav.nav-tabs', function() {
      handleSidebarAndContentHeight();
    });

    //activate tab if tab id provided in the URL
    if (location.hash) {
      var tabid = location.hash.substr(1);
      $('a[href="#' + tabid + '"]').click();
    }
  }

  var handleMobiToggler = function() {
    $(".mobi-toggler").on("click", function(event) {
      event.preventDefault(); //the default action of the event will not be triggered

      $(".header").toggleClass("menuOpened");
      $(".header").find(".header-navigation").toggle(300);
    });
  }

  var handleTheme = function() {

    var panel = $('.color-panel');

    // handle theme colors
    var setColor = function(color) {
      $('#style-color').attr("href", "assets/corporate/css/themes/" + color + ".css");
      $('.corporate .site-logo img').attr("src", "assets/corporate/img/logos/logo-corp-" + color + ".png");
    }

    $('.icon-color', panel).click(function() {
      $('.color-mode').show();
      $('.icon-color-close').show();
    });

    $('.icon-color-close', panel).click(function() {
      $('.color-mode').hide();
      $('.icon-color-close').hide();
    });

    $('li', panel).click(function() {
      var color = $(this).attr("data-style");
      setColor(color);
      $('.inline li', panel).removeClass("current");
      $(this).addClass("current");
    });
  }

  return {
    init: function() {
      // init core variables
      handleTheme();
      handleInit();
      handleResponsiveOnResize();
      handleIEFixes();
      handleSearch();
      handleFancybox();
      handleDifInits();
      handleSidebarMenu();
      handleAccordions();
      handleMenu();
      handleScrollers();
      handleSubMenuExt();
      handleMobiToggler();
    },

    initUniform: function(els) {
      if (els) {
        jQuery(els).each(function() {
          if ($(this).parents(".checker").size() == 0) {
            $(this).show();
            $(this).uniform();
          }
        });
      } else {
        handleUniform();
      }
    },

    initTwitter: function() {
      ! function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0],
          p = /^http:/.test(d.location) ? 'http' : 'https';
        if (!d.getElementById(id)) {
          js = d.createElement(s);
          js.id = id;
          js.src = p + "://platform.twitter.com/widgets.js";
          fjs.parentNode.insertBefore(js, fjs);
        }
      }(document, "script", "twitter-wjs");
    },

    initTouchspin: function() {

      $(".quantity-down").html("<i class='fa fa-angle-down'></i>");
      $(".quantity-up").html("<i class='fa fa-angle-up'></i>");
    },

    initFixHeaderWithPreHeader: function() {
      jQuery(window).scroll(function() {
        if (jQuery(window).scrollTop() > 37) {
          jQuery("body").addClass("page-header-fixed");
        } else {
          jQuery("body").removeClass("page-header-fixed");
        }
      });
    },

    initNavScrolling: function() {
      function NavScrolling() {
        if (jQuery(window).scrollTop() > 60) {
          jQuery(".header").addClass("reduce-header");
        } else {
          jQuery(".header").removeClass("reduce-header");
        }
      }

      NavScrolling();

      jQuery(window).scroll(function() {
        NavScrolling();
      });
    },

    initSliderRange: function() {
      $("#slider-range").slider({
        range: true,
        min: 0,
        max: 500,
        values: [50, 250],
        slide: function(event, ui) {
          $("#amount").val("$" + ui.values[0] + " - $" + ui.values[1]);
        }
      });
      $("#amount").val("$" + $("#slider-range").slider("values", 0) +
        " - $" + $("#slider-range").slider("values", 1));
    },

    // wrapper function to scroll(focus) to an element
    scrollTo: function(el, offeset) {
      var pos = (el && el.size() > 0) ? el.offset().top : 0;
      if (el) {
        if ($('body').hasClass('page-header-fixed')) {
          pos = pos - $('.header').height();
        }
        pos = pos + (offeset ? offeset : -1 * el.height());
      }

      jQuery('html,body').animate({
        scrollTop: pos
      }, 'slow');
    },

    //public function to add callback a function which will be called on window resize
    addResponsiveHandler: function(func) {
      responsiveHandlers.push(func);
    },

    scrollTop: function() {
      App.scrollTo();
    },

    gridOption1: function() {
      $(function() {
        $('.grid-v1').mixitup();
      });
    }

  };
}();
;//** jQuery Scroll to Top Control script- (c) Dynamic Drive DHTML code library: http://www.dynamicdrive.com.
//** Available/ usage terms at http://www.dynamicdrive.com (March 30th, 09')
//** v1.1 (April 7th, 09'):
//** 1) Adds ability to scroll to an absolute position (from top of page) or specific element on the page instead.
//** 2) Fixes scroll animation not working in Opera.

var scrolltotop = {
  //startline: Integer. Number of pixels from top of doc scrollbar is scrolled before showing control
  //scrollto: Keyword (Integer, or "Scroll_to_Element_ID"). How far to scroll document up when control is clicked on (0=top).

  setting: {
    startline: 100,
    scrollto: 0,
    scrollduration: 1000,
    fadeduration: [500, 100]
  },

  controlHTML: '<img src="/img/up.png" style="width:40px; height:40px" />', //HTML for control, which is auto wrapped in DIV w/ ID="topcontrol"
  controlattrs: {
    offsetx: 10,
    offsety: 10
  }, //offset of control relative to right/ bottom of window corner

  anchorkeyword: '#top', //Enter href value of HTML anchors on the page that should also act as "Scroll Up" links

  state: {
    isvisible: false,
    shouldvisible: false
  },

  scrollup: function() {
    if (!this.cssfixedsupport) //if control is positioned using JavaScript
      this.$control.css({
        opacity: 0
      }) //hide control immediately after clicking it
    var dest = isNaN(this.setting.scrollto) ? this.setting.scrollto : parseInt(this.setting.scrollto)
    if (typeof dest == "string" && jQuery('#' + dest).length == 1) //check element set by string exists
      dest = jQuery('#' + dest).offset().top
    else
      dest = 0
    this.$body.animate({
      scrollTop: dest
    }, this.setting.scrollduration);
  },

  keepfixed: function() {
    var $window = jQuery(window)
    var controlx = $window.scrollLeft() + $window.width() - this.$control.width() - this.controlattrs.offsetx
    var controly = $window.scrollTop() + $window.height() - this.$control.height() - this.controlattrs.offsety
    this.$control.css({
      left: controlx + 'px',
      top: controly + 'px'
    })
  },

  togglecontrol: function() {
    var scrolltop = jQuery(window).scrollTop()
    if (!this.cssfixedsupport)
      this.keepfixed()
    this.state.shouldvisible = (scrolltop >= this.setting.startline) ? true : false
    if (this.state.shouldvisible && !this.state.isvisible) {
      this.$control.stop().animate({
        opacity: 1
      }, this.setting.fadeduration[0])
      this.state.isvisible = true
    } else if (this.state.shouldvisible == false && this.state.isvisible) {
      this.$control.stop().animate({
        opacity: 0
      }, this.setting.fadeduration[1])
      this.state.isvisible = false
    }
  },

  init: function() {
    jQuery(document).ready(function($) {
      var mainobj = scrolltotop
      var iebrws = document.all
      mainobj.cssfixedsupport = !iebrws || iebrws && document.compatMode == "CSS1Compat" && window.XMLHttpRequest //not IE or IE7+ browsers in standards mode
      mainobj.$body = (window.opera) ? (document.compatMode == "CSS1Compat" ? $('html') : $('body')) : $('html,body')
      mainobj.$control = $('<div id="topcontrol">' + mainobj.controlHTML + '</div>')
        .css({
          position: mainobj.cssfixedsupport ? 'fixed' : 'absolute',
          bottom: mainobj.controlattrs.offsety,
          right: mainobj.controlattrs.offsetx,
          opacity: 0,
          cursor: 'pointer'
        })
        .attr({
          title: 'Scroll Back to Top'
        })
        .click(function() {
          mainobj.scrollup();
          return false
        })
        .appendTo('body')
      if (document.all && !window.XMLHttpRequest && mainobj.$control.text() != '') //loose check for IE6 and below, plus whether control contains any text
        mainobj.$control.css({
          width: mainobj.$control.width()
        }) //IE6- seems to require an explicit width on a DIV containing text
      mainobj.togglecontrol()
      $('a[href="' + mainobj.anchorkeyword + '"]').click(function() {
        mainobj.scrollup()
        return false
      })
      $(window).bind('scroll resize', function(e) {
        mainobj.togglecontrol()
      })
    })
  }
}

scrolltotop.init()
