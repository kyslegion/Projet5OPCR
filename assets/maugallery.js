'use strict';
(function($) {
  /**
   * @param {(Array|Document|DocumentFragment|Element|HTMLCollection|NodeList|string)} settings
   * @return {?}
   */
  $.fn.mauGallery = function(settings) {
    settings = $.extend($.fn.mauGallery.defaults, settings);
    /** @type {!Array} */
    var results = [];
    return this.each(function() {
      $.fn.mauGallery.methods.createRowWrapper($(this));
      if (settings.lightBox) {
        $.fn.mauGallery.methods.createLightBox($(this), settings.lightboxId, settings.navigation);
      }
      $.fn.mauGallery.listeners(settings);
      $(this).children(".gallery-item").each(function(index) {
        $.fn.mauGallery.methods.responsiveImageItem($(this));
        $.fn.mauGallery.methods.moveItemInRowWrapper($(this));
        $.fn.mauGallery.methods.wrapItemInColumn($(this), settings.columns);
        var selector = $(this).data("gallery-tag");
        if (settings.showTags && selector !== undefined && results.indexOf(selector) === -1) {
          results.push(selector);
        }
      });
      if (settings.showTags) {
        $.fn.mauGallery.methods.showItemTags($(this), settings.tagsPosition, results);
      }
      $(this).fadeIn(500);
    });
  };
  $.fn.mauGallery.defaults = {
    columns : 3,
    lightBox : true,
    lightboxId : null,
    showTags : true,
    tagsPosition : "bottom",
    navigation : true
  };
  /**
   * @param {(Array|HTMLCollection|Node|NodeList|Window|string)} event
   * @return {undefined}
   */
  $.fn.mauGallery.listeners = function(event) {
    $(".gallery-item").on("click", function() {
      if (event.lightBox && $(this).prop("tagName") === "IMG") {
        $.fn.mauGallery.methods.openLightBox($(this), event.lightboxId);
      } else {
        return;
      }
    });
    $(".gallery").on("click", ".nav-link", $.fn.mauGallery.methods.filterByTag);
    $(".gallery").on("click", ".mg-prev", () => {
      return $.fn.mauGallery.methods.prevImage(event.lightboxId);
    });
    $(".gallery").on("click", ".mg-next", () => {
      return $.fn.mauGallery.methods.nextImage(event.lightboxId);
    });
  };
  $.fn.mauGallery.methods = {
    createRowWrapper(index) {
      if (!index.children().first().hasClass("row")) {
        index.append('<div class="gallery-items-row row"></div>');
      }
    },
    wrapItemInColumn(element, options) {
      if (options.constructor === Number) {
        element.wrap(`<div class='item-column mb-4 col-${Math.ceil(12 / options)}'></div>`);
      } else {
        if (options.constructor === Object) {
          /** @type {string} */
          var commentText = "";
          if (options.xs) {
            commentText = commentText + ` col-${Math.ceil(12 / options.xs)}`;
          }
          if (options.sm) {
            commentText = commentText + ` col-sm-${Math.ceil(12 / options.sm)}`;
          }
          if (options.md) {
            commentText = commentText + ` col-md-${Math.ceil(12 / options.md)}`;
          }
          if (options.lg) {
            commentText = commentText + ` col-lg-${Math.ceil(12 / options.lg)}`;
          }
          if (options.xl) {
            commentText = commentText + ` col-xl-${Math.ceil(12 / options.xl)}`;
          }
          element.wrap(`<div class='item-column mb-4${commentText}'></div>`);
        } else {
          console.error(`Columns should be defined as numbers or objects. ${typeof options} is not supported.`);
        }
      }
    },
    moveItemInRowWrapper(page_record) {
      page_record.appendTo(".gallery-items-row");
    },
    responsiveImageItem($module) {
      if ($module.prop("tagName") === "IMG") {
        $module.addClass("img-fluid");
      }
    },
    openLightBox(a, itemId) {
      
      $(`#${itemId}`).find(".lightboxImage").attr("src", a.attr("src"));
      $(`#${itemId}`).modal("toggle");
    },
    prevImage() {
      let arrowDiv = null;
      $("img.gallery-item").each(function() {
        if ($(this).attr("src") === $(".lightboxImage").attr("src")) {
          arrowDiv = $(this);
        }
      });
      let multiBehavior = $(".tags-bar span.active-tag").data("images-toggle");
      let values = [];
      if (multiBehavior === "all") {
        $(".item-column").each(function() {
          if ($(this).children("img").length) {
            values.push($(this).children("img"));
          }
        });
      } else {
        $(".item-column").each(function() {
          if ($(this).children("img").data("gallery-tag") === multiBehavior) {
            values.push($(this).children("img"));
          }
        });
      }
      let j = 0;
      let customPlayerControls = null;
      $(values).each(function(first) {
        if ($(arrowDiv).attr("src") === $(this).attr("src")) {
          j = first;
        }
      });
    
      j--;
      if (j < 0) {
        j = values.length - 1;
      }
    
      customPlayerControls = values[j] || values[values.length - 1];
      $(".lightboxImage").attr("src", $(customPlayerControls).attr("src"));
    },
    
    nextImage() {
      
      let arrowDiv = null;
      $("img.gallery-item").each(function() {
        if ($(this).attr("src") === $(".lightboxImage").attr("src")) {
          arrowDiv = $(this);
        }
      });
      let multiBehavior = $(".tags-bar span.active-tag").data("images-toggle");
      let values = [];
      if (multiBehavior === "all") {
        $(".item-column").each(function() {
          if ($(this).children("img").length) {
            values.push($(this).children("img"));
          }
        });
      } else {
        $(".item-column").each(function() {
          if ($(this).children("img").data("gallery-tag") === multiBehavior) {
            values.push($(this).children("img"));
          }
        });
      }
      let j = 0;
      let customPlayerControls = null;
      $(values).each(function(first) {
        if ($(arrowDiv).attr("src") === $(this).attr("src")) {
          j = first;
        }
      });
      

      j++;
      if (j >= values.length) {
        j = 0;
      }

      customPlayerControls = values[j] || values[0];
      $(".lightboxImage").attr("src", $(customPlayerControls).attr("src"));
    },
    createLightBox(tag, metadata, dimensionStartIndex) {
      tag.append(`<div class="modal fade" id="${metadata ? metadata : "galleryLightbox"}" tabindex="-1" role="dialog" aria-hidden="true">\n              <div class="modal-dialog" role="document">\n                  <div class="modal-content">\n                      <div class="modal-body">\n                          ${dimensionStartIndex ? '<div class="mg-prev" style="cursor:pointer;position:absolute;top:50%;left:-15px;background:white;"><</div>' : '<span style="display:none;" />'}\n                          <img class="lightboxImage img-fluid" alt="Contenu de l'image affich\u00e9e dans la modale au clique"/>\n                          ${dimensionStartIndex ? 
      '<div class="mg-next" style="cursor:pointer;position:absolute;top:50%;right:-15px;background:white;}">></div>' : '<span style="display:none;" />'}\n                      </div>\n                  </div>\n              </div>\n          </div>`);
    },
    showItemTags(toolbar, pos, data) {
      /** @type {string} */
      var tagItems = '<li class="nav-item"><span class="nav-link active active-tag"  data-images-toggle="all">Tous</span></li>';
      $.each(data, function(index, value) {
        tagItems = tagItems + `<li class="nav-item active">\n              <span class="nav-link"  data-images-toggle="${value}">${value}</span></li>`;
      });
      var removeButton = `<ul class="my-4 tags-bar nav nav-pills">${tagItems}</ul>`;
      if (pos === "bottom") {
        toolbar.append(removeButton);
      } else {
        if (pos === "top") {
          toolbar.prepend(removeButton);
        } else {
          console.error(`Unknown tags position: ${pos}`);
        }
      }
    },
    filterByTag() {
      if ($(this).hasClass("active-tag")) {
        return;
      }
      $(".active-tag").removeClass("active active-tag");
      $(this).addClass("nav-link active active-tag");
      var multiBehavior = $(this).data("images-toggle");
      $(".gallery-item").each(function() {
        $(this).parents(".item-column").hide();
        if (multiBehavior === "all") {
          $(this).parents(".item-column").show(300);
        } else {
          if ($(this).data("gallery-tag") === multiBehavior) {
            $(this).parents(".item-column").show(300);
          }
        }
      });
    }
  };
})(jQuery);
