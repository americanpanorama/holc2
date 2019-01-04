import Queue from 'queue-async';

import config from '../../basemaps/cartodb/config.json';

const CartoDBClient = function(accountName,options) {

  options = options || {};

  var that = this;

  options.apiroot     = options.apiroot      || "http://{accountName}.cartodb.com/api/v2/";
  options.format      = options.format       || "GeoJSON";
  options.accountName = options.accountName  || accountName;

  //
  // Request remote data
  //
  function request(uri, callback) {

    if (window && window.XMLHttpRequest) {
      var xmlHttp = null;

      xmlHttp = new window.XMLHttpRequest();

      xmlHttp.onreadystatechange = function() {
        if ((xmlHttp.readyState|0) === 4) {
          if ((xmlHttp.status|0) === 200 ) {

            callback(null, xmlHttp);
          } else {
            callback(xmlHttp);
          }
        }
      };

      xmlHttp.open( "GET", uri, true );
      return xmlHttp.send( null );
    } else {
      return false;
    }
  }

  //
  // Build a string from a template and data
  //
  function buildTemplate(template, data) {
    var outString = template;

    for (var i in data) {
      if (data.hasOwnProperty(i)) {
        outString = outString.split("{" + i + "}").join(data[i]);
      }
    }

    return outString;
  }

  //
  // Request from the CartoDb SQL endpoint
  //
  function sqlRequest(sql, callback, _options) {

    _options = _options || {};

    //
    // Override defaults
    //
    if (Object.keys(_options).length) {
      for (var i in _options) {

        if (_options.hasOwnProperty(i)) {

          options[i] = _options[i];

        }

      }
    }

    var url = buildTemplate([
      buildTemplate(options.apiroot, options),
      "sql",
      "?format=" + options.format,
      "&q=" + sql
    ].join(""), options);

    if (options.dangerouslyExposedAPIKey) {
      console.warn("Exposing API key in URL! Do not push this to production.");
      url += ("&api_key=" + options.dangerouslyExposedAPIKey);
    }

    return request(url,
      function (err, response) {

        try {
          callback(err, JSON.parse(response.responseText), response);
        } catch (err) {
          callback(err, null, response);
        }

      }
    );

  }

  //
  // Promise request
  function requestPromise(params) {
    var opts = normalizeOptions(params.options);

    var url = (params.sql) ? buildTemplate([
      buildTemplate(opts.apiroot, opts),
      "sql",
      "?format=" + opts.format,
      "&q=" + params.sql
    ].join(""), opts) : params.url;

    var key = params.key;


    return new Promise(function(resolve, reject) {

      if (window && window.XMLHttpRequest) {
        // Do the usual XHR stuff
        var req = new XMLHttpRequest();
        req.open('GET', url);

        req.onload = function() {
          // This is called even on 404 etc
          // so check the status
          if (req.status == 200) {
            // Resolve the promise with the response text
            return resolve({
              payload: req.response || req.responseText,
              id: key
            });
          }
          else {
            // Otherwise reject with the status text
            // which will hopefully be a meaningful error
            reject({
              payload: Error(req.statusText),
              id: key
            });
          }
        };

        // Handle network errors
        req.onerror = function() {
          reject({
            payload: Error("Network Error"),
            id: key
          });
        };

        // Make the request
        req.send();

      } else {
        reject({
          payload: Error("XMLHttpRequest not supported"),
          id: key
        });
      }
    });



  }

  //
  //
  //
  function normalizeOptions(_options) {
    _options = _options || {};

    var rsp = {};
    for (var key in options) {
      var value = (_options.hasOwnProperty(key)) ? _options[key] : options[key];
      rsp[key] = value;
    }

    return rsp;
  }

  //
  // Public interface
  //
  that.sqlRequest = sqlRequest;
  that.requestPromise = requestPromise;
  that.requestPromiseParallel = function(queue) {
    return Promise.all(
      queue.map(function(q){
        return requestPromise(q).then(function(rsp) {
          return {
            response: rsp,
            key: rsp.id
          };
        }).catch(function(err) {
          return err;
        });
      })
    );
  };

  that.requestPromiseJSON = function(params) {
    return requestPromise(params).then(function(rsp) {
      return {
        response: JSON.parse(rsp.payload),
        key: rsp.id
      };
    }).catch(function(err) {
      return err;
    });
  };

  that.requestPromiseParallelJSON = function(queue) {
    return Promise.all(
      queue.map(that.requestPromiseJSON)
    );
  };

  return that;

};

const cartoDBClient = new CartoDBClient(config.userId, { apiroot: 'https://' + config.userId + '.cartodb.com/api/v2/' });

const CartoDBLoader = {
  
  /** Use `queue-async` to defer() up an array of queries,
   * and return a Promise that is resolved when all requests have completed.
   * Accepts a list of objects formatted as { query, format }.
   */
  query: function (queryConfigs) {

    return new Promise((resolve, reject) => {

      // Run up to 3 requests in parallel
      let queue = Queue(3);
      queryConfigs.forEach((queryConfig) => {
        queue.defer(this.request, queryConfig);
      });

      queue.awaitAll((error, ...responses) => {
        if (error) {
          reject(error);
        } else {
          resolve(...responses);
        }
      });

    });

  },

  request: function (queryConfig, callback) {

    cartoDBClient.sqlRequest(queryConfig.query, function(err, response) {
      if (!err) {
        let innerResponse;
        switch (queryConfig.format.toLowerCase()) {
        case 'geojson':
          innerResponse = response.features;
          break;
        default:
          innerResponse = response.rows;
          break;
        }
        callback(null, innerResponse);
      } else {
        callback(err);
      }
    }, {
      'format': queryConfig.format,
      'dangerouslyExposedAPIKey': config.apiKey
    });

  }
  
};

export default CartoDBLoader;
