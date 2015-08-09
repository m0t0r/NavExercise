(function() {
  'use strict';

  document.addEventListener("DOMContentLoaded", function() {

    var prevListItem;

    /*************** HELPER METHODS ***************/

    function select(selector) {
      return document.querySelector(selector);
    }

    function selectAll(selector) {
      return document.querySelectorAll(selector);
    }

    /*************** MOBILE INTERACTIONS ***************/

    // Toggle translucent mask on menu icon click
    select('.menu-icon').addEventListener('click', function(e) {
      select('body').classList.toggle('overlay');
      closePreviousMenuItem();
    });

    function addEventListenersForListItems() {
      var listItems = selectAll('.has-sub-menu');

      for(var i = 0; i < listItems.length; i++) {
        listItems[i].addEventListener('click', function(e) {
          this.classList.toggle('open-sub-menu');

          if (prevListItem !== this) {
            if (prevListItem !== void 0) {
              closePreviousMenuItem();
            }
            this.childNodes[3].classList.add('open');
          } else {
            this.childNodes[3].classList.toggle('open');
          }
          prevListItem = this;
        });
      }
    }

    function closePreviousMenuItem() {
      if (prevListItem !== void 0) {
        prevListItem.classList.remove('open-sub-menu');
        prevListItem.childNodes[3].classList.remove('open');
      }
    }

    // Remove translucent mask and rollback menu interaction on document click
    document.addEventListener('click', function(e) {
      if((e.target.tagName !== 'SPAN' && e.target.tagName !== 'INPUT' && e.target.classList[0] !== 'sub-menu') && select('body').classList.contains('overlay')) {
        select('.menu-icon').click();
        closePreviousMenuItem();
      }
    });

    addEventListenersForListItems();

    /*************** DESKTOP INTERACTIONS ***************/






  });
}());
