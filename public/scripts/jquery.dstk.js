/*
 * jQuery Data Science Toolkit Plugin
 * version: 1.20 (2011-03-15)
 *
 * All code (C) Pete Warden, 2011
 *
 *    This program is free software: you can redistribute it and/or modify
 *    it under the terms of the GNU General Public License as published by
 *    the Free Software Foundation, either version 3 of the License, or
 *    (at your option) any later version.
 *
 *    This program is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU General Public License for more details.
 *
 *    You should have received a copy of the GNU General Public License
 *    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 * 
 */
 
(function($) {
  $.DSTK = function(options) {
  
    if ((typeof options == 'undefined')||(options == null)) {
      options = {};
    }  
  
    // These are the only dependencies on JQuery. If you want to run the code without
    // the framework, you can replace them with matching functions and call the
    // constructor directly, eg
    // var dstk = new DSTK({ajaxFunction: myAjax, toJSONFunction: myToJSON});
    options.ajaxFunction = $.ajax;
    options.toJSONFunction = $.toJSON;

    return new DSTK(options);
  };    
})(jQuery);

function DSTK(options) {
    
  var defaultOptions = {
    apiBase: 'http://www.geodict.com',
    checkVersion: true
  };
    
  if ((typeof options == 'undefined')||(options == null)) {
    options = defaultOptions;
  } else {
    for (var key in defaultOptions) {
      if (typeof options[key]=='undefined') {
        options[key] = defaultOptions[key];
      }
    }
  }
    
  this.apiBase = options.apiBase;
  this.ajaxFunction = options.ajaxFunction;
  this.toJSONFunction = options.toJSONFunction;
  
  if (options.checkVersion) {
    this.checkVersion();
  }
}

DSTK.prototype.checkVersion = function() {

  var requiredVersion = 130;

  var apiUrl = this.apiBase+'/info';
  
  this.ajaxFunction(apiUrl, {
    success: function(result) {
      var actualVersion = result['version'];
      if (actualVersion<requiredVersion) {
        throw 'DSTK: Version '+actualVersion+' found at "'+apiUrl+'" but '+requiredVersion+' is required';
      }
    },
    dataType: 'jsonp',
    crossDomain: true
  });

};

// See http://www.geodictapi.com/developerdocs for information on these calls

DSTK.prototype.ip2coordinates = function(ips, callback) {

  if (typeof ips.length == 'undefined') {
    ips = [ips];
  }

  var apiUrl = this.apiBase+'/ip2coordinates';
  apiUrl += '/'+encodeURIComponent($.toJSON(ips));

  this.ajaxFunction(apiUrl, {
    success: callback,
    dataType: 'jsonp',
    crossDomain: true
  });
};

DSTK.prototype.street2coordinates = function(addresses, callback) {

  if (typeof addresses.length == 'undefined') {
    addresses = [addresses];
  }

  var apiUrl = this.apiBase+'/street2coordinates';
  apiUrl += '/'+encodeURIComponent($.toJSON(addresses));

  $.ajax(apiUrl, {
    success: callback,
    dataType: 'jsonp',
    crossDomain: true
  });
};

DSTK.prototype.coordinates2politics = function(coordinates, callback) {

  if (typeof coordinates.length == 'undefined') {
    coordinates = [coordinates];
  }

  var apiUrl = this.apiBase+'/coordinates2politics';
  apiUrl += '/'+encodeURIComponent($.toJSON(coordinates));

  $.ajax(apiUrl, {
    success: callback,
    dataType: 'jsonp',
    crossDomain: true
  });
};

DSTK.prototype.text2places = function(text, callback) {

  var apiUrl = this.apiBase+'/text2places';
  apiUrl += '/'+encodeURIComponent(text);

  $.ajax(apiUrl, {
    success: callback,
    dataType: 'jsonp',
    crossDomain: true
  });
};



/*
 * jQuery JSON Plugin
 * version: 2.1 (2009-08-14)
 *
 * This document is licensed as free software under the terms of the
 * MIT License: http://www.opensource.org/licenses/mit-license.php
 *
 * Brantley Harris wrote this plugin. It is based somewhat on the JSON.org 
 * website's http://www.json.org/json2.js, which proclaims:
 * "NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.", a sentiment that
 * I uphold.
 *
 * It is also influenced heavily by MochiKit's serializeJSON, which is 
 * copyrighted 2005 by Bob Ippolito.
 */
 
(function($) {
    /** jQuery.toJSON( json-serializble )
        Converts the given argument into a JSON respresentation.

        If an object has a "toJSON" function, that will be used to get the representation.
        Non-integer/string keys are skipped in the object, as are keys that point to a function.

        json-serializble:
            The *thing* to be converted.
     **/
    $.toJSON = function(o)
    {
        if (typeof(JSON) == 'object' && JSON.stringify)
            return JSON.stringify(o);
        
        var type = typeof(o);
    
        if (o === null)
            return "null";
    
        if (type == "undefined")
            return undefined;
        
        if (type == "number" || type == "boolean")
            return o + "";
    
        if (type == "string")
            return $.quoteString(o);
    
        if (type == 'object')
        {
            if (typeof o.toJSON == "function") 
                return $.toJSON( o.toJSON() );
            
            if (o.constructor === Date)
            {
                var month = o.getUTCMonth() + 1;
                if (month < 10) month = '0' + month;

                var day = o.getUTCDate();
                if (day < 10) day = '0' + day;

                var year = o.getUTCFullYear();
                
                var hours = o.getUTCHours();
                if (hours < 10) hours = '0' + hours;
                
                var minutes = o.getUTCMinutes();
                if (minutes < 10) minutes = '0' + minutes;
                
                var seconds = o.getUTCSeconds();
                if (seconds < 10) seconds = '0' + seconds;
                
                var milli = o.getUTCMilliseconds();
                if (milli < 100) milli = '0' + milli;
                if (milli < 10) milli = '0' + milli;

                return '"' + year + '-' + month + '-' + day + 'T' +
                             hours + ':' + minutes + ':' + seconds + 
                             '.' + milli + 'Z"'; 
            }

            if (o.constructor === Array) 
            {
                var ret = [];
                for (var i = 0; i < o.length; i++)
                    ret.push( $.toJSON(o[i]) || "null" );

                return "[" + ret.join(",") + "]";
            }
        
            var pairs = [];
            for (var k in o) {
                var name;
                var type = typeof k;

                if (type == "number")
                    name = '"' + k + '"';
                else if (type == "string")
                    name = $.quoteString(k);
                else
                    continue;  //skip non-string or number keys
            
                if (typeof o[k] == "function") 
                    continue;  //skip pairs where the value is a function.
            
                var val = $.toJSON(o[k]);
            
                pairs.push(name + ":" + val);
            }

            return "{" + pairs.join(", ") + "}";
        }
    };

    /** jQuery.evalJSON(src)
        Evaluates a given piece of json source.
     **/
    $.evalJSON = function(src)
    {
        if (typeof(JSON) == 'object' && JSON.parse)
            return JSON.parse(src);
        return eval("(" + src + ")");
    };
    
    /** jQuery.secureEvalJSON(src)
        Evals JSON in a way that is *more* secure.
    **/
    $.secureEvalJSON = function(src)
    {
        if (typeof(JSON) == 'object' && JSON.parse)
            return JSON.parse(src);
        
        var filtered = src;
        filtered = filtered.replace(/\\["\\\/bfnrtu]/g, '@');
        filtered = filtered.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']');
        filtered = filtered.replace(/(?:^|:|,)(?:\s*\[)+/g, '');
        
        if (/^[\],:{}\s]*$/.test(filtered))
            return eval("(" + src + ")");
        else
            throw new SyntaxError("Error parsing JSON, source is not valid.");
    };

    /** jQuery.quoteString(string)
        Returns a string-repr of a string, escaping quotes intelligently.  
        Mostly a support function for toJSON.
    
        Examples:
            >>> jQuery.quoteString("apple")
            "apple"
        
            >>> jQuery.quoteString('"Where are we going?", she asked.')
            "\"Where are we going?\", she asked."
     **/
    $.quoteString = function(string)
    {
        if (string.match(_escapeable))
        {
            return '"' + string.replace(_escapeable, function (a) 
            {
                var c = _meta[a];
                if (typeof c === 'string') return c;
                c = a.charCodeAt();
                return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
            }) + '"';
        }
        return '"' + string + '"';
    };
    
    var _escapeable = /["\\\x00-\x1f\x7f-\x9f]/g;
    
    var _meta = {
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"' : '\\"',
        '\\': '\\\\'
    };
})(jQuery);