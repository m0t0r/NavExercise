(function() {
  'use strict';

  document.addEventListener("DOMContentLoaded", function() {
    var prevListItem;

    /*************** AJAX MENU ***************/

    /**
     *  This method makes XHR GET request
     * @param url
     * @returns {Promise}
     * @private
     */
    function _httpGET(url) {
      return new Promise(function(resolve, reject) {
        var request = new XMLHttpRequest();
        request.open('GET', url);

        if(url.split('.').pop() === 'json') {
          request.setRequestHeader('Content-Type', 'application/json');
        }
        request.onreadystatechange = function() {
          if(request.readyState === 4) {
            if(request.status === 200) {
              if(url.split('.').pop() === 'json') {
                resolve(JSON.parse(request.responseText));
              }
            } else {
              reject({error: 'Error - ' + request.statusText});
            }
          }
        };
        request.send();
      });
    }

    /**
     * This method builds ajax menu markup
     *
     * @param data
     * @returns {string}
     * @private
     */
    function _createMenuMarkup(data) {
      var html = '';
      for (var element in data) {
        if (data[element].items !== void 0 && data[element].items.length) {
          html += '<li role="menuitem" class="has-sub-menu">';
          html += '<a href="' + data[element].url + '" class="sub-menu">'+ data[element].label +'</a>';
        } else {
          html += '<li role="menuitem">';
          html += '<a href="' + data[element].url + '">'+ data[element].label +'</a>';
        }
        if (data[element].items !== void 0 && data[element].items.length) {
          html += '<ul role="menu" aria-hidden="true">';
          html += _createMenuMarkup(data[element].items);
          html += '</ul>';
        }
        html += '</li>';
      }
      return html;
    }

    /*************** HELPER METHODS ***************/

    function select(selector) {
      return document.querySelector(selector);
    }

    function selectAll(selector) {
      return document.querySelectorAll(selector);
    }

    /*************** MENU INTERACTIONS ***************/

    /**
     * This method adds click event listener to toggle translucent mask on menu icon click
     *
     * @returns {void}
     * @private
     */
    function _addEventListenerForMobileMenuIcon() {
      select('.menu-icon').addEventListener('click', function(e) {
        select('body').classList.toggle('overlay');
        _closePreviousMenuItem();
      });
    }

    /**
     * This method adds click event listeners for menu items to toggle open/close sub-menu state
     *
     * @returns {void}
     * @private
     */
    function _addEventListenersForListItems() {
      var listItems = selectAll('.has-sub-menu');

      for(var i = 0; i < listItems.length; i++) {
        listItems[i].addEventListener('click', function(e) {
          this.classList.toggle('open-sub-menu');
          this.childNodes[0].classList.add('active');

          if (prevListItem !== this) {
            if (prevListItem !== void 0) {
              _closePreviousMenuItem();
            }
            this.childNodes[1].classList.add('open');
          } else {
            this.childNodes[1].classList.toggle('open');
          }

          // Set overlay in desktop view
          if (window.innerWidth >= 768) {
            if (!select('body').classList.contains('overlay')) {
              select('body').classList.add('overlay');
            }
          }

          prevListItem = this;
        });
      }
    }

    /**
     * This method closes previous opened menu item when another one was clicked
     *
     * @returns {void}
     * @private
     */
    function _closePreviousMenuItem() {
      if (prevListItem !== void 0) {
        prevListItem.classList.remove('open-sub-menu');
        prevListItem.childNodes[1].classList.remove('open');
        prevListItem.childNodes[0].classList.remove('active');
      }
    }

    /**
     * This method removes translucent mask and rollbacks menu interaction on document click
     *
     * @returns {void}
     * @private
     */
    function _addEventListenerForDocumentClick() {
      document.addEventListener('click', function(e) {
        if((e.target.tagName !== 'SPAN' && e.target.tagName !== 'INPUT' && e.target.classList[0] !== 'sub-menu') && select('body').classList.contains('overlay')) {
          _closePreviousMenuItem();

          if (window.innerWidth <= 768) {
            select('.menu-icon').click();
          } else {
            select('body').classList.remove('overlay');
          }
        }
      });
    }

    /**
     * This method pushes back page content on window resize if mobile menu was opened
     *
     * @returns {void}
     * @private
     */
    function _addEventListenerOnWindowResize() {
      window.addEventListener('resize', function(e) {
        if (window.innerWidth >= 768) {
          select('.content').style.left = '0px';
        }
      });
    }

    /*************** INITIALIZATION ***************/

    /**
     * This method makes initialization of the interactive menu
     *
     * @returns {void}
     * @public
     */
    function init() {
      _httpGET('/api/nav.json').then(function(data) {
        select('.menu > ul').innerHTML = _createMenuMarkup(data.items);
      }, function(error) {
        console.error(error);
      }).then(function() {
        _addEventListenersForListItems();
        _addEventListenerForMobileMenuIcon();
        _addEventListenerForDocumentClick();
        _addEventListenerOnWindowResize();
      });
    }

    init();

  });
}());