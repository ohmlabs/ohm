(function() {
  'use strict';
 /*!
  * RequireJS plugin for async dependency load like JSONP and Google Maps
  * @author Miller Medeiros
  * @version 0.0.1 (2011/03/23)
  * Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
  */
  module.exports = {
    load: function(name, onLoad) {
      function injectScript(src) {
        var s, t;
        s = document.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = src;
        t = document.getElementsByTagName('script')[0];
        t.parentNode.insertBefore(s,t);
      }

      function formatUrl(name, id) {
        var paramRegex, url, param;
        paramRegex = /!(.+)/;
        url = name.replace(paramRegex, '');
        // default param name is 'callback'
        param = (paramRegex.test(name))? name.replace(/.+!/, '') : 'callback';
        url += (url.indexOf('?') < 0)? '?' : '&';
        return url + param +'='+ id;
      }

      var id = '__mm_asynch_req__'+ Date.now();
      // create a global variable that stores onLoad so callback
      // function can define new module after async load
      window[id] = onLoad;
      injectScript(formatUrl(name, id));

    }
  };

})();