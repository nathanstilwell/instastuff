(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
"use strict";
/*globals Handlebars: true */
var base = require("./handlebars/base");

// Each of these augment the Handlebars object. No need to setup here.
// (This is done to easily share code between commonjs and browse envs)
var SafeString = require("./handlebars/safe-string")["default"];
var Exception = require("./handlebars/exception")["default"];
var Utils = require("./handlebars/utils");
var runtime = require("./handlebars/runtime");

// For compatibility and usage outside of module systems, make the Handlebars object a namespace
var create = function() {
  var hb = new base.HandlebarsEnvironment();

  Utils.extend(hb, base);
  hb.SafeString = SafeString;
  hb.Exception = Exception;
  hb.Utils = Utils;
  hb.escapeExpression = Utils.escapeExpression;

  hb.VM = runtime;
  hb.template = function(spec) {
    return runtime.template(spec, hb);
  };

  return hb;
};

var Handlebars = create();
Handlebars.create = create;

/*jshint -W040 */
/* istanbul ignore next */
var root = typeof global !== 'undefined' ? global : window,
    $Handlebars = root.Handlebars;
/* istanbul ignore next */
Handlebars.noConflict = function() {
  if (root.Handlebars === Handlebars) {
    root.Handlebars = $Handlebars;
  }
};

Handlebars['default'] = Handlebars;

exports["default"] = Handlebars;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./handlebars/base":2,"./handlebars/exception":3,"./handlebars/runtime":4,"./handlebars/safe-string":5,"./handlebars/utils":6}],2:[function(require,module,exports){
"use strict";
var Utils = require("./utils");
var Exception = require("./exception")["default"];

var VERSION = "3.0.0";
exports.VERSION = VERSION;var COMPILER_REVISION = 6;
exports.COMPILER_REVISION = COMPILER_REVISION;
var REVISION_CHANGES = {
  1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
  2: '== 1.0.0-rc.3',
  3: '== 1.0.0-rc.4',
  4: '== 1.x.x',
  5: '== 2.0.0-alpha.x',
  6: '>= 2.0.0-beta.1'
};
exports.REVISION_CHANGES = REVISION_CHANGES;
var isArray = Utils.isArray,
    isFunction = Utils.isFunction,
    toString = Utils.toString,
    objectType = '[object Object]';

function HandlebarsEnvironment(helpers, partials) {
  this.helpers = helpers || {};
  this.partials = partials || {};

  registerDefaultHelpers(this);
}

exports.HandlebarsEnvironment = HandlebarsEnvironment;HandlebarsEnvironment.prototype = {
  constructor: HandlebarsEnvironment,

  logger: logger,
  log: log,

  registerHelper: function(name, fn) {
    if (toString.call(name) === objectType) {
      if (fn) { throw new Exception('Arg not supported with multiple helpers'); }
      Utils.extend(this.helpers, name);
    } else {
      this.helpers[name] = fn;
    }
  },
  unregisterHelper: function(name) {
    delete this.helpers[name];
  },

  registerPartial: function(name, partial) {
    if (toString.call(name) === objectType) {
      Utils.extend(this.partials,  name);
    } else {
      if (typeof partial === 'undefined') {
        throw new Exception('Attempting to register a partial as undefined');
      }
      this.partials[name] = partial;
    }
  },
  unregisterPartial: function(name) {
    delete this.partials[name];
  }
};

function registerDefaultHelpers(instance) {
  instance.registerHelper('helperMissing', function(/* [args, ]options */) {
    if(arguments.length === 1) {
      // A missing field in a {{foo}} constuct.
      return undefined;
    } else {
      // Someone is actually trying to call something, blow up.
      throw new Exception("Missing helper: '" + arguments[arguments.length-1].name + "'");
    }
  });

  instance.registerHelper('blockHelperMissing', function(context, options) {
    var inverse = options.inverse,
        fn = options.fn;

    if(context === true) {
      return fn(this);
    } else if(context === false || context == null) {
      return inverse(this);
    } else if (isArray(context)) {
      if(context.length > 0) {
        if (options.ids) {
          options.ids = [options.name];
        }

        return instance.helpers.each(context, options);
      } else {
        return inverse(this);
      }
    } else {
      if (options.data && options.ids) {
        var data = createFrame(options.data);
        data.contextPath = Utils.appendContextPath(options.data.contextPath, options.name);
        options = {data: data};
      }

      return fn(context, options);
    }
  });

  instance.registerHelper('each', function(context, options) {
    if (!options) {
      throw new Exception('Must pass iterator to #each');
    }

    var fn = options.fn, inverse = options.inverse;
    var i = 0, ret = "", data;

    var contextPath;
    if (options.data && options.ids) {
      contextPath = Utils.appendContextPath(options.data.contextPath, options.ids[0]) + '.';
    }

    if (isFunction(context)) { context = context.call(this); }

    if (options.data) {
      data = createFrame(options.data);
    }

    function execIteration(key, i, last) {
      if (data) {
        data.key = key;
        data.index = i;
        data.first = i === 0;
        data.last  = !!last;

        if (contextPath) {
          data.contextPath = contextPath + key;
        }
      }

      ret = ret + fn(context[key], {
        data: data,
        blockParams: Utils.blockParams([context[key], key], [contextPath + key, null])
      });
    }

    if(context && typeof context === 'object') {
      if (isArray(context)) {
        for(var j = context.length; i<j; i++) {
          execIteration(i, i, i === context.length-1);
        }
      } else {
        var priorKey;

        for(var key in context) {
          if(context.hasOwnProperty(key)) {
            // We're running the iterations one step out of sync so we can detect
            // the last iteration without have to scan the object twice and create
            // an itermediate keys array. 
            if (priorKey) {
              execIteration(priorKey, i-1);
            }
            priorKey = key;
            i++;
          }
        }
        if (priorKey) {
          execIteration(priorKey, i-1, true);
        }
      }
    }

    if(i === 0){
      ret = inverse(this);
    }

    return ret;
  });

  instance.registerHelper('if', function(conditional, options) {
    if (isFunction(conditional)) { conditional = conditional.call(this); }

    // Default behavior is to render the positive path if the value is truthy and not empty.
    // The `includeZero` option may be set to treat the condtional as purely not empty based on the
    // behavior of isEmpty. Effectively this determines if 0 is handled by the positive path or negative.
    if ((!options.hash.includeZero && !conditional) || Utils.isEmpty(conditional)) {
      return options.inverse(this);
    } else {
      return options.fn(this);
    }
  });

  instance.registerHelper('unless', function(conditional, options) {
    return instance.helpers['if'].call(this, conditional, {fn: options.inverse, inverse: options.fn, hash: options.hash});
  });

  instance.registerHelper('with', function(context, options) {
    if (isFunction(context)) { context = context.call(this); }

    var fn = options.fn;

    if (!Utils.isEmpty(context)) {
      if (options.data && options.ids) {
        var data = createFrame(options.data);
        data.contextPath = Utils.appendContextPath(options.data.contextPath, options.ids[0]);
        options = {data:data};
      }

      return fn(context, options);
    } else {
      return options.inverse(this);
    }
  });

  instance.registerHelper('log', function(message, options) {
    var level = options.data && options.data.level != null ? parseInt(options.data.level, 10) : 1;
    instance.log(level, message);
  });

  instance.registerHelper('lookup', function(obj, field) {
    return obj && obj[field];
  });
}

var logger = {
  methodMap: { 0: 'debug', 1: 'info', 2: 'warn', 3: 'error' },

  // State enum
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  level: 1,

  // Can be overridden in the host environment
  log: function(level, message) {
    if (typeof console !== 'undefined' && logger.level <= level) {
      var method = logger.methodMap[level];
      (console[method] || console.log).call(console, message);
    }
  }
};
exports.logger = logger;
var log = logger.log;
exports.log = log;
var createFrame = function(object) {
  var frame = Utils.extend({}, object);
  frame._parent = object;
  return frame;
};
exports.createFrame = createFrame;
},{"./exception":3,"./utils":6}],3:[function(require,module,exports){
"use strict";

var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

function Exception(message, node) {
  var loc = node && node.loc,
      line,
      column;
  if (loc) {
    line = loc.start.line;
    column = loc.start.column;

    message += ' - ' + line + ':' + column;
  }

  var tmp = Error.prototype.constructor.call(this, message);

  // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
  for (var idx = 0; idx < errorProps.length; idx++) {
    this[errorProps[idx]] = tmp[errorProps[idx]];
  }

  if (loc) {
    this.lineNumber = line;
    this.column = column;
  }
}

Exception.prototype = new Error();

exports["default"] = Exception;
},{}],4:[function(require,module,exports){
"use strict";
var Utils = require("./utils");
var Exception = require("./exception")["default"];
var COMPILER_REVISION = require("./base").COMPILER_REVISION;
var REVISION_CHANGES = require("./base").REVISION_CHANGES;
var createFrame = require("./base").createFrame;

function checkRevision(compilerInfo) {
  var compilerRevision = compilerInfo && compilerInfo[0] || 1,
      currentRevision = COMPILER_REVISION;

  if (compilerRevision !== currentRevision) {
    if (compilerRevision < currentRevision) {
      var runtimeVersions = REVISION_CHANGES[currentRevision],
          compilerVersions = REVISION_CHANGES[compilerRevision];
      throw new Exception("Template was precompiled with an older version of Handlebars than the current runtime. "+
            "Please update your precompiler to a newer version ("+runtimeVersions+") or downgrade your runtime to an older version ("+compilerVersions+").");
    } else {
      // Use the embedded version info since the runtime doesn't know about this revision yet
      throw new Exception("Template was precompiled with a newer version of Handlebars than the current runtime. "+
            "Please update your runtime to a newer version ("+compilerInfo[1]+").");
    }
  }
}

exports.checkRevision = checkRevision;// TODO: Remove this line and break up compilePartial

function template(templateSpec, env) {
  /* istanbul ignore next */
  if (!env) {
    throw new Exception("No environment passed to template");
  }
  if (!templateSpec || !templateSpec.main) {
    throw new Exception('Unknown template object: ' + typeof templateSpec);
  }

  // Note: Using env.VM references rather than local var references throughout this section to allow
  // for external users to override these as psuedo-supported APIs.
  env.VM.checkRevision(templateSpec.compiler);

  var invokePartialWrapper = function(partial, context, options) {
    if (options.hash) {
      context = Utils.extend({}, context, options.hash);
    }

    partial = env.VM.resolvePartial.call(this, partial, context, options);
    var result = env.VM.invokePartial.call(this, partial, context, options);

    if (result == null && env.compile) {
      options.partials[options.name] = env.compile(partial, templateSpec.compilerOptions, env);
      result = options.partials[options.name](context, options);
    }
    if (result != null) {
      if (options.indent) {
        var lines = result.split('\n');
        for (var i = 0, l = lines.length; i < l; i++) {
          if (!lines[i] && i + 1 === l) {
            break;
          }

          lines[i] = options.indent + lines[i];
        }
        result = lines.join('\n');
      }
      return result;
    } else {
      throw new Exception("The partial " + options.name + " could not be compiled when running in runtime-only mode");
    }
  };

  // Just add water
  var container = {
    strict: function(obj, name) {
      if (!(name in obj)) {
        throw new Exception('"' + name + '" not defined in ' + obj);
      }
      return obj[name];
    },
    lookup: function(depths, name) {
      var len = depths.length;
      for (var i = 0; i < len; i++) {
        if (depths[i] && depths[i][name] != null) {
          return depths[i][name];
        }
      }
    },
    lambda: function(current, context) {
      return typeof current === 'function' ? current.call(context) : current;
    },

    escapeExpression: Utils.escapeExpression,
    invokePartial: invokePartialWrapper,

    fn: function(i) {
      return templateSpec[i];
    },

    programs: [],
    program: function(i, data, declaredBlockParams, blockParams, depths) {
      var programWrapper = this.programs[i],
          fn = this.fn(i);
      if (data || depths || blockParams || declaredBlockParams) {
        programWrapper = program(this, i, fn, data, declaredBlockParams, blockParams, depths);
      } else if (!programWrapper) {
        programWrapper = this.programs[i] = program(this, i, fn);
      }
      return programWrapper;
    },

    data: function(data, depth) {
      while (data && depth--) {
        data = data._parent;
      }
      return data;
    },
    merge: function(param, common) {
      var ret = param || common;

      if (param && common && (param !== common)) {
        ret = Utils.extend({}, common, param);
      }

      return ret;
    },

    noop: env.VM.noop,
    compilerInfo: templateSpec.compiler
  };

  var ret = function(context, options) {
    options = options || {};
    var data = options.data;

    ret._setup(options);
    if (!options.partial && templateSpec.useData) {
      data = initData(context, data);
    }
    var depths,
        blockParams = templateSpec.useBlockParams ? [] : undefined;
    if (templateSpec.useDepths) {
      depths = options.depths ? [context].concat(options.depths) : [context];
    }

    return templateSpec.main.call(container, context, container.helpers, container.partials, data, blockParams, depths);
  };
  ret.isTop = true;

  ret._setup = function(options) {
    if (!options.partial) {
      container.helpers = container.merge(options.helpers, env.helpers);

      if (templateSpec.usePartial) {
        container.partials = container.merge(options.partials, env.partials);
      }
    } else {
      container.helpers = options.helpers;
      container.partials = options.partials;
    }
  };

  ret._child = function(i, data, blockParams, depths) {
    if (templateSpec.useBlockParams && !blockParams) {
      throw new Exception('must pass block params');
    }
    if (templateSpec.useDepths && !depths) {
      throw new Exception('must pass parent depths');
    }

    return program(container, i, templateSpec[i], data, 0, blockParams, depths);
  };
  return ret;
}

exports.template = template;function program(container, i, fn, data, declaredBlockParams, blockParams, depths) {
  var prog = function(context, options) {
    options = options || {};

    return fn.call(container,
        context,
        container.helpers, container.partials,
        options.data || data,
        blockParams && [options.blockParams].concat(blockParams),
        depths && [context].concat(depths));
  };
  prog.program = i;
  prog.depth = depths ? depths.length : 0;
  prog.blockParams = declaredBlockParams || 0;
  return prog;
}

exports.program = program;function resolvePartial(partial, context, options) {
  if (!partial) {
    partial = options.partials[options.name];
  } else if (!partial.call && !options.name) {
    // This is a dynamic partial that returned a string
    options.name = partial;
    partial = options.partials[partial];
  }
  return partial;
}

exports.resolvePartial = resolvePartial;function invokePartial(partial, context, options) {
  options.partial = true;

  if(partial === undefined) {
    throw new Exception("The partial " + options.name + " could not be found");
  } else if(partial instanceof Function) {
    return partial(context, options);
  }
}

exports.invokePartial = invokePartial;function noop() { return ""; }

exports.noop = noop;function initData(context, data) {
  if (!data || !('root' in data)) {
    data = data ? createFrame(data) : {};
    data.root = context;
  }
  return data;
}
},{"./base":2,"./exception":3,"./utils":6}],5:[function(require,module,exports){
"use strict";
// Build out our basic SafeString type
function SafeString(string) {
  this.string = string;
}

SafeString.prototype.toString = SafeString.prototype.toHTML = function() {
  return "" + this.string;
};

exports["default"] = SafeString;
},{}],6:[function(require,module,exports){
"use strict";
/*jshint -W004 */
var escape = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "`": "&#x60;"
};

var badChars = /[&<>"'`]/g;
var possible = /[&<>"'`]/;

function escapeChar(chr) {
  return escape[chr];
}

function extend(obj /* , ...source */) {
  for (var i = 1; i < arguments.length; i++) {
    for (var key in arguments[i]) {
      if (Object.prototype.hasOwnProperty.call(arguments[i], key)) {
        obj[key] = arguments[i][key];
      }
    }
  }

  return obj;
}

exports.extend = extend;var toString = Object.prototype.toString;
exports.toString = toString;
// Sourced from lodash
// https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
var isFunction = function(value) {
  return typeof value === 'function';
};
// fallback for older versions of Chrome and Safari
/* istanbul ignore next */
if (isFunction(/x/)) {
  isFunction = function(value) {
    return typeof value === 'function' && toString.call(value) === '[object Function]';
  };
}
var isFunction;
exports.isFunction = isFunction;
/* istanbul ignore next */
var isArray = Array.isArray || function(value) {
  return (value && typeof value === 'object') ? toString.call(value) === '[object Array]' : false;
};
exports.isArray = isArray;
// Older IE versions do not directly support indexOf so we must implement our own, sadly.
function indexOf(array, value) {
  for (var i = 0, len = array.length; i < len; i++) {
    if (array[i] === value) {
      return i;
    }
  }
  return -1;
}

exports.indexOf = indexOf;
function escapeExpression(string) {
  // don't escape SafeStrings, since they're already safe
  if (string && string.toHTML) {
    return string.toHTML();
  } else if (string == null) {
    return "";
  } else if (!string) {
    return string + '';
  }

  // Force a string conversion as this will be done by the append regardless and
  // the regex test will do this transparently behind the scenes, causing issues if
  // an object's to string has escaped characters in it.
  string = "" + string;

  if(!possible.test(string)) { return string; }
  return string.replace(badChars, escapeChar);
}

exports.escapeExpression = escapeExpression;function isEmpty(value) {
  if (!value && value !== 0) {
    return true;
  } else if (isArray(value) && value.length === 0) {
    return true;
  } else {
    return false;
  }
}

exports.isEmpty = isEmpty;function blockParams(params, ids) {
  params.path = ids;
  return params;
}

exports.blockParams = blockParams;function appendContextPath(contextPath, id) {
  return (contextPath ? contextPath + '.' : '') + id;
}

exports.appendContextPath = appendContextPath;
},{}],7:[function(require,module,exports){
// Create a simple path alias to allow browserify to resolve
// the runtime on a supported path.
module.exports = require('./dist/cjs/handlebars.runtime').default;

},{"./dist/cjs/handlebars.runtime":1}],8:[function(require,module,exports){
'use strict';

var getStream = require('./src/getStream');
var fonts = require('./src/fonts');
var filters = require('./src/filters');
var artTemplate = require('../templates/art.hbs');
var mainElem = document.getElementById('main');

function changeFilter (el) {
  var filter = filters.randomFilter();
  var img = el.querySelector('img');
  img.style.filter = filter;
}

function changeFont (el) {
  var ff = fonts.randomFontFamily();
  el.style.fontFamily = ff;
}

function changeColor (el) {
  var color = fonts.randomColor();
  var textEl = el.querySelector('span');
  textEl.style.color = color;
}

function render (model) {
  model.fontFamily = fonts.randomFontFamily();
  model.filter = filters.randomFilter();
  model.fontColor = fonts.randomColor();
  mainElem.innerHTML += artTemplate(model);
}

getStream(function (thing) {
  render(thing);
});

var artElems = document.querySelectorAll('.art');
var artArray = Array.prototype.slice.call(artElems);

artArray.forEach(function (art) {
  art.addEventListener('click', function () {
    changeFont(art);
    changeFilter(art);
    changeColor(art);
  });
});

},{"../templates/art.hbs":13,"./src/filters":10,"./src/fonts":11,"./src/getStream":12}],9:[function(require,module,exports){
module.exports = [
'black',
'silver',
'gray',
'white',
'maroon',
'red',
'purple',
'fuchsia',
'green',
'lime',
'olive',
'yellow',
'navy',
'blue',
'teal',
'aqua',
'orange',
'aliceblue',
'antiquewhite',
'aquamarine',
'azure',
'beige',
'bisque',
'blanchedalmond',
'blueviolet',
'brown',
'burlywood',
'cadetblue',
'chartreuse',
'chocolate',
'coral',
'cornflowerblue',
'cornsilk',
'crimson',
'darkblue',
'darkcyan',
'darkgoldenrod',
'darkgray',
'darkgreen',
'darkgrey',
'darkkhaki',
'darkmagenta',
'darkolivegreen',
'darkorange',
'darkorchid',
'darkred',
'darksalmon',
'darkseagreen',
'darkslateblue',
'darkslategray',
'darkslategrey',
'darkturquoise',
'darkviolet',
'deeppink',
'deepskyblue',
'dimgray',
'dimgrey',
'dodgerblue',
'firebrick',
'floralwhite',
'forestgreen',
'gainsboro',
'ghostwhite',
'gold',
'goldenrod',
'greenyellow',
'grey',
'honeydew',
'hotpink',
'indianred',
'indigo',
'ivory',
'khaki',
'lavender',
'lavenderblush',
'lawngreen',
'lemonchiffon',
'lightblue',
'lightcoral',
'lightcyan',
'lightgoldenrodyellow',
'lightgray',
'lightgreen',
'lightgrey',
'lightpink',
'lightsalmon',
'lightseagreen',
'lightskyblue',
'lightslategray',
'lightslategrey',
'lightsteelblue',
'lightyellow',
'limegreen',
'linen',
'mediumaquamarine',
'mediumblue',
'mediumorchid',
'mediumpurple',
'mediumseagreen',
'mediumslateblue',
'mediumspringgreen',
'mediumturquoise',
'mediumvioletred',
'midnightblue',
'mintcream',
'mistyrose',
'moccasin',
'navajowhite',
'oldlace',
'olivedrab',
'orangered',
'orchid',
'palegoldenrod',
'palegreen',
'paleturquoise',
'palevioletred',
'papayawhip',
'peachpuff',
'peru',
'pink',
'plum',
'powderblue',
'rosybrown',
'royalblue',
'saddlebrown',
'salmon',
'sandybrown',
'seagreen',
'seashell',
'sienna',
'skyblue',
'slateblue',
'slategray',
'slategrey',
'snow',
'springgreen',
'steelblue',
'tan',
'thistle',
'tomato',
'turquoise',
'violet',
'wheat',
'whitesmoke',
'yellowgreen'
];

},{}],10:[function(require,module,exports){
'use strict';

/*
    Instagram filters as CSS filters, straight stolen
    from http://designpieces.com/2014/09/instagram-filters-css3-effects/
 */
var filters = [
  'contrast(1.3) brightness(0.8) sepia(0.3) saturate(1.5) hue-rotate(-20deg)', // x-pro2
  'saturate(0.02) contrast(0.85) brightness(1.2) sepia(0.02)', // willow
  'sepia(0.35) contrast(0.9) brightness(1.1) hue-rotate(-10deg) saturate(1.5)', // walden
  'sepia(0.15) saturate(1.5) contrast(0.9)', // valencia
  'sepia(0.4) saturate(2.5) hue-rotate(-30deg) contrast(0.67)', // toaster
  'brightness(0.75) contrast(1.3) sepia(0.5) hue-rotate(-25deg)', // sutro
  'contrast(0.8) saturate(1.2) sepia(0.15)', // sierra
  'saturate(1.4) sepia(0.25) hue-rotate(-15deg) contrast(0.8) brightness(1.1)', // rise
  'sepia(0.4) saturate(1.5) contrast(0.9) brightness(1.1) hue-rotate(-15deg)' // nashville
];

function randomFilter () {
  var randomIndex = Math.floor(Math.random() * filters.length);
  return filters[randomIndex];
}

module.exports = {
  randomFilter: randomFilter
};

},{}],11:[function(require,module,exports){
'use strict';

var colors = require('./colors.js');

var families = [
  'Lobster Two',
  'Overlock',
  'Playball',
  'Sigmar One',
  'Amatic SC',
  'Berkshire Swash',
  'Kaushan Script',
  'Luckiest Guy',
  'Open Sans',
  'Sancreek'
];


function randomFontName () {
  var randomIndex = Math.floor(Math.random() * families.length);
  return families[randomIndex];
}

function randomFontFamily () {
  return randomFontName() + ', sans-serif';
}

function randomClassname () {
  var family = randomFontName();
  return family.toLowerCase().replace(' ', '-');
}

function randomColor () {
  var randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

module.exports = {
  randomFontName: randomFontName,
  randomFontFamily: randomFontFamily,
  randomClassname: randomClassname,
  randomColor: randomColor
};

},{"./colors.js":9}],12:[function(require,module,exports){
'use strict';
module.exports = function getStream (callback) {
  var OPERATORS = 'come get give go keep let make put seem take be do have say see send may will about across after against among at before between by down from in off on over through to under up with as for of till than a the all any every no other some such that this I he you who and because but or if through while how when where why again ever far forward hear near now out still there then together well almost enough even little much not only quite so very tomorrow yesterday north south east west please yes'.split(' ');
  var GENERAL = 'account act addition adjustment advertisement agreement air amount amusement animal answer apparatus approval argument art attack attempt attention attraction authority back balance base behavior belief birth bit bite blood blow body brass bread breath brother building burn burst business butter canvas care cause chalk chance change cloth coal colour comfort committee company comparison competition condition connection control cook copper copy cork cotton cough country cover crack credit crime crush cry current curve damage danger daughter day death debt decision degree design desire destruction detail development digestion direction discovery discussion disease disgust distance distribution division doubt drink driving dust earth edge education effect end error event example exchange existence expansion experience expert fact fall family father fear feeling fiction field fight fire flame flight flower fold food force form friend front fruit glass gold government grain grass grip group growth guide harbor harmony hate hearing heat help history hole hope hour humour ice idea impulse increase industry ink insect instrument insurance interest invention iron jelly join journey judge jump kick kiss knowledge land language laugh law lead learning leather letter level lift light limit linen liquid list look loss love machine man manager mark market mass meal measure meat meeting memory metal middle milk mind mine minute mist money month morning mother motion mountain move music name nation need news night noise note number observation offer oil operation opinion order organization ornament owner page pain paint paper part paste payment peace person place plant play pleasure poison point polish porter position powder power price print process produce profit property prose protest pull punishment purpose push quality question rain range rate ray reaction reading reason record regret relation religion representative request respect rest reward rhythm rice river road roll room rub rule run salt sand scale science sea seat secretary selection self sense servant sex shade shake shame shock side sign silk silver sister size sky sleep slip slope smash smell smile smoke sneeze snow soap society son song sort sound soup space stage start statement steam steel step stitch stone stop story stretch structure substance sugar suggestion summer support surprise swim system talk taste tax teaching tendency test theory thing thought thunder time tin top touch trade transport trick trouble turn twist unit use value verse vessel view voice walk war wash waste water wave wax way weather week weight wind wine winter woman wood wool word work wound writing year'.split(' ');
  var PICTURABLES = 'angle ant apple arch arm army baby bag ball band basin basket bath bed bee bell berry bird blade board boat bone book boot bottle box boy brain brake branch brick bridge brush bucket bulb button cake camera card carriage cart cat chain cheese chest chin church circle clock cloud coat collar comb cord cow cup curtain cushion dog door drain drawer dress drop ear egg engine eye face farm feather finger fish flag floor fly foot fork fowl frame garden girl glove goat gun hair hammer hand hat head heart hook horn horse hospital house island jewel kettle key knee knife knot leaf leg library line lip lock map match monkey moon mouth muscle nail neck needle nerve net nose nut office orange oven parcel pen pencil picture pig pin pipe plane plate plough pocket pot potato prison pump rail rat receipt ring rod roof root sail school scissors screw seed sheep shelf ship shirt shoe skin skirt snake sock spade sponge spoon spring square stamp star station stem stick stocking stomach store street sun table tail thread throat thumb ticket toe tongue tooth town train tray tree trousers umbrella wall watch wheel whip whistle window wing wire worm'.split(' ');
  var QUALITIES = 'able acid angry automatic beautiful black boiling bright broken brown cheap chemical chief clean clear common complex conscious cup deep dependent early elastic electric equal fat fertile first fixed flat free frequent full general good great grey hanging happy hard healthy high hollow important kind like living long male married material medical military natural necessary new normal open parallel past physical political poor possible present private probable quick quiet ready red regular responsible right round same second separate serious sharp smooth sticky stiff straight strong sudden sweet tall thick tight tired true violent waiting warm wet wide wise yellow young'.split(' ');
  function pick (coll) {
    return coll[Math.floor(Math.random() * coll.length)];
  }
  function cap (word) {
    return word[0].toUpperCase()+word.slice(1);
  }
  var id = 0;
  function gen () {
    callback({
      id: ++id,
      title: cap(pick(QUALITIES)) + ' ' + pick(PICTURABLES) + (Math.random() < 0.4 ? '' : ' ' + pick(OPERATORS) + ' ' + pick(GENERAL)),
      date: Date.now() - Math.floor(2 * 60 * 60 * 1000 * Math.random()),
      url: 'https://unsplash.it/400/400/?random=' + id + Date.now(),
      authorName: pick(GENERAL).slice(0, 2 + Math.floor(3*Math.random())) + pick(GENERAL).slice(-5 + Math.floor(5*Math.random())),
      likes: Math.floor(500 * Math.random() * Math.random())
    });
  }
  for (var i=10 * Math.random(); i<20; i++) gen();
  // setInterval(gen, 10000);
};

},{}],13:[function(require,module,exports){
var templater = require("handlebars/runtime")["default"].template;module.exports = templater({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div\n  class=\"art inline-block relative cursor m2 ff-overlock\"\n  style=\"font-family: "
    + alias3(((helper = (helper = helpers.fontFamily || (depth0 != null ? depth0.fontFamily : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"fontFamily","hash":{},"data":data}) : helper)))
    + "\">\n  <div class=\" absolute top-0 left-0 flex flex-center full-height col col-12 px2 z2\">\n    <span\n      class=\"shadow center f1 white m0 col col-12\"\n      style=\"color: "
    + alias3(((helper = (helper = helpers.fontColor || (depth0 != null ? depth0.fontColor : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"fontColor","hash":{},"data":data}) : helper)))
    + "\n    \">"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</span>\n  </div>\n  <img\n    class=\"\"\n    style=\"filter: "
    + alias3(((helper = (helper = helpers.filter || (depth0 != null ? depth0.filter : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"filter","hash":{},"data":data}) : helper)))
    + "\"\n    src=\""
    + alias3(((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"url","hash":{},"data":data}) : helper)))
    + "\"\n    alt=\"a randomly selected picture\">\n</div>\n";
},"useData":true});
},{"handlebars/runtime":7}]},{},[8])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvaGFuZGxlYmFycy9kaXN0L2Nqcy9oYW5kbGViYXJzLnJ1bnRpbWUuanMiLCJub2RlX21vZHVsZXMvaGFuZGxlYmFycy9kaXN0L2Nqcy9oYW5kbGViYXJzL2Jhc2UuanMiLCJub2RlX21vZHVsZXMvaGFuZGxlYmFycy9kaXN0L2Nqcy9oYW5kbGViYXJzL2V4Y2VwdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2Rpc3QvY2pzL2hhbmRsZWJhcnMvcnVudGltZS5qcyIsIm5vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2Rpc3QvY2pzL2hhbmRsZWJhcnMvc2FmZS1zdHJpbmcuanMiLCJub2RlX21vZHVsZXMvaGFuZGxlYmFycy9kaXN0L2Nqcy9oYW5kbGViYXJzL3V0aWxzLmpzIiwibm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvcnVudGltZS5qcyIsInB1YmxpYy9qcy9pbmRleC5qcyIsInB1YmxpYy9qcy9zcmMvY29sb3JzLmpzIiwicHVibGljL2pzL3NyYy9maWx0ZXJzLmpzIiwicHVibGljL2pzL3NyYy9mb250cy5qcyIsInB1YmxpYy9qcy9zcmMvZ2V0U3RyZWFtLmpzIiwicHVibGljL3RlbXBsYXRlcy9hcnQuaGJzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEdBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25KQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xuLypnbG9iYWxzIEhhbmRsZWJhcnM6IHRydWUgKi9cbnZhciBiYXNlID0gcmVxdWlyZShcIi4vaGFuZGxlYmFycy9iYXNlXCIpO1xuXG4vLyBFYWNoIG9mIHRoZXNlIGF1Z21lbnQgdGhlIEhhbmRsZWJhcnMgb2JqZWN0LiBObyBuZWVkIHRvIHNldHVwIGhlcmUuXG4vLyAoVGhpcyBpcyBkb25lIHRvIGVhc2lseSBzaGFyZSBjb2RlIGJldHdlZW4gY29tbW9uanMgYW5kIGJyb3dzZSBlbnZzKVxudmFyIFNhZmVTdHJpbmcgPSByZXF1aXJlKFwiLi9oYW5kbGViYXJzL3NhZmUtc3RyaW5nXCIpW1wiZGVmYXVsdFwiXTtcbnZhciBFeGNlcHRpb24gPSByZXF1aXJlKFwiLi9oYW5kbGViYXJzL2V4Y2VwdGlvblwiKVtcImRlZmF1bHRcIl07XG52YXIgVXRpbHMgPSByZXF1aXJlKFwiLi9oYW5kbGViYXJzL3V0aWxzXCIpO1xudmFyIHJ1bnRpbWUgPSByZXF1aXJlKFwiLi9oYW5kbGViYXJzL3J1bnRpbWVcIik7XG5cbi8vIEZvciBjb21wYXRpYmlsaXR5IGFuZCB1c2FnZSBvdXRzaWRlIG9mIG1vZHVsZSBzeXN0ZW1zLCBtYWtlIHRoZSBIYW5kbGViYXJzIG9iamVjdCBhIG5hbWVzcGFjZVxudmFyIGNyZWF0ZSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgaGIgPSBuZXcgYmFzZS5IYW5kbGViYXJzRW52aXJvbm1lbnQoKTtcblxuICBVdGlscy5leHRlbmQoaGIsIGJhc2UpO1xuICBoYi5TYWZlU3RyaW5nID0gU2FmZVN0cmluZztcbiAgaGIuRXhjZXB0aW9uID0gRXhjZXB0aW9uO1xuICBoYi5VdGlscyA9IFV0aWxzO1xuICBoYi5lc2NhcGVFeHByZXNzaW9uID0gVXRpbHMuZXNjYXBlRXhwcmVzc2lvbjtcblxuICBoYi5WTSA9IHJ1bnRpbWU7XG4gIGhiLnRlbXBsYXRlID0gZnVuY3Rpb24oc3BlYykge1xuICAgIHJldHVybiBydW50aW1lLnRlbXBsYXRlKHNwZWMsIGhiKTtcbiAgfTtcblxuICByZXR1cm4gaGI7XG59O1xuXG52YXIgSGFuZGxlYmFycyA9IGNyZWF0ZSgpO1xuSGFuZGxlYmFycy5jcmVhdGUgPSBjcmVhdGU7XG5cbi8qanNoaW50IC1XMDQwICovXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xudmFyIHJvb3QgPSB0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJyA/IGdsb2JhbCA6IHdpbmRvdyxcbiAgICAkSGFuZGxlYmFycyA9IHJvb3QuSGFuZGxlYmFycztcbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5IYW5kbGViYXJzLm5vQ29uZmxpY3QgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHJvb3QuSGFuZGxlYmFycyA9PT0gSGFuZGxlYmFycykge1xuICAgIHJvb3QuSGFuZGxlYmFycyA9ICRIYW5kbGViYXJzO1xuICB9XG59O1xuXG5IYW5kbGViYXJzWydkZWZhdWx0J10gPSBIYW5kbGViYXJzO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IEhhbmRsZWJhcnM7IiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgVXRpbHMgPSByZXF1aXJlKFwiLi91dGlsc1wiKTtcbnZhciBFeGNlcHRpb24gPSByZXF1aXJlKFwiLi9leGNlcHRpb25cIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgVkVSU0lPTiA9IFwiMy4wLjBcIjtcbmV4cG9ydHMuVkVSU0lPTiA9IFZFUlNJT047dmFyIENPTVBJTEVSX1JFVklTSU9OID0gNjtcbmV4cG9ydHMuQ09NUElMRVJfUkVWSVNJT04gPSBDT01QSUxFUl9SRVZJU0lPTjtcbnZhciBSRVZJU0lPTl9DSEFOR0VTID0ge1xuICAxOiAnPD0gMS4wLnJjLjInLCAvLyAxLjAucmMuMiBpcyBhY3R1YWxseSByZXYyIGJ1dCBkb2Vzbid0IHJlcG9ydCBpdFxuICAyOiAnPT0gMS4wLjAtcmMuMycsXG4gIDM6ICc9PSAxLjAuMC1yYy40JyxcbiAgNDogJz09IDEueC54JyxcbiAgNTogJz09IDIuMC4wLWFscGhhLngnLFxuICA2OiAnPj0gMi4wLjAtYmV0YS4xJ1xufTtcbmV4cG9ydHMuUkVWSVNJT05fQ0hBTkdFUyA9IFJFVklTSU9OX0NIQU5HRVM7XG52YXIgaXNBcnJheSA9IFV0aWxzLmlzQXJyYXksXG4gICAgaXNGdW5jdGlvbiA9IFV0aWxzLmlzRnVuY3Rpb24sXG4gICAgdG9TdHJpbmcgPSBVdGlscy50b1N0cmluZyxcbiAgICBvYmplY3RUeXBlID0gJ1tvYmplY3QgT2JqZWN0XSc7XG5cbmZ1bmN0aW9uIEhhbmRsZWJhcnNFbnZpcm9ubWVudChoZWxwZXJzLCBwYXJ0aWFscykge1xuICB0aGlzLmhlbHBlcnMgPSBoZWxwZXJzIHx8IHt9O1xuICB0aGlzLnBhcnRpYWxzID0gcGFydGlhbHMgfHwge307XG5cbiAgcmVnaXN0ZXJEZWZhdWx0SGVscGVycyh0aGlzKTtcbn1cblxuZXhwb3J0cy5IYW5kbGViYXJzRW52aXJvbm1lbnQgPSBIYW5kbGViYXJzRW52aXJvbm1lbnQ7SGFuZGxlYmFyc0Vudmlyb25tZW50LnByb3RvdHlwZSA9IHtcbiAgY29uc3RydWN0b3I6IEhhbmRsZWJhcnNFbnZpcm9ubWVudCxcblxuICBsb2dnZXI6IGxvZ2dlcixcbiAgbG9nOiBsb2csXG5cbiAgcmVnaXN0ZXJIZWxwZXI6IGZ1bmN0aW9uKG5hbWUsIGZuKSB7XG4gICAgaWYgKHRvU3RyaW5nLmNhbGwobmFtZSkgPT09IG9iamVjdFR5cGUpIHtcbiAgICAgIGlmIChmbikgeyB0aHJvdyBuZXcgRXhjZXB0aW9uKCdBcmcgbm90IHN1cHBvcnRlZCB3aXRoIG11bHRpcGxlIGhlbHBlcnMnKTsgfVxuICAgICAgVXRpbHMuZXh0ZW5kKHRoaXMuaGVscGVycywgbmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaGVscGVyc1tuYW1lXSA9IGZuO1xuICAgIH1cbiAgfSxcbiAgdW5yZWdpc3RlckhlbHBlcjogZnVuY3Rpb24obmFtZSkge1xuICAgIGRlbGV0ZSB0aGlzLmhlbHBlcnNbbmFtZV07XG4gIH0sXG5cbiAgcmVnaXN0ZXJQYXJ0aWFsOiBmdW5jdGlvbihuYW1lLCBwYXJ0aWFsKSB7XG4gICAgaWYgKHRvU3RyaW5nLmNhbGwobmFtZSkgPT09IG9iamVjdFR5cGUpIHtcbiAgICAgIFV0aWxzLmV4dGVuZCh0aGlzLnBhcnRpYWxzLCAgbmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0eXBlb2YgcGFydGlhbCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbignQXR0ZW1wdGluZyB0byByZWdpc3RlciBhIHBhcnRpYWwgYXMgdW5kZWZpbmVkJyk7XG4gICAgICB9XG4gICAgICB0aGlzLnBhcnRpYWxzW25hbWVdID0gcGFydGlhbDtcbiAgICB9XG4gIH0sXG4gIHVucmVnaXN0ZXJQYXJ0aWFsOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgZGVsZXRlIHRoaXMucGFydGlhbHNbbmFtZV07XG4gIH1cbn07XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyRGVmYXVsdEhlbHBlcnMoaW5zdGFuY2UpIHtcbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2hlbHBlck1pc3NpbmcnLCBmdW5jdGlvbigvKiBbYXJncywgXW9wdGlvbnMgKi8pIHtcbiAgICBpZihhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAvLyBBIG1pc3NpbmcgZmllbGQgaW4gYSB7e2Zvb319IGNvbnN0dWN0LlxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gU29tZW9uZSBpcyBhY3R1YWxseSB0cnlpbmcgdG8gY2FsbCBzb21ldGhpbmcsIGJsb3cgdXAuXG4gICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiTWlzc2luZyBoZWxwZXI6ICdcIiArIGFyZ3VtZW50c1thcmd1bWVudHMubGVuZ3RoLTFdLm5hbWUgKyBcIidcIik7XG4gICAgfVxuICB9KTtcblxuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignYmxvY2tIZWxwZXJNaXNzaW5nJywgZnVuY3Rpb24oY29udGV4dCwgb3B0aW9ucykge1xuICAgIHZhciBpbnZlcnNlID0gb3B0aW9ucy5pbnZlcnNlLFxuICAgICAgICBmbiA9IG9wdGlvbnMuZm47XG5cbiAgICBpZihjb250ZXh0ID09PSB0cnVlKSB7XG4gICAgICByZXR1cm4gZm4odGhpcyk7XG4gICAgfSBlbHNlIGlmKGNvbnRleHQgPT09IGZhbHNlIHx8IGNvbnRleHQgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGludmVyc2UodGhpcyk7XG4gICAgfSBlbHNlIGlmIChpc0FycmF5KGNvbnRleHQpKSB7XG4gICAgICBpZihjb250ZXh0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgaWYgKG9wdGlvbnMuaWRzKSB7XG4gICAgICAgICAgb3B0aW9ucy5pZHMgPSBbb3B0aW9ucy5uYW1lXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpbnN0YW5jZS5oZWxwZXJzLmVhY2goY29udGV4dCwgb3B0aW9ucyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gaW52ZXJzZSh0aGlzKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKG9wdGlvbnMuZGF0YSAmJiBvcHRpb25zLmlkcykge1xuICAgICAgICB2YXIgZGF0YSA9IGNyZWF0ZUZyYW1lKG9wdGlvbnMuZGF0YSk7XG4gICAgICAgIGRhdGEuY29udGV4dFBhdGggPSBVdGlscy5hcHBlbmRDb250ZXh0UGF0aChvcHRpb25zLmRhdGEuY29udGV4dFBhdGgsIG9wdGlvbnMubmFtZSk7XG4gICAgICAgIG9wdGlvbnMgPSB7ZGF0YTogZGF0YX07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmbihjb250ZXh0LCBvcHRpb25zKTtcbiAgICB9XG4gIH0pO1xuXG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCdlYWNoJywgZnVuY3Rpb24oY29udGV4dCwgb3B0aW9ucykge1xuICAgIGlmICghb3B0aW9ucykge1xuICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbignTXVzdCBwYXNzIGl0ZXJhdG9yIHRvICNlYWNoJyk7XG4gICAgfVxuXG4gICAgdmFyIGZuID0gb3B0aW9ucy5mbiwgaW52ZXJzZSA9IG9wdGlvbnMuaW52ZXJzZTtcbiAgICB2YXIgaSA9IDAsIHJldCA9IFwiXCIsIGRhdGE7XG5cbiAgICB2YXIgY29udGV4dFBhdGg7XG4gICAgaWYgKG9wdGlvbnMuZGF0YSAmJiBvcHRpb25zLmlkcykge1xuICAgICAgY29udGV4dFBhdGggPSBVdGlscy5hcHBlbmRDb250ZXh0UGF0aChvcHRpb25zLmRhdGEuY29udGV4dFBhdGgsIG9wdGlvbnMuaWRzWzBdKSArICcuJztcbiAgICB9XG5cbiAgICBpZiAoaXNGdW5jdGlvbihjb250ZXh0KSkgeyBjb250ZXh0ID0gY29udGV4dC5jYWxsKHRoaXMpOyB9XG5cbiAgICBpZiAob3B0aW9ucy5kYXRhKSB7XG4gICAgICBkYXRhID0gY3JlYXRlRnJhbWUob3B0aW9ucy5kYXRhKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBleGVjSXRlcmF0aW9uKGtleSwgaSwgbGFzdCkge1xuICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgZGF0YS5rZXkgPSBrZXk7XG4gICAgICAgIGRhdGEuaW5kZXggPSBpO1xuICAgICAgICBkYXRhLmZpcnN0ID0gaSA9PT0gMDtcbiAgICAgICAgZGF0YS5sYXN0ICA9ICEhbGFzdDtcblxuICAgICAgICBpZiAoY29udGV4dFBhdGgpIHtcbiAgICAgICAgICBkYXRhLmNvbnRleHRQYXRoID0gY29udGV4dFBhdGggKyBrZXk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0ID0gcmV0ICsgZm4oY29udGV4dFtrZXldLCB7XG4gICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgIGJsb2NrUGFyYW1zOiBVdGlscy5ibG9ja1BhcmFtcyhbY29udGV4dFtrZXldLCBrZXldLCBbY29udGV4dFBhdGggKyBrZXksIG51bGxdKVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYoY29udGV4dCAmJiB0eXBlb2YgY29udGV4dCA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGlmIChpc0FycmF5KGNvbnRleHQpKSB7XG4gICAgICAgIGZvcih2YXIgaiA9IGNvbnRleHQubGVuZ3RoOyBpPGo7IGkrKykge1xuICAgICAgICAgIGV4ZWNJdGVyYXRpb24oaSwgaSwgaSA9PT0gY29udGV4dC5sZW5ndGgtMSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBwcmlvcktleTtcblxuICAgICAgICBmb3IodmFyIGtleSBpbiBjb250ZXh0KSB7XG4gICAgICAgICAgaWYoY29udGV4dC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAvLyBXZSdyZSBydW5uaW5nIHRoZSBpdGVyYXRpb25zIG9uZSBzdGVwIG91dCBvZiBzeW5jIHNvIHdlIGNhbiBkZXRlY3RcbiAgICAgICAgICAgIC8vIHRoZSBsYXN0IGl0ZXJhdGlvbiB3aXRob3V0IGhhdmUgdG8gc2NhbiB0aGUgb2JqZWN0IHR3aWNlIGFuZCBjcmVhdGVcbiAgICAgICAgICAgIC8vIGFuIGl0ZXJtZWRpYXRlIGtleXMgYXJyYXkuIFxuICAgICAgICAgICAgaWYgKHByaW9yS2V5KSB7XG4gICAgICAgICAgICAgIGV4ZWNJdGVyYXRpb24ocHJpb3JLZXksIGktMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwcmlvcktleSA9IGtleTtcbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByaW9yS2V5KSB7XG4gICAgICAgICAgZXhlY0l0ZXJhdGlvbihwcmlvcktleSwgaS0xLCB0cnVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmKGkgPT09IDApe1xuICAgICAgcmV0ID0gaW52ZXJzZSh0aGlzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmV0O1xuICB9KTtcblxuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignaWYnLCBmdW5jdGlvbihjb25kaXRpb25hbCwgb3B0aW9ucykge1xuICAgIGlmIChpc0Z1bmN0aW9uKGNvbmRpdGlvbmFsKSkgeyBjb25kaXRpb25hbCA9IGNvbmRpdGlvbmFsLmNhbGwodGhpcyk7IH1cblxuICAgIC8vIERlZmF1bHQgYmVoYXZpb3IgaXMgdG8gcmVuZGVyIHRoZSBwb3NpdGl2ZSBwYXRoIGlmIHRoZSB2YWx1ZSBpcyB0cnV0aHkgYW5kIG5vdCBlbXB0eS5cbiAgICAvLyBUaGUgYGluY2x1ZGVaZXJvYCBvcHRpb24gbWF5IGJlIHNldCB0byB0cmVhdCB0aGUgY29uZHRpb25hbCBhcyBwdXJlbHkgbm90IGVtcHR5IGJhc2VkIG9uIHRoZVxuICAgIC8vIGJlaGF2aW9yIG9mIGlzRW1wdHkuIEVmZmVjdGl2ZWx5IHRoaXMgZGV0ZXJtaW5lcyBpZiAwIGlzIGhhbmRsZWQgYnkgdGhlIHBvc2l0aXZlIHBhdGggb3IgbmVnYXRpdmUuXG4gICAgaWYgKCghb3B0aW9ucy5oYXNoLmluY2x1ZGVaZXJvICYmICFjb25kaXRpb25hbCkgfHwgVXRpbHMuaXNFbXB0eShjb25kaXRpb25hbCkpIHtcbiAgICAgIHJldHVybiBvcHRpb25zLmludmVyc2UodGhpcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBvcHRpb25zLmZuKHRoaXMpO1xuICAgIH1cbiAgfSk7XG5cbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ3VubGVzcycsIGZ1bmN0aW9uKGNvbmRpdGlvbmFsLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIGluc3RhbmNlLmhlbHBlcnNbJ2lmJ10uY2FsbCh0aGlzLCBjb25kaXRpb25hbCwge2ZuOiBvcHRpb25zLmludmVyc2UsIGludmVyc2U6IG9wdGlvbnMuZm4sIGhhc2g6IG9wdGlvbnMuaGFzaH0pO1xuICB9KTtcblxuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignd2l0aCcsIGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICBpZiAoaXNGdW5jdGlvbihjb250ZXh0KSkgeyBjb250ZXh0ID0gY29udGV4dC5jYWxsKHRoaXMpOyB9XG5cbiAgICB2YXIgZm4gPSBvcHRpb25zLmZuO1xuXG4gICAgaWYgKCFVdGlscy5pc0VtcHR5KGNvbnRleHQpKSB7XG4gICAgICBpZiAob3B0aW9ucy5kYXRhICYmIG9wdGlvbnMuaWRzKSB7XG4gICAgICAgIHZhciBkYXRhID0gY3JlYXRlRnJhbWUob3B0aW9ucy5kYXRhKTtcbiAgICAgICAgZGF0YS5jb250ZXh0UGF0aCA9IFV0aWxzLmFwcGVuZENvbnRleHRQYXRoKG9wdGlvbnMuZGF0YS5jb250ZXh0UGF0aCwgb3B0aW9ucy5pZHNbMF0pO1xuICAgICAgICBvcHRpb25zID0ge2RhdGE6ZGF0YX07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmbihjb250ZXh0LCBvcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG9wdGlvbnMuaW52ZXJzZSh0aGlzKTtcbiAgICB9XG4gIH0pO1xuXG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCdsb2cnLCBmdW5jdGlvbihtZXNzYWdlLCBvcHRpb25zKSB7XG4gICAgdmFyIGxldmVsID0gb3B0aW9ucy5kYXRhICYmIG9wdGlvbnMuZGF0YS5sZXZlbCAhPSBudWxsID8gcGFyc2VJbnQob3B0aW9ucy5kYXRhLmxldmVsLCAxMCkgOiAxO1xuICAgIGluc3RhbmNlLmxvZyhsZXZlbCwgbWVzc2FnZSk7XG4gIH0pO1xuXG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCdsb29rdXAnLCBmdW5jdGlvbihvYmosIGZpZWxkKSB7XG4gICAgcmV0dXJuIG9iaiAmJiBvYmpbZmllbGRdO1xuICB9KTtcbn1cblxudmFyIGxvZ2dlciA9IHtcbiAgbWV0aG9kTWFwOiB7IDA6ICdkZWJ1ZycsIDE6ICdpbmZvJywgMjogJ3dhcm4nLCAzOiAnZXJyb3InIH0sXG5cbiAgLy8gU3RhdGUgZW51bVxuICBERUJVRzogMCxcbiAgSU5GTzogMSxcbiAgV0FSTjogMixcbiAgRVJST1I6IDMsXG4gIGxldmVsOiAxLFxuXG4gIC8vIENhbiBiZSBvdmVycmlkZGVuIGluIHRoZSBob3N0IGVudmlyb25tZW50XG4gIGxvZzogZnVuY3Rpb24obGV2ZWwsIG1lc3NhZ2UpIHtcbiAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnICYmIGxvZ2dlci5sZXZlbCA8PSBsZXZlbCkge1xuICAgICAgdmFyIG1ldGhvZCA9IGxvZ2dlci5tZXRob2RNYXBbbGV2ZWxdO1xuICAgICAgKGNvbnNvbGVbbWV0aG9kXSB8fCBjb25zb2xlLmxvZykuY2FsbChjb25zb2xlLCBtZXNzYWdlKTtcbiAgICB9XG4gIH1cbn07XG5leHBvcnRzLmxvZ2dlciA9IGxvZ2dlcjtcbnZhciBsb2cgPSBsb2dnZXIubG9nO1xuZXhwb3J0cy5sb2cgPSBsb2c7XG52YXIgY3JlYXRlRnJhbWUgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgdmFyIGZyYW1lID0gVXRpbHMuZXh0ZW5kKHt9LCBvYmplY3QpO1xuICBmcmFtZS5fcGFyZW50ID0gb2JqZWN0O1xuICByZXR1cm4gZnJhbWU7XG59O1xuZXhwb3J0cy5jcmVhdGVGcmFtZSA9IGNyZWF0ZUZyYW1lOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgZXJyb3JQcm9wcyA9IFsnZGVzY3JpcHRpb24nLCAnZmlsZU5hbWUnLCAnbGluZU51bWJlcicsICdtZXNzYWdlJywgJ25hbWUnLCAnbnVtYmVyJywgJ3N0YWNrJ107XG5cbmZ1bmN0aW9uIEV4Y2VwdGlvbihtZXNzYWdlLCBub2RlKSB7XG4gIHZhciBsb2MgPSBub2RlICYmIG5vZGUubG9jLFxuICAgICAgbGluZSxcbiAgICAgIGNvbHVtbjtcbiAgaWYgKGxvYykge1xuICAgIGxpbmUgPSBsb2Muc3RhcnQubGluZTtcbiAgICBjb2x1bW4gPSBsb2Muc3RhcnQuY29sdW1uO1xuXG4gICAgbWVzc2FnZSArPSAnIC0gJyArIGxpbmUgKyAnOicgKyBjb2x1bW47XG4gIH1cblxuICB2YXIgdG1wID0gRXJyb3IucHJvdG90eXBlLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgbWVzc2FnZSk7XG5cbiAgLy8gVW5mb3J0dW5hdGVseSBlcnJvcnMgYXJlIG5vdCBlbnVtZXJhYmxlIGluIENocm9tZSAoYXQgbGVhc3QpLCBzbyBgZm9yIHByb3AgaW4gdG1wYCBkb2Vzbid0IHdvcmsuXG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGVycm9yUHJvcHMubGVuZ3RoOyBpZHgrKykge1xuICAgIHRoaXNbZXJyb3JQcm9wc1tpZHhdXSA9IHRtcFtlcnJvclByb3BzW2lkeF1dO1xuICB9XG5cbiAgaWYgKGxvYykge1xuICAgIHRoaXMubGluZU51bWJlciA9IGxpbmU7XG4gICAgdGhpcy5jb2x1bW4gPSBjb2x1bW47XG4gIH1cbn1cblxuRXhjZXB0aW9uLnByb3RvdHlwZSA9IG5ldyBFcnJvcigpO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IEV4Y2VwdGlvbjsiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBVdGlscyA9IHJlcXVpcmUoXCIuL3V0aWxzXCIpO1xudmFyIEV4Y2VwdGlvbiA9IHJlcXVpcmUoXCIuL2V4Y2VwdGlvblwiKVtcImRlZmF1bHRcIl07XG52YXIgQ09NUElMRVJfUkVWSVNJT04gPSByZXF1aXJlKFwiLi9iYXNlXCIpLkNPTVBJTEVSX1JFVklTSU9OO1xudmFyIFJFVklTSU9OX0NIQU5HRVMgPSByZXF1aXJlKFwiLi9iYXNlXCIpLlJFVklTSU9OX0NIQU5HRVM7XG52YXIgY3JlYXRlRnJhbWUgPSByZXF1aXJlKFwiLi9iYXNlXCIpLmNyZWF0ZUZyYW1lO1xuXG5mdW5jdGlvbiBjaGVja1JldmlzaW9uKGNvbXBpbGVySW5mbykge1xuICB2YXIgY29tcGlsZXJSZXZpc2lvbiA9IGNvbXBpbGVySW5mbyAmJiBjb21waWxlckluZm9bMF0gfHwgMSxcbiAgICAgIGN1cnJlbnRSZXZpc2lvbiA9IENPTVBJTEVSX1JFVklTSU9OO1xuXG4gIGlmIChjb21waWxlclJldmlzaW9uICE9PSBjdXJyZW50UmV2aXNpb24pIHtcbiAgICBpZiAoY29tcGlsZXJSZXZpc2lvbiA8IGN1cnJlbnRSZXZpc2lvbikge1xuICAgICAgdmFyIHJ1bnRpbWVWZXJzaW9ucyA9IFJFVklTSU9OX0NIQU5HRVNbY3VycmVudFJldmlzaW9uXSxcbiAgICAgICAgICBjb21waWxlclZlcnNpb25zID0gUkVWSVNJT05fQ0hBTkdFU1tjb21waWxlclJldmlzaW9uXTtcbiAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJUZW1wbGF0ZSB3YXMgcHJlY29tcGlsZWQgd2l0aCBhbiBvbGRlciB2ZXJzaW9uIG9mIEhhbmRsZWJhcnMgdGhhbiB0aGUgY3VycmVudCBydW50aW1lLiBcIitcbiAgICAgICAgICAgIFwiUGxlYXNlIHVwZGF0ZSB5b3VyIHByZWNvbXBpbGVyIHRvIGEgbmV3ZXIgdmVyc2lvbiAoXCIrcnVudGltZVZlcnNpb25zK1wiKSBvciBkb3duZ3JhZGUgeW91ciBydW50aW1lIHRvIGFuIG9sZGVyIHZlcnNpb24gKFwiK2NvbXBpbGVyVmVyc2lvbnMrXCIpLlwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVXNlIHRoZSBlbWJlZGRlZCB2ZXJzaW9uIGluZm8gc2luY2UgdGhlIHJ1bnRpbWUgZG9lc24ndCBrbm93IGFib3V0IHRoaXMgcmV2aXNpb24geWV0XG4gICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiVGVtcGxhdGUgd2FzIHByZWNvbXBpbGVkIHdpdGggYSBuZXdlciB2ZXJzaW9uIG9mIEhhbmRsZWJhcnMgdGhhbiB0aGUgY3VycmVudCBydW50aW1lLiBcIitcbiAgICAgICAgICAgIFwiUGxlYXNlIHVwZGF0ZSB5b3VyIHJ1bnRpbWUgdG8gYSBuZXdlciB2ZXJzaW9uIChcIitjb21waWxlckluZm9bMV0rXCIpLlwiKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0cy5jaGVja1JldmlzaW9uID0gY2hlY2tSZXZpc2lvbjsvLyBUT0RPOiBSZW1vdmUgdGhpcyBsaW5lIGFuZCBicmVhayB1cCBjb21waWxlUGFydGlhbFxuXG5mdW5jdGlvbiB0ZW1wbGF0ZSh0ZW1wbGF0ZVNwZWMsIGVudikge1xuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICBpZiAoIWVudikge1xuICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJObyBlbnZpcm9ubWVudCBwYXNzZWQgdG8gdGVtcGxhdGVcIik7XG4gIH1cbiAgaWYgKCF0ZW1wbGF0ZVNwZWMgfHwgIXRlbXBsYXRlU3BlYy5tYWluKSB7XG4gICAgdGhyb3cgbmV3IEV4Y2VwdGlvbignVW5rbm93biB0ZW1wbGF0ZSBvYmplY3Q6ICcgKyB0eXBlb2YgdGVtcGxhdGVTcGVjKTtcbiAgfVxuXG4gIC8vIE5vdGU6IFVzaW5nIGVudi5WTSByZWZlcmVuY2VzIHJhdGhlciB0aGFuIGxvY2FsIHZhciByZWZlcmVuY2VzIHRocm91Z2hvdXQgdGhpcyBzZWN0aW9uIHRvIGFsbG93XG4gIC8vIGZvciBleHRlcm5hbCB1c2VycyB0byBvdmVycmlkZSB0aGVzZSBhcyBwc3VlZG8tc3VwcG9ydGVkIEFQSXMuXG4gIGVudi5WTS5jaGVja1JldmlzaW9uKHRlbXBsYXRlU3BlYy5jb21waWxlcik7XG5cbiAgdmFyIGludm9rZVBhcnRpYWxXcmFwcGVyID0gZnVuY3Rpb24ocGFydGlhbCwgY29udGV4dCwgb3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zLmhhc2gpIHtcbiAgICAgIGNvbnRleHQgPSBVdGlscy5leHRlbmQoe30sIGNvbnRleHQsIG9wdGlvbnMuaGFzaCk7XG4gICAgfVxuXG4gICAgcGFydGlhbCA9IGVudi5WTS5yZXNvbHZlUGFydGlhbC5jYWxsKHRoaXMsIHBhcnRpYWwsIGNvbnRleHQsIG9wdGlvbnMpO1xuICAgIHZhciByZXN1bHQgPSBlbnYuVk0uaW52b2tlUGFydGlhbC5jYWxsKHRoaXMsIHBhcnRpYWwsIGNvbnRleHQsIG9wdGlvbnMpO1xuXG4gICAgaWYgKHJlc3VsdCA9PSBudWxsICYmIGVudi5jb21waWxlKSB7XG4gICAgICBvcHRpb25zLnBhcnRpYWxzW29wdGlvbnMubmFtZV0gPSBlbnYuY29tcGlsZShwYXJ0aWFsLCB0ZW1wbGF0ZVNwZWMuY29tcGlsZXJPcHRpb25zLCBlbnYpO1xuICAgICAgcmVzdWx0ID0gb3B0aW9ucy5wYXJ0aWFsc1tvcHRpb25zLm5hbWVdKGNvbnRleHQsIG9wdGlvbnMpO1xuICAgIH1cbiAgICBpZiAocmVzdWx0ICE9IG51bGwpIHtcbiAgICAgIGlmIChvcHRpb25zLmluZGVudCkge1xuICAgICAgICB2YXIgbGluZXMgPSByZXN1bHQuc3BsaXQoJ1xcbicpO1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IGxpbmVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgIGlmICghbGluZXNbaV0gJiYgaSArIDEgPT09IGwpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGxpbmVzW2ldID0gb3B0aW9ucy5pbmRlbnQgKyBsaW5lc1tpXTtcbiAgICAgICAgfVxuICAgICAgICByZXN1bHQgPSBsaW5lcy5qb2luKCdcXG4nKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJUaGUgcGFydGlhbCBcIiArIG9wdGlvbnMubmFtZSArIFwiIGNvdWxkIG5vdCBiZSBjb21waWxlZCB3aGVuIHJ1bm5pbmcgaW4gcnVudGltZS1vbmx5IG1vZGVcIik7XG4gICAgfVxuICB9O1xuXG4gIC8vIEp1c3QgYWRkIHdhdGVyXG4gIHZhciBjb250YWluZXIgPSB7XG4gICAgc3RyaWN0OiBmdW5jdGlvbihvYmosIG5hbWUpIHtcbiAgICAgIGlmICghKG5hbWUgaW4gb2JqKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKCdcIicgKyBuYW1lICsgJ1wiIG5vdCBkZWZpbmVkIGluICcgKyBvYmopO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG9ialtuYW1lXTtcbiAgICB9LFxuICAgIGxvb2t1cDogZnVuY3Rpb24oZGVwdGhzLCBuYW1lKSB7XG4gICAgICB2YXIgbGVuID0gZGVwdGhzLmxlbmd0aDtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgaWYgKGRlcHRoc1tpXSAmJiBkZXB0aHNbaV1bbmFtZV0gIT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBkZXB0aHNbaV1bbmFtZV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIGxhbWJkYTogZnVuY3Rpb24oY3VycmVudCwgY29udGV4dCkge1xuICAgICAgcmV0dXJuIHR5cGVvZiBjdXJyZW50ID09PSAnZnVuY3Rpb24nID8gY3VycmVudC5jYWxsKGNvbnRleHQpIDogY3VycmVudDtcbiAgICB9LFxuXG4gICAgZXNjYXBlRXhwcmVzc2lvbjogVXRpbHMuZXNjYXBlRXhwcmVzc2lvbixcbiAgICBpbnZva2VQYXJ0aWFsOiBpbnZva2VQYXJ0aWFsV3JhcHBlcixcblxuICAgIGZuOiBmdW5jdGlvbihpKSB7XG4gICAgICByZXR1cm4gdGVtcGxhdGVTcGVjW2ldO1xuICAgIH0sXG5cbiAgICBwcm9ncmFtczogW10sXG4gICAgcHJvZ3JhbTogZnVuY3Rpb24oaSwgZGF0YSwgZGVjbGFyZWRCbG9ja1BhcmFtcywgYmxvY2tQYXJhbXMsIGRlcHRocykge1xuICAgICAgdmFyIHByb2dyYW1XcmFwcGVyID0gdGhpcy5wcm9ncmFtc1tpXSxcbiAgICAgICAgICBmbiA9IHRoaXMuZm4oaSk7XG4gICAgICBpZiAoZGF0YSB8fCBkZXB0aHMgfHwgYmxvY2tQYXJhbXMgfHwgZGVjbGFyZWRCbG9ja1BhcmFtcykge1xuICAgICAgICBwcm9ncmFtV3JhcHBlciA9IHByb2dyYW0odGhpcywgaSwgZm4sIGRhdGEsIGRlY2xhcmVkQmxvY2tQYXJhbXMsIGJsb2NrUGFyYW1zLCBkZXB0aHMpO1xuICAgICAgfSBlbHNlIGlmICghcHJvZ3JhbVdyYXBwZXIpIHtcbiAgICAgICAgcHJvZ3JhbVdyYXBwZXIgPSB0aGlzLnByb2dyYW1zW2ldID0gcHJvZ3JhbSh0aGlzLCBpLCBmbik7XG4gICAgICB9XG4gICAgICByZXR1cm4gcHJvZ3JhbVdyYXBwZXI7XG4gICAgfSxcblxuICAgIGRhdGE6IGZ1bmN0aW9uKGRhdGEsIGRlcHRoKSB7XG4gICAgICB3aGlsZSAoZGF0YSAmJiBkZXB0aC0tKSB7XG4gICAgICAgIGRhdGEgPSBkYXRhLl9wYXJlbnQ7XG4gICAgICB9XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9LFxuICAgIG1lcmdlOiBmdW5jdGlvbihwYXJhbSwgY29tbW9uKSB7XG4gICAgICB2YXIgcmV0ID0gcGFyYW0gfHwgY29tbW9uO1xuXG4gICAgICBpZiAocGFyYW0gJiYgY29tbW9uICYmIChwYXJhbSAhPT0gY29tbW9uKSkge1xuICAgICAgICByZXQgPSBVdGlscy5leHRlbmQoe30sIGNvbW1vbiwgcGFyYW0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmV0O1xuICAgIH0sXG5cbiAgICBub29wOiBlbnYuVk0ubm9vcCxcbiAgICBjb21waWxlckluZm86IHRlbXBsYXRlU3BlYy5jb21waWxlclxuICB9O1xuXG4gIHZhciByZXQgPSBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgdmFyIGRhdGEgPSBvcHRpb25zLmRhdGE7XG5cbiAgICByZXQuX3NldHVwKG9wdGlvbnMpO1xuICAgIGlmICghb3B0aW9ucy5wYXJ0aWFsICYmIHRlbXBsYXRlU3BlYy51c2VEYXRhKSB7XG4gICAgICBkYXRhID0gaW5pdERhdGEoY29udGV4dCwgZGF0YSk7XG4gICAgfVxuICAgIHZhciBkZXB0aHMsXG4gICAgICAgIGJsb2NrUGFyYW1zID0gdGVtcGxhdGVTcGVjLnVzZUJsb2NrUGFyYW1zID8gW10gOiB1bmRlZmluZWQ7XG4gICAgaWYgKHRlbXBsYXRlU3BlYy51c2VEZXB0aHMpIHtcbiAgICAgIGRlcHRocyA9IG9wdGlvbnMuZGVwdGhzID8gW2NvbnRleHRdLmNvbmNhdChvcHRpb25zLmRlcHRocykgOiBbY29udGV4dF07XG4gICAgfVxuXG4gICAgcmV0dXJuIHRlbXBsYXRlU3BlYy5tYWluLmNhbGwoY29udGFpbmVyLCBjb250ZXh0LCBjb250YWluZXIuaGVscGVycywgY29udGFpbmVyLnBhcnRpYWxzLCBkYXRhLCBibG9ja1BhcmFtcywgZGVwdGhzKTtcbiAgfTtcbiAgcmV0LmlzVG9wID0gdHJ1ZTtcblxuICByZXQuX3NldHVwID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIGlmICghb3B0aW9ucy5wYXJ0aWFsKSB7XG4gICAgICBjb250YWluZXIuaGVscGVycyA9IGNvbnRhaW5lci5tZXJnZShvcHRpb25zLmhlbHBlcnMsIGVudi5oZWxwZXJzKTtcblxuICAgICAgaWYgKHRlbXBsYXRlU3BlYy51c2VQYXJ0aWFsKSB7XG4gICAgICAgIGNvbnRhaW5lci5wYXJ0aWFscyA9IGNvbnRhaW5lci5tZXJnZShvcHRpb25zLnBhcnRpYWxzLCBlbnYucGFydGlhbHMpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb250YWluZXIuaGVscGVycyA9IG9wdGlvbnMuaGVscGVycztcbiAgICAgIGNvbnRhaW5lci5wYXJ0aWFscyA9IG9wdGlvbnMucGFydGlhbHM7XG4gICAgfVxuICB9O1xuXG4gIHJldC5fY2hpbGQgPSBmdW5jdGlvbihpLCBkYXRhLCBibG9ja1BhcmFtcywgZGVwdGhzKSB7XG4gICAgaWYgKHRlbXBsYXRlU3BlYy51c2VCbG9ja1BhcmFtcyAmJiAhYmxvY2tQYXJhbXMpIHtcbiAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oJ211c3QgcGFzcyBibG9jayBwYXJhbXMnKTtcbiAgICB9XG4gICAgaWYgKHRlbXBsYXRlU3BlYy51c2VEZXB0aHMgJiYgIWRlcHRocykge1xuICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbignbXVzdCBwYXNzIHBhcmVudCBkZXB0aHMnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcHJvZ3JhbShjb250YWluZXIsIGksIHRlbXBsYXRlU3BlY1tpXSwgZGF0YSwgMCwgYmxvY2tQYXJhbXMsIGRlcHRocyk7XG4gIH07XG4gIHJldHVybiByZXQ7XG59XG5cbmV4cG9ydHMudGVtcGxhdGUgPSB0ZW1wbGF0ZTtmdW5jdGlvbiBwcm9ncmFtKGNvbnRhaW5lciwgaSwgZm4sIGRhdGEsIGRlY2xhcmVkQmxvY2tQYXJhbXMsIGJsb2NrUGFyYW1zLCBkZXB0aHMpIHtcbiAgdmFyIHByb2cgPSBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICByZXR1cm4gZm4uY2FsbChjb250YWluZXIsXG4gICAgICAgIGNvbnRleHQsXG4gICAgICAgIGNvbnRhaW5lci5oZWxwZXJzLCBjb250YWluZXIucGFydGlhbHMsXG4gICAgICAgIG9wdGlvbnMuZGF0YSB8fCBkYXRhLFxuICAgICAgICBibG9ja1BhcmFtcyAmJiBbb3B0aW9ucy5ibG9ja1BhcmFtc10uY29uY2F0KGJsb2NrUGFyYW1zKSxcbiAgICAgICAgZGVwdGhzICYmIFtjb250ZXh0XS5jb25jYXQoZGVwdGhzKSk7XG4gIH07XG4gIHByb2cucHJvZ3JhbSA9IGk7XG4gIHByb2cuZGVwdGggPSBkZXB0aHMgPyBkZXB0aHMubGVuZ3RoIDogMDtcbiAgcHJvZy5ibG9ja1BhcmFtcyA9IGRlY2xhcmVkQmxvY2tQYXJhbXMgfHwgMDtcbiAgcmV0dXJuIHByb2c7XG59XG5cbmV4cG9ydHMucHJvZ3JhbSA9IHByb2dyYW07ZnVuY3Rpb24gcmVzb2x2ZVBhcnRpYWwocGFydGlhbCwgY29udGV4dCwgb3B0aW9ucykge1xuICBpZiAoIXBhcnRpYWwpIHtcbiAgICBwYXJ0aWFsID0gb3B0aW9ucy5wYXJ0aWFsc1tvcHRpb25zLm5hbWVdO1xuICB9IGVsc2UgaWYgKCFwYXJ0aWFsLmNhbGwgJiYgIW9wdGlvbnMubmFtZSkge1xuICAgIC8vIFRoaXMgaXMgYSBkeW5hbWljIHBhcnRpYWwgdGhhdCByZXR1cm5lZCBhIHN0cmluZ1xuICAgIG9wdGlvbnMubmFtZSA9IHBhcnRpYWw7XG4gICAgcGFydGlhbCA9IG9wdGlvbnMucGFydGlhbHNbcGFydGlhbF07XG4gIH1cbiAgcmV0dXJuIHBhcnRpYWw7XG59XG5cbmV4cG9ydHMucmVzb2x2ZVBhcnRpYWwgPSByZXNvbHZlUGFydGlhbDtmdW5jdGlvbiBpbnZva2VQYXJ0aWFsKHBhcnRpYWwsIGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucy5wYXJ0aWFsID0gdHJ1ZTtcblxuICBpZihwYXJ0aWFsID09PSB1bmRlZmluZWQpIHtcbiAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiVGhlIHBhcnRpYWwgXCIgKyBvcHRpb25zLm5hbWUgKyBcIiBjb3VsZCBub3QgYmUgZm91bmRcIik7XG4gIH0gZWxzZSBpZihwYXJ0aWFsIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICByZXR1cm4gcGFydGlhbChjb250ZXh0LCBvcHRpb25zKTtcbiAgfVxufVxuXG5leHBvcnRzLmludm9rZVBhcnRpYWwgPSBpbnZva2VQYXJ0aWFsO2Z1bmN0aW9uIG5vb3AoKSB7IHJldHVybiBcIlwiOyB9XG5cbmV4cG9ydHMubm9vcCA9IG5vb3A7ZnVuY3Rpb24gaW5pdERhdGEoY29udGV4dCwgZGF0YSkge1xuICBpZiAoIWRhdGEgfHwgISgncm9vdCcgaW4gZGF0YSkpIHtcbiAgICBkYXRhID0gZGF0YSA/IGNyZWF0ZUZyYW1lKGRhdGEpIDoge307XG4gICAgZGF0YS5yb290ID0gY29udGV4dDtcbiAgfVxuICByZXR1cm4gZGF0YTtcbn0iLCJcInVzZSBzdHJpY3RcIjtcbi8vIEJ1aWxkIG91dCBvdXIgYmFzaWMgU2FmZVN0cmluZyB0eXBlXG5mdW5jdGlvbiBTYWZlU3RyaW5nKHN0cmluZykge1xuICB0aGlzLnN0cmluZyA9IHN0cmluZztcbn1cblxuU2FmZVN0cmluZy5wcm90b3R5cGUudG9TdHJpbmcgPSBTYWZlU3RyaW5nLnByb3RvdHlwZS50b0hUTUwgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIFwiXCIgKyB0aGlzLnN0cmluZztcbn07XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gU2FmZVN0cmluZzsiLCJcInVzZSBzdHJpY3RcIjtcbi8qanNoaW50IC1XMDA0ICovXG52YXIgZXNjYXBlID0ge1xuICBcIiZcIjogXCImYW1wO1wiLFxuICBcIjxcIjogXCImbHQ7XCIsXG4gIFwiPlwiOiBcIiZndDtcIixcbiAgJ1wiJzogXCImcXVvdDtcIixcbiAgXCInXCI6IFwiJiN4Mjc7XCIsXG4gIFwiYFwiOiBcIiYjeDYwO1wiXG59O1xuXG52YXIgYmFkQ2hhcnMgPSAvWyY8PlwiJ2BdL2c7XG52YXIgcG9zc2libGUgPSAvWyY8PlwiJ2BdLztcblxuZnVuY3Rpb24gZXNjYXBlQ2hhcihjaHIpIHtcbiAgcmV0dXJuIGVzY2FwZVtjaHJdO1xufVxuXG5mdW5jdGlvbiBleHRlbmQob2JqIC8qICwgLi4uc291cmNlICovKSB7XG4gIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgZm9yICh2YXIga2V5IGluIGFyZ3VtZW50c1tpXSkge1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChhcmd1bWVudHNbaV0sIGtleSkpIHtcbiAgICAgICAgb2JqW2tleV0gPSBhcmd1bWVudHNbaV1ba2V5XTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gb2JqO1xufVxuXG5leHBvcnRzLmV4dGVuZCA9IGV4dGVuZDt2YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuZXhwb3J0cy50b1N0cmluZyA9IHRvU3RyaW5nO1xuLy8gU291cmNlZCBmcm9tIGxvZGFzaFxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2Jlc3RpZWpzL2xvZGFzaC9ibG9iL21hc3Rlci9MSUNFTlNFLnR4dFxudmFyIGlzRnVuY3Rpb24gPSBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nO1xufTtcbi8vIGZhbGxiYWNrIGZvciBvbGRlciB2ZXJzaW9ucyBvZiBDaHJvbWUgYW5kIFNhZmFyaVxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbmlmIChpc0Z1bmN0aW9uKC94LykpIHtcbiAgaXNGdW5jdGlvbiA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbiAgfTtcbn1cbnZhciBpc0Z1bmN0aW9uO1xuZXhwb3J0cy5pc0Z1bmN0aW9uID0gaXNGdW5jdGlvbjtcbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSA/IHRvU3RyaW5nLmNhbGwodmFsdWUpID09PSAnW29iamVjdCBBcnJheV0nIDogZmFsc2U7XG59O1xuZXhwb3J0cy5pc0FycmF5ID0gaXNBcnJheTtcbi8vIE9sZGVyIElFIHZlcnNpb25zIGRvIG5vdCBkaXJlY3RseSBzdXBwb3J0IGluZGV4T2Ygc28gd2UgbXVzdCBpbXBsZW1lbnQgb3VyIG93biwgc2FkbHkuXG5mdW5jdGlvbiBpbmRleE9mKGFycmF5LCB2YWx1ZSkge1xuICBmb3IgKHZhciBpID0gMCwgbGVuID0gYXJyYXkubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBpZiAoYXJyYXlbaV0gPT09IHZhbHVlKSB7XG4gICAgICByZXR1cm4gaTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIC0xO1xufVxuXG5leHBvcnRzLmluZGV4T2YgPSBpbmRleE9mO1xuZnVuY3Rpb24gZXNjYXBlRXhwcmVzc2lvbihzdHJpbmcpIHtcbiAgLy8gZG9uJ3QgZXNjYXBlIFNhZmVTdHJpbmdzLCBzaW5jZSB0aGV5J3JlIGFscmVhZHkgc2FmZVxuICBpZiAoc3RyaW5nICYmIHN0cmluZy50b0hUTUwpIHtcbiAgICByZXR1cm4gc3RyaW5nLnRvSFRNTCgpO1xuICB9IGVsc2UgaWYgKHN0cmluZyA9PSBudWxsKSB7XG4gICAgcmV0dXJuIFwiXCI7XG4gIH0gZWxzZSBpZiAoIXN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcgKyAnJztcbiAgfVxuXG4gIC8vIEZvcmNlIGEgc3RyaW5nIGNvbnZlcnNpb24gYXMgdGhpcyB3aWxsIGJlIGRvbmUgYnkgdGhlIGFwcGVuZCByZWdhcmRsZXNzIGFuZFxuICAvLyB0aGUgcmVnZXggdGVzdCB3aWxsIGRvIHRoaXMgdHJhbnNwYXJlbnRseSBiZWhpbmQgdGhlIHNjZW5lcywgY2F1c2luZyBpc3N1ZXMgaWZcbiAgLy8gYW4gb2JqZWN0J3MgdG8gc3RyaW5nIGhhcyBlc2NhcGVkIGNoYXJhY3RlcnMgaW4gaXQuXG4gIHN0cmluZyA9IFwiXCIgKyBzdHJpbmc7XG5cbiAgaWYoIXBvc3NpYmxlLnRlc3Qoc3RyaW5nKSkgeyByZXR1cm4gc3RyaW5nOyB9XG4gIHJldHVybiBzdHJpbmcucmVwbGFjZShiYWRDaGFycywgZXNjYXBlQ2hhcik7XG59XG5cbmV4cG9ydHMuZXNjYXBlRXhwcmVzc2lvbiA9IGVzY2FwZUV4cHJlc3Npb247ZnVuY3Rpb24gaXNFbXB0eSh2YWx1ZSkge1xuICBpZiAoIXZhbHVlICYmIHZhbHVlICE9PSAwKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSBpZiAoaXNBcnJheSh2YWx1ZSkgJiYgdmFsdWUubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbmV4cG9ydHMuaXNFbXB0eSA9IGlzRW1wdHk7ZnVuY3Rpb24gYmxvY2tQYXJhbXMocGFyYW1zLCBpZHMpIHtcbiAgcGFyYW1zLnBhdGggPSBpZHM7XG4gIHJldHVybiBwYXJhbXM7XG59XG5cbmV4cG9ydHMuYmxvY2tQYXJhbXMgPSBibG9ja1BhcmFtcztmdW5jdGlvbiBhcHBlbmRDb250ZXh0UGF0aChjb250ZXh0UGF0aCwgaWQpIHtcbiAgcmV0dXJuIChjb250ZXh0UGF0aCA/IGNvbnRleHRQYXRoICsgJy4nIDogJycpICsgaWQ7XG59XG5cbmV4cG9ydHMuYXBwZW5kQ29udGV4dFBhdGggPSBhcHBlbmRDb250ZXh0UGF0aDsiLCIvLyBDcmVhdGUgYSBzaW1wbGUgcGF0aCBhbGlhcyB0byBhbGxvdyBicm93c2VyaWZ5IHRvIHJlc29sdmVcbi8vIHRoZSBydW50aW1lIG9uIGEgc3VwcG9ydGVkIHBhdGguXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vZGlzdC9janMvaGFuZGxlYmFycy5ydW50aW1lJykuZGVmYXVsdDtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGdldFN0cmVhbSA9IHJlcXVpcmUoJy4vc3JjL2dldFN0cmVhbScpO1xudmFyIGZvbnRzID0gcmVxdWlyZSgnLi9zcmMvZm9udHMnKTtcbnZhciBmaWx0ZXJzID0gcmVxdWlyZSgnLi9zcmMvZmlsdGVycycpO1xudmFyIGFydFRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2FydC5oYnMnKTtcbnZhciBtYWluRWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluJyk7XG5cbmZ1bmN0aW9uIGNoYW5nZUZpbHRlciAoZWwpIHtcbiAgdmFyIGZpbHRlciA9IGZpbHRlcnMucmFuZG9tRmlsdGVyKCk7XG4gIHZhciBpbWcgPSBlbC5xdWVyeVNlbGVjdG9yKCdpbWcnKTtcbiAgaW1nLnN0eWxlLmZpbHRlciA9IGZpbHRlcjtcbn1cblxuZnVuY3Rpb24gY2hhbmdlRm9udCAoZWwpIHtcbiAgdmFyIGZmID0gZm9udHMucmFuZG9tRm9udEZhbWlseSgpO1xuICBlbC5zdHlsZS5mb250RmFtaWx5ID0gZmY7XG59XG5cbmZ1bmN0aW9uIGNoYW5nZUNvbG9yIChlbCkge1xuICB2YXIgY29sb3IgPSBmb250cy5yYW5kb21Db2xvcigpO1xuICB2YXIgdGV4dEVsID0gZWwucXVlcnlTZWxlY3Rvcignc3BhbicpO1xuICB0ZXh0RWwuc3R5bGUuY29sb3IgPSBjb2xvcjtcbn1cblxuZnVuY3Rpb24gcmVuZGVyIChtb2RlbCkge1xuICBtb2RlbC5mb250RmFtaWx5ID0gZm9udHMucmFuZG9tRm9udEZhbWlseSgpO1xuICBtb2RlbC5maWx0ZXIgPSBmaWx0ZXJzLnJhbmRvbUZpbHRlcigpO1xuICBtb2RlbC5mb250Q29sb3IgPSBmb250cy5yYW5kb21Db2xvcigpO1xuICBtYWluRWxlbS5pbm5lckhUTUwgKz0gYXJ0VGVtcGxhdGUobW9kZWwpO1xufVxuXG5nZXRTdHJlYW0oZnVuY3Rpb24gKHRoaW5nKSB7XG4gIHJlbmRlcih0aGluZyk7XG59KTtcblxudmFyIGFydEVsZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmFydCcpO1xudmFyIGFydEFycmF5ID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJ0RWxlbXMpO1xuXG5hcnRBcnJheS5mb3JFYWNoKGZ1bmN0aW9uIChhcnQpIHtcbiAgYXJ0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgIGNoYW5nZUZvbnQoYXJ0KTtcbiAgICBjaGFuZ2VGaWx0ZXIoYXJ0KTtcbiAgICBjaGFuZ2VDb2xvcihhcnQpO1xuICB9KTtcbn0pO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBbXG4nYmxhY2snLFxuJ3NpbHZlcicsXG4nZ3JheScsXG4nd2hpdGUnLFxuJ21hcm9vbicsXG4ncmVkJyxcbidwdXJwbGUnLFxuJ2Z1Y2hzaWEnLFxuJ2dyZWVuJyxcbidsaW1lJyxcbidvbGl2ZScsXG4neWVsbG93JyxcbiduYXZ5JyxcbidibHVlJyxcbid0ZWFsJyxcbidhcXVhJyxcbidvcmFuZ2UnLFxuJ2FsaWNlYmx1ZScsXG4nYW50aXF1ZXdoaXRlJyxcbidhcXVhbWFyaW5lJyxcbidhenVyZScsXG4nYmVpZ2UnLFxuJ2Jpc3F1ZScsXG4nYmxhbmNoZWRhbG1vbmQnLFxuJ2JsdWV2aW9sZXQnLFxuJ2Jyb3duJyxcbididXJseXdvb2QnLFxuJ2NhZGV0Ymx1ZScsXG4nY2hhcnRyZXVzZScsXG4nY2hvY29sYXRlJyxcbidjb3JhbCcsXG4nY29ybmZsb3dlcmJsdWUnLFxuJ2Nvcm5zaWxrJyxcbidjcmltc29uJyxcbidkYXJrYmx1ZScsXG4nZGFya2N5YW4nLFxuJ2Rhcmtnb2xkZW5yb2QnLFxuJ2RhcmtncmF5JyxcbidkYXJrZ3JlZW4nLFxuJ2RhcmtncmV5JyxcbidkYXJra2hha2knLFxuJ2RhcmttYWdlbnRhJyxcbidkYXJrb2xpdmVncmVlbicsXG4nZGFya29yYW5nZScsXG4nZGFya29yY2hpZCcsXG4nZGFya3JlZCcsXG4nZGFya3NhbG1vbicsXG4nZGFya3NlYWdyZWVuJyxcbidkYXJrc2xhdGVibHVlJyxcbidkYXJrc2xhdGVncmF5JyxcbidkYXJrc2xhdGVncmV5JyxcbidkYXJrdHVycXVvaXNlJyxcbidkYXJrdmlvbGV0JyxcbidkZWVwcGluaycsXG4nZGVlcHNreWJsdWUnLFxuJ2RpbWdyYXknLFxuJ2RpbWdyZXknLFxuJ2RvZGdlcmJsdWUnLFxuJ2ZpcmVicmljaycsXG4nZmxvcmFsd2hpdGUnLFxuJ2ZvcmVzdGdyZWVuJyxcbidnYWluc2Jvcm8nLFxuJ2dob3N0d2hpdGUnLFxuJ2dvbGQnLFxuJ2dvbGRlbnJvZCcsXG4nZ3JlZW55ZWxsb3cnLFxuJ2dyZXknLFxuJ2hvbmV5ZGV3Jyxcbidob3RwaW5rJyxcbidpbmRpYW5yZWQnLFxuJ2luZGlnbycsXG4naXZvcnknLFxuJ2toYWtpJyxcbidsYXZlbmRlcicsXG4nbGF2ZW5kZXJibHVzaCcsXG4nbGF3bmdyZWVuJyxcbidsZW1vbmNoaWZmb24nLFxuJ2xpZ2h0Ymx1ZScsXG4nbGlnaHRjb3JhbCcsXG4nbGlnaHRjeWFuJyxcbidsaWdodGdvbGRlbnJvZHllbGxvdycsXG4nbGlnaHRncmF5JyxcbidsaWdodGdyZWVuJyxcbidsaWdodGdyZXknLFxuJ2xpZ2h0cGluaycsXG4nbGlnaHRzYWxtb24nLFxuJ2xpZ2h0c2VhZ3JlZW4nLFxuJ2xpZ2h0c2t5Ymx1ZScsXG4nbGlnaHRzbGF0ZWdyYXknLFxuJ2xpZ2h0c2xhdGVncmV5JyxcbidsaWdodHN0ZWVsYmx1ZScsXG4nbGlnaHR5ZWxsb3cnLFxuJ2xpbWVncmVlbicsXG4nbGluZW4nLFxuJ21lZGl1bWFxdWFtYXJpbmUnLFxuJ21lZGl1bWJsdWUnLFxuJ21lZGl1bW9yY2hpZCcsXG4nbWVkaXVtcHVycGxlJyxcbidtZWRpdW1zZWFncmVlbicsXG4nbWVkaXVtc2xhdGVibHVlJyxcbidtZWRpdW1zcHJpbmdncmVlbicsXG4nbWVkaXVtdHVycXVvaXNlJyxcbidtZWRpdW12aW9sZXRyZWQnLFxuJ21pZG5pZ2h0Ymx1ZScsXG4nbWludGNyZWFtJyxcbidtaXN0eXJvc2UnLFxuJ21vY2Nhc2luJyxcbiduYXZham93aGl0ZScsXG4nb2xkbGFjZScsXG4nb2xpdmVkcmFiJyxcbidvcmFuZ2VyZWQnLFxuJ29yY2hpZCcsXG4ncGFsZWdvbGRlbnJvZCcsXG4ncGFsZWdyZWVuJyxcbidwYWxldHVycXVvaXNlJyxcbidwYWxldmlvbGV0cmVkJyxcbidwYXBheWF3aGlwJyxcbidwZWFjaHB1ZmYnLFxuJ3BlcnUnLFxuJ3BpbmsnLFxuJ3BsdW0nLFxuJ3Bvd2RlcmJsdWUnLFxuJ3Jvc3licm93bicsXG4ncm95YWxibHVlJyxcbidzYWRkbGVicm93bicsXG4nc2FsbW9uJyxcbidzYW5keWJyb3duJyxcbidzZWFncmVlbicsXG4nc2Vhc2hlbGwnLFxuJ3NpZW5uYScsXG4nc2t5Ymx1ZScsXG4nc2xhdGVibHVlJyxcbidzbGF0ZWdyYXknLFxuJ3NsYXRlZ3JleScsXG4nc25vdycsXG4nc3ByaW5nZ3JlZW4nLFxuJ3N0ZWVsYmx1ZScsXG4ndGFuJyxcbid0aGlzdGxlJyxcbid0b21hdG8nLFxuJ3R1cnF1b2lzZScsXG4ndmlvbGV0Jyxcbid3aGVhdCcsXG4nd2hpdGVzbW9rZScsXG4neWVsbG93Z3JlZW4nXG5dO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKlxuICAgIEluc3RhZ3JhbSBmaWx0ZXJzIGFzIENTUyBmaWx0ZXJzLCBzdHJhaWdodCBzdG9sZW5cbiAgICBmcm9tIGh0dHA6Ly9kZXNpZ25waWVjZXMuY29tLzIwMTQvMDkvaW5zdGFncmFtLWZpbHRlcnMtY3NzMy1lZmZlY3RzL1xuICovXG52YXIgZmlsdGVycyA9IFtcbiAgJ2NvbnRyYXN0KDEuMykgYnJpZ2h0bmVzcygwLjgpIHNlcGlhKDAuMykgc2F0dXJhdGUoMS41KSBodWUtcm90YXRlKC0yMGRlZyknLCAvLyB4LXBybzJcbiAgJ3NhdHVyYXRlKDAuMDIpIGNvbnRyYXN0KDAuODUpIGJyaWdodG5lc3MoMS4yKSBzZXBpYSgwLjAyKScsIC8vIHdpbGxvd1xuICAnc2VwaWEoMC4zNSkgY29udHJhc3QoMC45KSBicmlnaHRuZXNzKDEuMSkgaHVlLXJvdGF0ZSgtMTBkZWcpIHNhdHVyYXRlKDEuNSknLCAvLyB3YWxkZW5cbiAgJ3NlcGlhKDAuMTUpIHNhdHVyYXRlKDEuNSkgY29udHJhc3QoMC45KScsIC8vIHZhbGVuY2lhXG4gICdzZXBpYSgwLjQpIHNhdHVyYXRlKDIuNSkgaHVlLXJvdGF0ZSgtMzBkZWcpIGNvbnRyYXN0KDAuNjcpJywgLy8gdG9hc3RlclxuICAnYnJpZ2h0bmVzcygwLjc1KSBjb250cmFzdCgxLjMpIHNlcGlhKDAuNSkgaHVlLXJvdGF0ZSgtMjVkZWcpJywgLy8gc3V0cm9cbiAgJ2NvbnRyYXN0KDAuOCkgc2F0dXJhdGUoMS4yKSBzZXBpYSgwLjE1KScsIC8vIHNpZXJyYVxuICAnc2F0dXJhdGUoMS40KSBzZXBpYSgwLjI1KSBodWUtcm90YXRlKC0xNWRlZykgY29udHJhc3QoMC44KSBicmlnaHRuZXNzKDEuMSknLCAvLyByaXNlXG4gICdzZXBpYSgwLjQpIHNhdHVyYXRlKDEuNSkgY29udHJhc3QoMC45KSBicmlnaHRuZXNzKDEuMSkgaHVlLXJvdGF0ZSgtMTVkZWcpJyAvLyBuYXNodmlsbGVcbl07XG5cbmZ1bmN0aW9uIHJhbmRvbUZpbHRlciAoKSB7XG4gIHZhciByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGZpbHRlcnMubGVuZ3RoKTtcbiAgcmV0dXJuIGZpbHRlcnNbcmFuZG9tSW5kZXhdO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgcmFuZG9tRmlsdGVyOiByYW5kb21GaWx0ZXJcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjb2xvcnMgPSByZXF1aXJlKCcuL2NvbG9ycy5qcycpO1xuXG52YXIgZmFtaWxpZXMgPSBbXG4gICdMb2JzdGVyIFR3bycsXG4gICdPdmVybG9jaycsXG4gICdQbGF5YmFsbCcsXG4gICdTaWdtYXIgT25lJyxcbiAgJ0FtYXRpYyBTQycsXG4gICdCZXJrc2hpcmUgU3dhc2gnLFxuICAnS2F1c2hhbiBTY3JpcHQnLFxuICAnTHVja2llc3QgR3V5JyxcbiAgJ09wZW4gU2FucycsXG4gICdTYW5jcmVlaydcbl07XG5cblxuZnVuY3Rpb24gcmFuZG9tRm9udE5hbWUgKCkge1xuICB2YXIgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBmYW1pbGllcy5sZW5ndGgpO1xuICByZXR1cm4gZmFtaWxpZXNbcmFuZG9tSW5kZXhdO1xufVxuXG5mdW5jdGlvbiByYW5kb21Gb250RmFtaWx5ICgpIHtcbiAgcmV0dXJuIHJhbmRvbUZvbnROYW1lKCkgKyAnLCBzYW5zLXNlcmlmJztcbn1cblxuZnVuY3Rpb24gcmFuZG9tQ2xhc3NuYW1lICgpIHtcbiAgdmFyIGZhbWlseSA9IHJhbmRvbUZvbnROYW1lKCk7XG4gIHJldHVybiBmYW1pbHkudG9Mb3dlckNhc2UoKS5yZXBsYWNlKCcgJywgJy0nKTtcbn1cblxuZnVuY3Rpb24gcmFuZG9tQ29sb3IgKCkge1xuICB2YXIgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjb2xvcnMubGVuZ3RoKTtcbiAgcmV0dXJuIGNvbG9yc1tyYW5kb21JbmRleF07XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICByYW5kb21Gb250TmFtZTogcmFuZG9tRm9udE5hbWUsXG4gIHJhbmRvbUZvbnRGYW1pbHk6IHJhbmRvbUZvbnRGYW1pbHksXG4gIHJhbmRvbUNsYXNzbmFtZTogcmFuZG9tQ2xhc3NuYW1lLFxuICByYW5kb21Db2xvcjogcmFuZG9tQ29sb3Jcbn07XG4iLCIndXNlIHN0cmljdCc7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldFN0cmVhbSAoY2FsbGJhY2spIHtcbiAgdmFyIE9QRVJBVE9SUyA9ICdjb21lIGdldCBnaXZlIGdvIGtlZXAgbGV0IG1ha2UgcHV0IHNlZW0gdGFrZSBiZSBkbyBoYXZlIHNheSBzZWUgc2VuZCBtYXkgd2lsbCBhYm91dCBhY3Jvc3MgYWZ0ZXIgYWdhaW5zdCBhbW9uZyBhdCBiZWZvcmUgYmV0d2VlbiBieSBkb3duIGZyb20gaW4gb2ZmIG9uIG92ZXIgdGhyb3VnaCB0byB1bmRlciB1cCB3aXRoIGFzIGZvciBvZiB0aWxsIHRoYW4gYSB0aGUgYWxsIGFueSBldmVyeSBubyBvdGhlciBzb21lIHN1Y2ggdGhhdCB0aGlzIEkgaGUgeW91IHdobyBhbmQgYmVjYXVzZSBidXQgb3IgaWYgdGhyb3VnaCB3aGlsZSBob3cgd2hlbiB3aGVyZSB3aHkgYWdhaW4gZXZlciBmYXIgZm9yd2FyZCBoZWFyIG5lYXIgbm93IG91dCBzdGlsbCB0aGVyZSB0aGVuIHRvZ2V0aGVyIHdlbGwgYWxtb3N0IGVub3VnaCBldmVuIGxpdHRsZSBtdWNoIG5vdCBvbmx5IHF1aXRlIHNvIHZlcnkgdG9tb3Jyb3cgeWVzdGVyZGF5IG5vcnRoIHNvdXRoIGVhc3Qgd2VzdCBwbGVhc2UgeWVzJy5zcGxpdCgnICcpO1xuICB2YXIgR0VORVJBTCA9ICdhY2NvdW50IGFjdCBhZGRpdGlvbiBhZGp1c3RtZW50IGFkdmVydGlzZW1lbnQgYWdyZWVtZW50IGFpciBhbW91bnQgYW11c2VtZW50IGFuaW1hbCBhbnN3ZXIgYXBwYXJhdHVzIGFwcHJvdmFsIGFyZ3VtZW50IGFydCBhdHRhY2sgYXR0ZW1wdCBhdHRlbnRpb24gYXR0cmFjdGlvbiBhdXRob3JpdHkgYmFjayBiYWxhbmNlIGJhc2UgYmVoYXZpb3IgYmVsaWVmIGJpcnRoIGJpdCBiaXRlIGJsb29kIGJsb3cgYm9keSBicmFzcyBicmVhZCBicmVhdGggYnJvdGhlciBidWlsZGluZyBidXJuIGJ1cnN0IGJ1c2luZXNzIGJ1dHRlciBjYW52YXMgY2FyZSBjYXVzZSBjaGFsayBjaGFuY2UgY2hhbmdlIGNsb3RoIGNvYWwgY29sb3VyIGNvbWZvcnQgY29tbWl0dGVlIGNvbXBhbnkgY29tcGFyaXNvbiBjb21wZXRpdGlvbiBjb25kaXRpb24gY29ubmVjdGlvbiBjb250cm9sIGNvb2sgY29wcGVyIGNvcHkgY29yayBjb3R0b24gY291Z2ggY291bnRyeSBjb3ZlciBjcmFjayBjcmVkaXQgY3JpbWUgY3J1c2ggY3J5IGN1cnJlbnQgY3VydmUgZGFtYWdlIGRhbmdlciBkYXVnaHRlciBkYXkgZGVhdGggZGVidCBkZWNpc2lvbiBkZWdyZWUgZGVzaWduIGRlc2lyZSBkZXN0cnVjdGlvbiBkZXRhaWwgZGV2ZWxvcG1lbnQgZGlnZXN0aW9uIGRpcmVjdGlvbiBkaXNjb3ZlcnkgZGlzY3Vzc2lvbiBkaXNlYXNlIGRpc2d1c3QgZGlzdGFuY2UgZGlzdHJpYnV0aW9uIGRpdmlzaW9uIGRvdWJ0IGRyaW5rIGRyaXZpbmcgZHVzdCBlYXJ0aCBlZGdlIGVkdWNhdGlvbiBlZmZlY3QgZW5kIGVycm9yIGV2ZW50IGV4YW1wbGUgZXhjaGFuZ2UgZXhpc3RlbmNlIGV4cGFuc2lvbiBleHBlcmllbmNlIGV4cGVydCBmYWN0IGZhbGwgZmFtaWx5IGZhdGhlciBmZWFyIGZlZWxpbmcgZmljdGlvbiBmaWVsZCBmaWdodCBmaXJlIGZsYW1lIGZsaWdodCBmbG93ZXIgZm9sZCBmb29kIGZvcmNlIGZvcm0gZnJpZW5kIGZyb250IGZydWl0IGdsYXNzIGdvbGQgZ292ZXJubWVudCBncmFpbiBncmFzcyBncmlwIGdyb3VwIGdyb3d0aCBndWlkZSBoYXJib3IgaGFybW9ueSBoYXRlIGhlYXJpbmcgaGVhdCBoZWxwIGhpc3RvcnkgaG9sZSBob3BlIGhvdXIgaHVtb3VyIGljZSBpZGVhIGltcHVsc2UgaW5jcmVhc2UgaW5kdXN0cnkgaW5rIGluc2VjdCBpbnN0cnVtZW50IGluc3VyYW5jZSBpbnRlcmVzdCBpbnZlbnRpb24gaXJvbiBqZWxseSBqb2luIGpvdXJuZXkganVkZ2UganVtcCBraWNrIGtpc3Mga25vd2xlZGdlIGxhbmQgbGFuZ3VhZ2UgbGF1Z2ggbGF3IGxlYWQgbGVhcm5pbmcgbGVhdGhlciBsZXR0ZXIgbGV2ZWwgbGlmdCBsaWdodCBsaW1pdCBsaW5lbiBsaXF1aWQgbGlzdCBsb29rIGxvc3MgbG92ZSBtYWNoaW5lIG1hbiBtYW5hZ2VyIG1hcmsgbWFya2V0IG1hc3MgbWVhbCBtZWFzdXJlIG1lYXQgbWVldGluZyBtZW1vcnkgbWV0YWwgbWlkZGxlIG1pbGsgbWluZCBtaW5lIG1pbnV0ZSBtaXN0IG1vbmV5IG1vbnRoIG1vcm5pbmcgbW90aGVyIG1vdGlvbiBtb3VudGFpbiBtb3ZlIG11c2ljIG5hbWUgbmF0aW9uIG5lZWQgbmV3cyBuaWdodCBub2lzZSBub3RlIG51bWJlciBvYnNlcnZhdGlvbiBvZmZlciBvaWwgb3BlcmF0aW9uIG9waW5pb24gb3JkZXIgb3JnYW5pemF0aW9uIG9ybmFtZW50IG93bmVyIHBhZ2UgcGFpbiBwYWludCBwYXBlciBwYXJ0IHBhc3RlIHBheW1lbnQgcGVhY2UgcGVyc29uIHBsYWNlIHBsYW50IHBsYXkgcGxlYXN1cmUgcG9pc29uIHBvaW50IHBvbGlzaCBwb3J0ZXIgcG9zaXRpb24gcG93ZGVyIHBvd2VyIHByaWNlIHByaW50IHByb2Nlc3MgcHJvZHVjZSBwcm9maXQgcHJvcGVydHkgcHJvc2UgcHJvdGVzdCBwdWxsIHB1bmlzaG1lbnQgcHVycG9zZSBwdXNoIHF1YWxpdHkgcXVlc3Rpb24gcmFpbiByYW5nZSByYXRlIHJheSByZWFjdGlvbiByZWFkaW5nIHJlYXNvbiByZWNvcmQgcmVncmV0IHJlbGF0aW9uIHJlbGlnaW9uIHJlcHJlc2VudGF0aXZlIHJlcXVlc3QgcmVzcGVjdCByZXN0IHJld2FyZCByaHl0aG0gcmljZSByaXZlciByb2FkIHJvbGwgcm9vbSBydWIgcnVsZSBydW4gc2FsdCBzYW5kIHNjYWxlIHNjaWVuY2Ugc2VhIHNlYXQgc2VjcmV0YXJ5IHNlbGVjdGlvbiBzZWxmIHNlbnNlIHNlcnZhbnQgc2V4IHNoYWRlIHNoYWtlIHNoYW1lIHNob2NrIHNpZGUgc2lnbiBzaWxrIHNpbHZlciBzaXN0ZXIgc2l6ZSBza3kgc2xlZXAgc2xpcCBzbG9wZSBzbWFzaCBzbWVsbCBzbWlsZSBzbW9rZSBzbmVlemUgc25vdyBzb2FwIHNvY2lldHkgc29uIHNvbmcgc29ydCBzb3VuZCBzb3VwIHNwYWNlIHN0YWdlIHN0YXJ0IHN0YXRlbWVudCBzdGVhbSBzdGVlbCBzdGVwIHN0aXRjaCBzdG9uZSBzdG9wIHN0b3J5IHN0cmV0Y2ggc3RydWN0dXJlIHN1YnN0YW5jZSBzdWdhciBzdWdnZXN0aW9uIHN1bW1lciBzdXBwb3J0IHN1cnByaXNlIHN3aW0gc3lzdGVtIHRhbGsgdGFzdGUgdGF4IHRlYWNoaW5nIHRlbmRlbmN5IHRlc3QgdGhlb3J5IHRoaW5nIHRob3VnaHQgdGh1bmRlciB0aW1lIHRpbiB0b3AgdG91Y2ggdHJhZGUgdHJhbnNwb3J0IHRyaWNrIHRyb3VibGUgdHVybiB0d2lzdCB1bml0IHVzZSB2YWx1ZSB2ZXJzZSB2ZXNzZWwgdmlldyB2b2ljZSB3YWxrIHdhciB3YXNoIHdhc3RlIHdhdGVyIHdhdmUgd2F4IHdheSB3ZWF0aGVyIHdlZWsgd2VpZ2h0IHdpbmQgd2luZSB3aW50ZXIgd29tYW4gd29vZCB3b29sIHdvcmQgd29yayB3b3VuZCB3cml0aW5nIHllYXInLnNwbGl0KCcgJyk7XG4gIHZhciBQSUNUVVJBQkxFUyA9ICdhbmdsZSBhbnQgYXBwbGUgYXJjaCBhcm0gYXJteSBiYWJ5IGJhZyBiYWxsIGJhbmQgYmFzaW4gYmFza2V0IGJhdGggYmVkIGJlZSBiZWxsIGJlcnJ5IGJpcmQgYmxhZGUgYm9hcmQgYm9hdCBib25lIGJvb2sgYm9vdCBib3R0bGUgYm94IGJveSBicmFpbiBicmFrZSBicmFuY2ggYnJpY2sgYnJpZGdlIGJydXNoIGJ1Y2tldCBidWxiIGJ1dHRvbiBjYWtlIGNhbWVyYSBjYXJkIGNhcnJpYWdlIGNhcnQgY2F0IGNoYWluIGNoZWVzZSBjaGVzdCBjaGluIGNodXJjaCBjaXJjbGUgY2xvY2sgY2xvdWQgY29hdCBjb2xsYXIgY29tYiBjb3JkIGNvdyBjdXAgY3VydGFpbiBjdXNoaW9uIGRvZyBkb29yIGRyYWluIGRyYXdlciBkcmVzcyBkcm9wIGVhciBlZ2cgZW5naW5lIGV5ZSBmYWNlIGZhcm0gZmVhdGhlciBmaW5nZXIgZmlzaCBmbGFnIGZsb29yIGZseSBmb290IGZvcmsgZm93bCBmcmFtZSBnYXJkZW4gZ2lybCBnbG92ZSBnb2F0IGd1biBoYWlyIGhhbW1lciBoYW5kIGhhdCBoZWFkIGhlYXJ0IGhvb2sgaG9ybiBob3JzZSBob3NwaXRhbCBob3VzZSBpc2xhbmQgamV3ZWwga2V0dGxlIGtleSBrbmVlIGtuaWZlIGtub3QgbGVhZiBsZWcgbGlicmFyeSBsaW5lIGxpcCBsb2NrIG1hcCBtYXRjaCBtb25rZXkgbW9vbiBtb3V0aCBtdXNjbGUgbmFpbCBuZWNrIG5lZWRsZSBuZXJ2ZSBuZXQgbm9zZSBudXQgb2ZmaWNlIG9yYW5nZSBvdmVuIHBhcmNlbCBwZW4gcGVuY2lsIHBpY3R1cmUgcGlnIHBpbiBwaXBlIHBsYW5lIHBsYXRlIHBsb3VnaCBwb2NrZXQgcG90IHBvdGF0byBwcmlzb24gcHVtcCByYWlsIHJhdCByZWNlaXB0IHJpbmcgcm9kIHJvb2Ygcm9vdCBzYWlsIHNjaG9vbCBzY2lzc29ycyBzY3JldyBzZWVkIHNoZWVwIHNoZWxmIHNoaXAgc2hpcnQgc2hvZSBza2luIHNraXJ0IHNuYWtlIHNvY2sgc3BhZGUgc3BvbmdlIHNwb29uIHNwcmluZyBzcXVhcmUgc3RhbXAgc3RhciBzdGF0aW9uIHN0ZW0gc3RpY2sgc3RvY2tpbmcgc3RvbWFjaCBzdG9yZSBzdHJlZXQgc3VuIHRhYmxlIHRhaWwgdGhyZWFkIHRocm9hdCB0aHVtYiB0aWNrZXQgdG9lIHRvbmd1ZSB0b290aCB0b3duIHRyYWluIHRyYXkgdHJlZSB0cm91c2VycyB1bWJyZWxsYSB3YWxsIHdhdGNoIHdoZWVsIHdoaXAgd2hpc3RsZSB3aW5kb3cgd2luZyB3aXJlIHdvcm0nLnNwbGl0KCcgJyk7XG4gIHZhciBRVUFMSVRJRVMgPSAnYWJsZSBhY2lkIGFuZ3J5IGF1dG9tYXRpYyBiZWF1dGlmdWwgYmxhY2sgYm9pbGluZyBicmlnaHQgYnJva2VuIGJyb3duIGNoZWFwIGNoZW1pY2FsIGNoaWVmIGNsZWFuIGNsZWFyIGNvbW1vbiBjb21wbGV4IGNvbnNjaW91cyBjdXAgZGVlcCBkZXBlbmRlbnQgZWFybHkgZWxhc3RpYyBlbGVjdHJpYyBlcXVhbCBmYXQgZmVydGlsZSBmaXJzdCBmaXhlZCBmbGF0IGZyZWUgZnJlcXVlbnQgZnVsbCBnZW5lcmFsIGdvb2QgZ3JlYXQgZ3JleSBoYW5naW5nIGhhcHB5IGhhcmQgaGVhbHRoeSBoaWdoIGhvbGxvdyBpbXBvcnRhbnQga2luZCBsaWtlIGxpdmluZyBsb25nIG1hbGUgbWFycmllZCBtYXRlcmlhbCBtZWRpY2FsIG1pbGl0YXJ5IG5hdHVyYWwgbmVjZXNzYXJ5IG5ldyBub3JtYWwgb3BlbiBwYXJhbGxlbCBwYXN0IHBoeXNpY2FsIHBvbGl0aWNhbCBwb29yIHBvc3NpYmxlIHByZXNlbnQgcHJpdmF0ZSBwcm9iYWJsZSBxdWljayBxdWlldCByZWFkeSByZWQgcmVndWxhciByZXNwb25zaWJsZSByaWdodCByb3VuZCBzYW1lIHNlY29uZCBzZXBhcmF0ZSBzZXJpb3VzIHNoYXJwIHNtb290aCBzdGlja3kgc3RpZmYgc3RyYWlnaHQgc3Ryb25nIHN1ZGRlbiBzd2VldCB0YWxsIHRoaWNrIHRpZ2h0IHRpcmVkIHRydWUgdmlvbGVudCB3YWl0aW5nIHdhcm0gd2V0IHdpZGUgd2lzZSB5ZWxsb3cgeW91bmcnLnNwbGl0KCcgJyk7XG4gIGZ1bmN0aW9uIHBpY2sgKGNvbGwpIHtcbiAgICByZXR1cm4gY29sbFtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjb2xsLmxlbmd0aCldO1xuICB9XG4gIGZ1bmN0aW9uIGNhcCAod29yZCkge1xuICAgIHJldHVybiB3b3JkWzBdLnRvVXBwZXJDYXNlKCkrd29yZC5zbGljZSgxKTtcbiAgfVxuICB2YXIgaWQgPSAwO1xuICBmdW5jdGlvbiBnZW4gKCkge1xuICAgIGNhbGxiYWNrKHtcbiAgICAgIGlkOiArK2lkLFxuICAgICAgdGl0bGU6IGNhcChwaWNrKFFVQUxJVElFUykpICsgJyAnICsgcGljayhQSUNUVVJBQkxFUykgKyAoTWF0aC5yYW5kb20oKSA8IDAuNCA/ICcnIDogJyAnICsgcGljayhPUEVSQVRPUlMpICsgJyAnICsgcGljayhHRU5FUkFMKSksXG4gICAgICBkYXRlOiBEYXRlLm5vdygpIC0gTWF0aC5mbG9vcigyICogNjAgKiA2MCAqIDEwMDAgKiBNYXRoLnJhbmRvbSgpKSxcbiAgICAgIHVybDogJ2h0dHBzOi8vdW5zcGxhc2guaXQvNDAwLzQwMC8/cmFuZG9tPScgKyBpZCArIERhdGUubm93KCksXG4gICAgICBhdXRob3JOYW1lOiBwaWNrKEdFTkVSQUwpLnNsaWNlKDAsIDIgKyBNYXRoLmZsb29yKDMqTWF0aC5yYW5kb20oKSkpICsgcGljayhHRU5FUkFMKS5zbGljZSgtNSArIE1hdGguZmxvb3IoNSpNYXRoLnJhbmRvbSgpKSksXG4gICAgICBsaWtlczogTWF0aC5mbG9vcig1MDAgKiBNYXRoLnJhbmRvbSgpICogTWF0aC5yYW5kb20oKSlcbiAgICB9KTtcbiAgfVxuICBmb3IgKHZhciBpPTEwICogTWF0aC5yYW5kb20oKTsgaTwyMDsgaSsrKSBnZW4oKTtcbiAgLy8gc2V0SW50ZXJ2YWwoZ2VuLCAxMDAwMCk7XG59O1xuIiwidmFyIHRlbXBsYXRlciA9IHJlcXVpcmUoXCJoYW5kbGViYXJzL3J1bnRpbWVcIilbXCJkZWZhdWx0XCJdLnRlbXBsYXRlO21vZHVsZS5leHBvcnRzID0gdGVtcGxhdGVyKHtcImNvbXBpbGVyXCI6WzYsXCI+PSAyLjAuMC1iZXRhLjFcIl0sXCJtYWluXCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICAgIHZhciBoZWxwZXIsIGFsaWFzMT1oZWxwZXJzLmhlbHBlck1pc3NpbmcsIGFsaWFzMj1cImZ1bmN0aW9uXCIsIGFsaWFzMz10aGlzLmVzY2FwZUV4cHJlc3Npb247XG5cbiAgcmV0dXJuIFwiPGRpdlxcbiAgY2xhc3M9XFxcImFydCBpbmxpbmUtYmxvY2sgcmVsYXRpdmUgY3Vyc29yIG0yIGZmLW92ZXJsb2NrXFxcIlxcbiAgc3R5bGU9XFxcImZvbnQtZmFtaWx5OiBcIlxuICAgICsgYWxpYXMzKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMuZm9udEZhbWlseSB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuZm9udEZhbWlseSA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBhbGlhczEpLCh0eXBlb2YgaGVscGVyID09PSBhbGlhczIgPyBoZWxwZXIuY2FsbChkZXB0aDAse1wibmFtZVwiOlwiZm9udEZhbWlseVwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpKVxuICAgICsgXCJcXFwiPlxcbiAgPGRpdiBjbGFzcz1cXFwiIGFic29sdXRlIHRvcC0wIGxlZnQtMCBmbGV4IGZsZXgtY2VudGVyIGZ1bGwtaGVpZ2h0IGNvbCBjb2wtMTIgcHgyIHoyXFxcIj5cXG4gICAgPHNwYW5cXG4gICAgICBjbGFzcz1cXFwic2hhZG93IGNlbnRlciBmMSB3aGl0ZSBtMCBjb2wgY29sLTEyXFxcIlxcbiAgICAgIHN0eWxlPVxcXCJjb2xvcjogXCJcbiAgICArIGFsaWFzMygoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLmZvbnRDb2xvciB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuZm9udENvbG9yIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGFsaWFzMSksKHR5cGVvZiBoZWxwZXIgPT09IGFsaWFzMiA/IGhlbHBlci5jYWxsKGRlcHRoMCx7XCJuYW1lXCI6XCJmb250Q29sb3JcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSlcbiAgICArIFwiXFxuICAgIFxcXCI+XCJcbiAgICArIGFsaWFzMygoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLnRpdGxlIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC50aXRsZSA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBhbGlhczEpLCh0eXBlb2YgaGVscGVyID09PSBhbGlhczIgPyBoZWxwZXIuY2FsbChkZXB0aDAse1wibmFtZVwiOlwidGl0bGVcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSlcbiAgICArIFwiPC9zcGFuPlxcbiAgPC9kaXY+XFxuICA8aW1nXFxuICAgIGNsYXNzPVxcXCJcXFwiXFxuICAgIHN0eWxlPVxcXCJmaWx0ZXI6IFwiXG4gICAgKyBhbGlhczMoKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy5maWx0ZXIgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLmZpbHRlciA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBhbGlhczEpLCh0eXBlb2YgaGVscGVyID09PSBhbGlhczIgPyBoZWxwZXIuY2FsbChkZXB0aDAse1wibmFtZVwiOlwiZmlsdGVyXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIlxcXCJcXG4gICAgc3JjPVxcXCJcIlxuICAgICsgYWxpYXMzKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMudXJsIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC51cmwgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogYWxpYXMxKSwodHlwZW9mIGhlbHBlciA9PT0gYWxpYXMyID8gaGVscGVyLmNhbGwoZGVwdGgwLHtcIm5hbWVcIjpcInVybFwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpKVxuICAgICsgXCJcXFwiXFxuICAgIGFsdD1cXFwiYSByYW5kb21seSBzZWxlY3RlZCBwaWN0dXJlXFxcIj5cXG48L2Rpdj5cXG5cIjtcbn0sXCJ1c2VEYXRhXCI6dHJ1ZX0pOyJdfQ==
