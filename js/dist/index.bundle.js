(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"../templates/art.hbs":13,"./src/filters":3,"./src/fonts":4,"./src/getStream":5}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{"./colors.js":2}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{"./handlebars/base":7,"./handlebars/exception":8,"./handlebars/runtime":9,"./handlebars/safe-string":10,"./handlebars/utils":11}],7:[function(require,module,exports){
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
},{"./exception":8,"./utils":11}],8:[function(require,module,exports){
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
},{}],9:[function(require,module,exports){
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
},{"./base":7,"./exception":8,"./utils":11}],10:[function(require,module,exports){
"use strict";
// Build out our basic SafeString type
function SafeString(string) {
  this.string = string;
}

SafeString.prototype.toString = SafeString.prototype.toHTML = function() {
  return "" + this.string;
};

exports["default"] = SafeString;
},{}],11:[function(require,module,exports){
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
},{}],12:[function(require,module,exports){
// Create a simple path alias to allow browserify to resolve
// the runtime on a supported path.
module.exports = require('./dist/cjs/handlebars.runtime').default;

},{"./dist/cjs/handlebars.runtime":6}],13:[function(require,module,exports){
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
},{"handlebars/runtime":12}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9pbmRleC5qcyIsImpzL3NyYy9jb2xvcnMuanMiLCJqcy9zcmMvZmlsdGVycy5qcyIsImpzL3NyYy9mb250cy5qcyIsImpzL3NyYy9nZXRTdHJlYW0uanMiLCJub2RlX21vZHVsZXMvaGFuZGxlYmFycy9kaXN0L2Nqcy9oYW5kbGViYXJzLnJ1bnRpbWUuanMiLCJub2RlX21vZHVsZXMvaGFuZGxlYmFycy9kaXN0L2Nqcy9oYW5kbGViYXJzL2Jhc2UuanMiLCJub2RlX21vZHVsZXMvaGFuZGxlYmFycy9kaXN0L2Nqcy9oYW5kbGViYXJzL2V4Y2VwdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2Rpc3QvY2pzL2hhbmRsZWJhcnMvcnVudGltZS5qcyIsIm5vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2Rpc3QvY2pzL2hhbmRsZWJhcnMvc2FmZS1zdHJpbmcuanMiLCJub2RlX21vZHVsZXMvaGFuZGxlYmFycy9kaXN0L2Nqcy9oYW5kbGViYXJzL3V0aWxzLmpzIiwibm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvcnVudGltZS5qcyIsInRlbXBsYXRlcy9hcnQuaGJzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwR0E7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxudmFyIGdldFN0cmVhbSA9IHJlcXVpcmUoJy4vc3JjL2dldFN0cmVhbScpO1xudmFyIGZvbnRzID0gcmVxdWlyZSgnLi9zcmMvZm9udHMnKTtcbnZhciBmaWx0ZXJzID0gcmVxdWlyZSgnLi9zcmMvZmlsdGVycycpO1xudmFyIGFydFRlbXBsYXRlID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzL2FydC5oYnMnKTtcbnZhciBtYWluRWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluJyk7XG5cbmZ1bmN0aW9uIGNoYW5nZUZpbHRlciAoZWwpIHtcbiAgdmFyIGZpbHRlciA9IGZpbHRlcnMucmFuZG9tRmlsdGVyKCk7XG4gIHZhciBpbWcgPSBlbC5xdWVyeVNlbGVjdG9yKCdpbWcnKTtcbiAgaW1nLnN0eWxlLmZpbHRlciA9IGZpbHRlcjtcbn1cblxuZnVuY3Rpb24gY2hhbmdlRm9udCAoZWwpIHtcbiAgdmFyIGZmID0gZm9udHMucmFuZG9tRm9udEZhbWlseSgpO1xuICBlbC5zdHlsZS5mb250RmFtaWx5ID0gZmY7XG59XG5cbmZ1bmN0aW9uIGNoYW5nZUNvbG9yIChlbCkge1xuICB2YXIgY29sb3IgPSBmb250cy5yYW5kb21Db2xvcigpO1xuICB2YXIgdGV4dEVsID0gZWwucXVlcnlTZWxlY3Rvcignc3BhbicpO1xuICB0ZXh0RWwuc3R5bGUuY29sb3IgPSBjb2xvcjtcbn1cblxuZnVuY3Rpb24gcmVuZGVyIChtb2RlbCkge1xuICBtb2RlbC5mb250RmFtaWx5ID0gZm9udHMucmFuZG9tRm9udEZhbWlseSgpO1xuICBtb2RlbC5maWx0ZXIgPSBmaWx0ZXJzLnJhbmRvbUZpbHRlcigpO1xuICBtb2RlbC5mb250Q29sb3IgPSBmb250cy5yYW5kb21Db2xvcigpO1xuICBtYWluRWxlbS5pbm5lckhUTUwgKz0gYXJ0VGVtcGxhdGUobW9kZWwpO1xufVxuXG5nZXRTdHJlYW0oZnVuY3Rpb24gKHRoaW5nKSB7XG4gIHJlbmRlcih0aGluZyk7XG59KTtcblxudmFyIGFydEVsZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmFydCcpO1xudmFyIGFydEFycmF5ID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJ0RWxlbXMpO1xuXG5hcnRBcnJheS5mb3JFYWNoKGZ1bmN0aW9uIChhcnQpIHtcbiAgYXJ0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgIGNoYW5nZUZvbnQoYXJ0KTtcbiAgICBjaGFuZ2VGaWx0ZXIoYXJ0KTtcbiAgICBjaGFuZ2VDb2xvcihhcnQpO1xuICB9KTtcbn0pO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBbXG4nYmxhY2snLFxuJ3NpbHZlcicsXG4nZ3JheScsXG4nd2hpdGUnLFxuJ21hcm9vbicsXG4ncmVkJyxcbidwdXJwbGUnLFxuJ2Z1Y2hzaWEnLFxuJ2dyZWVuJyxcbidsaW1lJyxcbidvbGl2ZScsXG4neWVsbG93JyxcbiduYXZ5JyxcbidibHVlJyxcbid0ZWFsJyxcbidhcXVhJyxcbidvcmFuZ2UnLFxuJ2FsaWNlYmx1ZScsXG4nYW50aXF1ZXdoaXRlJyxcbidhcXVhbWFyaW5lJyxcbidhenVyZScsXG4nYmVpZ2UnLFxuJ2Jpc3F1ZScsXG4nYmxhbmNoZWRhbG1vbmQnLFxuJ2JsdWV2aW9sZXQnLFxuJ2Jyb3duJyxcbididXJseXdvb2QnLFxuJ2NhZGV0Ymx1ZScsXG4nY2hhcnRyZXVzZScsXG4nY2hvY29sYXRlJyxcbidjb3JhbCcsXG4nY29ybmZsb3dlcmJsdWUnLFxuJ2Nvcm5zaWxrJyxcbidjcmltc29uJyxcbidkYXJrYmx1ZScsXG4nZGFya2N5YW4nLFxuJ2Rhcmtnb2xkZW5yb2QnLFxuJ2RhcmtncmF5JyxcbidkYXJrZ3JlZW4nLFxuJ2RhcmtncmV5JyxcbidkYXJra2hha2knLFxuJ2RhcmttYWdlbnRhJyxcbidkYXJrb2xpdmVncmVlbicsXG4nZGFya29yYW5nZScsXG4nZGFya29yY2hpZCcsXG4nZGFya3JlZCcsXG4nZGFya3NhbG1vbicsXG4nZGFya3NlYWdyZWVuJyxcbidkYXJrc2xhdGVibHVlJyxcbidkYXJrc2xhdGVncmF5JyxcbidkYXJrc2xhdGVncmV5JyxcbidkYXJrdHVycXVvaXNlJyxcbidkYXJrdmlvbGV0JyxcbidkZWVwcGluaycsXG4nZGVlcHNreWJsdWUnLFxuJ2RpbWdyYXknLFxuJ2RpbWdyZXknLFxuJ2RvZGdlcmJsdWUnLFxuJ2ZpcmVicmljaycsXG4nZmxvcmFsd2hpdGUnLFxuJ2ZvcmVzdGdyZWVuJyxcbidnYWluc2Jvcm8nLFxuJ2dob3N0d2hpdGUnLFxuJ2dvbGQnLFxuJ2dvbGRlbnJvZCcsXG4nZ3JlZW55ZWxsb3cnLFxuJ2dyZXknLFxuJ2hvbmV5ZGV3Jyxcbidob3RwaW5rJyxcbidpbmRpYW5yZWQnLFxuJ2luZGlnbycsXG4naXZvcnknLFxuJ2toYWtpJyxcbidsYXZlbmRlcicsXG4nbGF2ZW5kZXJibHVzaCcsXG4nbGF3bmdyZWVuJyxcbidsZW1vbmNoaWZmb24nLFxuJ2xpZ2h0Ymx1ZScsXG4nbGlnaHRjb3JhbCcsXG4nbGlnaHRjeWFuJyxcbidsaWdodGdvbGRlbnJvZHllbGxvdycsXG4nbGlnaHRncmF5JyxcbidsaWdodGdyZWVuJyxcbidsaWdodGdyZXknLFxuJ2xpZ2h0cGluaycsXG4nbGlnaHRzYWxtb24nLFxuJ2xpZ2h0c2VhZ3JlZW4nLFxuJ2xpZ2h0c2t5Ymx1ZScsXG4nbGlnaHRzbGF0ZWdyYXknLFxuJ2xpZ2h0c2xhdGVncmV5JyxcbidsaWdodHN0ZWVsYmx1ZScsXG4nbGlnaHR5ZWxsb3cnLFxuJ2xpbWVncmVlbicsXG4nbGluZW4nLFxuJ21lZGl1bWFxdWFtYXJpbmUnLFxuJ21lZGl1bWJsdWUnLFxuJ21lZGl1bW9yY2hpZCcsXG4nbWVkaXVtcHVycGxlJyxcbidtZWRpdW1zZWFncmVlbicsXG4nbWVkaXVtc2xhdGVibHVlJyxcbidtZWRpdW1zcHJpbmdncmVlbicsXG4nbWVkaXVtdHVycXVvaXNlJyxcbidtZWRpdW12aW9sZXRyZWQnLFxuJ21pZG5pZ2h0Ymx1ZScsXG4nbWludGNyZWFtJyxcbidtaXN0eXJvc2UnLFxuJ21vY2Nhc2luJyxcbiduYXZham93aGl0ZScsXG4nb2xkbGFjZScsXG4nb2xpdmVkcmFiJyxcbidvcmFuZ2VyZWQnLFxuJ29yY2hpZCcsXG4ncGFsZWdvbGRlbnJvZCcsXG4ncGFsZWdyZWVuJyxcbidwYWxldHVycXVvaXNlJyxcbidwYWxldmlvbGV0cmVkJyxcbidwYXBheWF3aGlwJyxcbidwZWFjaHB1ZmYnLFxuJ3BlcnUnLFxuJ3BpbmsnLFxuJ3BsdW0nLFxuJ3Bvd2RlcmJsdWUnLFxuJ3Jvc3licm93bicsXG4ncm95YWxibHVlJyxcbidzYWRkbGVicm93bicsXG4nc2FsbW9uJyxcbidzYW5keWJyb3duJyxcbidzZWFncmVlbicsXG4nc2Vhc2hlbGwnLFxuJ3NpZW5uYScsXG4nc2t5Ymx1ZScsXG4nc2xhdGVibHVlJyxcbidzbGF0ZWdyYXknLFxuJ3NsYXRlZ3JleScsXG4nc25vdycsXG4nc3ByaW5nZ3JlZW4nLFxuJ3N0ZWVsYmx1ZScsXG4ndGFuJyxcbid0aGlzdGxlJyxcbid0b21hdG8nLFxuJ3R1cnF1b2lzZScsXG4ndmlvbGV0Jyxcbid3aGVhdCcsXG4nd2hpdGVzbW9rZScsXG4neWVsbG93Z3JlZW4nXG5dO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKlxuICAgIEluc3RhZ3JhbSBmaWx0ZXJzIGFzIENTUyBmaWx0ZXJzLCBzdHJhaWdodCBzdG9sZW5cbiAgICBmcm9tIGh0dHA6Ly9kZXNpZ25waWVjZXMuY29tLzIwMTQvMDkvaW5zdGFncmFtLWZpbHRlcnMtY3NzMy1lZmZlY3RzL1xuICovXG52YXIgZmlsdGVycyA9IFtcbiAgJ2NvbnRyYXN0KDEuMykgYnJpZ2h0bmVzcygwLjgpIHNlcGlhKDAuMykgc2F0dXJhdGUoMS41KSBodWUtcm90YXRlKC0yMGRlZyknLCAvLyB4LXBybzJcbiAgJ3NhdHVyYXRlKDAuMDIpIGNvbnRyYXN0KDAuODUpIGJyaWdodG5lc3MoMS4yKSBzZXBpYSgwLjAyKScsIC8vIHdpbGxvd1xuICAnc2VwaWEoMC4zNSkgY29udHJhc3QoMC45KSBicmlnaHRuZXNzKDEuMSkgaHVlLXJvdGF0ZSgtMTBkZWcpIHNhdHVyYXRlKDEuNSknLCAvLyB3YWxkZW5cbiAgJ3NlcGlhKDAuMTUpIHNhdHVyYXRlKDEuNSkgY29udHJhc3QoMC45KScsIC8vIHZhbGVuY2lhXG4gICdzZXBpYSgwLjQpIHNhdHVyYXRlKDIuNSkgaHVlLXJvdGF0ZSgtMzBkZWcpIGNvbnRyYXN0KDAuNjcpJywgLy8gdG9hc3RlclxuICAnYnJpZ2h0bmVzcygwLjc1KSBjb250cmFzdCgxLjMpIHNlcGlhKDAuNSkgaHVlLXJvdGF0ZSgtMjVkZWcpJywgLy8gc3V0cm9cbiAgJ2NvbnRyYXN0KDAuOCkgc2F0dXJhdGUoMS4yKSBzZXBpYSgwLjE1KScsIC8vIHNpZXJyYVxuICAnc2F0dXJhdGUoMS40KSBzZXBpYSgwLjI1KSBodWUtcm90YXRlKC0xNWRlZykgY29udHJhc3QoMC44KSBicmlnaHRuZXNzKDEuMSknLCAvLyByaXNlXG4gICdzZXBpYSgwLjQpIHNhdHVyYXRlKDEuNSkgY29udHJhc3QoMC45KSBicmlnaHRuZXNzKDEuMSkgaHVlLXJvdGF0ZSgtMTVkZWcpJyAvLyBuYXNodmlsbGVcbl07XG5cbmZ1bmN0aW9uIHJhbmRvbUZpbHRlciAoKSB7XG4gIHZhciByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGZpbHRlcnMubGVuZ3RoKTtcbiAgcmV0dXJuIGZpbHRlcnNbcmFuZG9tSW5kZXhdO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgcmFuZG9tRmlsdGVyOiByYW5kb21GaWx0ZXJcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjb2xvcnMgPSByZXF1aXJlKCcuL2NvbG9ycy5qcycpO1xuXG52YXIgZmFtaWxpZXMgPSBbXG4gICdMb2JzdGVyIFR3bycsXG4gICdPdmVybG9jaycsXG4gICdQbGF5YmFsbCcsXG4gICdTaWdtYXIgT25lJyxcbiAgJ0FtYXRpYyBTQycsXG4gICdCZXJrc2hpcmUgU3dhc2gnLFxuICAnS2F1c2hhbiBTY3JpcHQnLFxuICAnTHVja2llc3QgR3V5JyxcbiAgJ09wZW4gU2FucycsXG4gICdTYW5jcmVlaydcbl07XG5cblxuZnVuY3Rpb24gcmFuZG9tRm9udE5hbWUgKCkge1xuICB2YXIgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBmYW1pbGllcy5sZW5ndGgpO1xuICByZXR1cm4gZmFtaWxpZXNbcmFuZG9tSW5kZXhdO1xufVxuXG5mdW5jdGlvbiByYW5kb21Gb250RmFtaWx5ICgpIHtcbiAgcmV0dXJuIHJhbmRvbUZvbnROYW1lKCkgKyAnLCBzYW5zLXNlcmlmJztcbn1cblxuZnVuY3Rpb24gcmFuZG9tQ2xhc3NuYW1lICgpIHtcbiAgdmFyIGZhbWlseSA9IHJhbmRvbUZvbnROYW1lKCk7XG4gIHJldHVybiBmYW1pbHkudG9Mb3dlckNhc2UoKS5yZXBsYWNlKCcgJywgJy0nKTtcbn1cblxuZnVuY3Rpb24gcmFuZG9tQ29sb3IgKCkge1xuICB2YXIgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjb2xvcnMubGVuZ3RoKTtcbiAgcmV0dXJuIGNvbG9yc1tyYW5kb21JbmRleF07XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICByYW5kb21Gb250TmFtZTogcmFuZG9tRm9udE5hbWUsXG4gIHJhbmRvbUZvbnRGYW1pbHk6IHJhbmRvbUZvbnRGYW1pbHksXG4gIHJhbmRvbUNsYXNzbmFtZTogcmFuZG9tQ2xhc3NuYW1lLFxuICByYW5kb21Db2xvcjogcmFuZG9tQ29sb3Jcbn07XG4iLCIndXNlIHN0cmljdCc7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldFN0cmVhbSAoY2FsbGJhY2spIHtcbiAgdmFyIE9QRVJBVE9SUyA9ICdjb21lIGdldCBnaXZlIGdvIGtlZXAgbGV0IG1ha2UgcHV0IHNlZW0gdGFrZSBiZSBkbyBoYXZlIHNheSBzZWUgc2VuZCBtYXkgd2lsbCBhYm91dCBhY3Jvc3MgYWZ0ZXIgYWdhaW5zdCBhbW9uZyBhdCBiZWZvcmUgYmV0d2VlbiBieSBkb3duIGZyb20gaW4gb2ZmIG9uIG92ZXIgdGhyb3VnaCB0byB1bmRlciB1cCB3aXRoIGFzIGZvciBvZiB0aWxsIHRoYW4gYSB0aGUgYWxsIGFueSBldmVyeSBubyBvdGhlciBzb21lIHN1Y2ggdGhhdCB0aGlzIEkgaGUgeW91IHdobyBhbmQgYmVjYXVzZSBidXQgb3IgaWYgdGhyb3VnaCB3aGlsZSBob3cgd2hlbiB3aGVyZSB3aHkgYWdhaW4gZXZlciBmYXIgZm9yd2FyZCBoZWFyIG5lYXIgbm93IG91dCBzdGlsbCB0aGVyZSB0aGVuIHRvZ2V0aGVyIHdlbGwgYWxtb3N0IGVub3VnaCBldmVuIGxpdHRsZSBtdWNoIG5vdCBvbmx5IHF1aXRlIHNvIHZlcnkgdG9tb3Jyb3cgeWVzdGVyZGF5IG5vcnRoIHNvdXRoIGVhc3Qgd2VzdCBwbGVhc2UgeWVzJy5zcGxpdCgnICcpO1xuICB2YXIgR0VORVJBTCA9ICdhY2NvdW50IGFjdCBhZGRpdGlvbiBhZGp1c3RtZW50IGFkdmVydGlzZW1lbnQgYWdyZWVtZW50IGFpciBhbW91bnQgYW11c2VtZW50IGFuaW1hbCBhbnN3ZXIgYXBwYXJhdHVzIGFwcHJvdmFsIGFyZ3VtZW50IGFydCBhdHRhY2sgYXR0ZW1wdCBhdHRlbnRpb24gYXR0cmFjdGlvbiBhdXRob3JpdHkgYmFjayBiYWxhbmNlIGJhc2UgYmVoYXZpb3IgYmVsaWVmIGJpcnRoIGJpdCBiaXRlIGJsb29kIGJsb3cgYm9keSBicmFzcyBicmVhZCBicmVhdGggYnJvdGhlciBidWlsZGluZyBidXJuIGJ1cnN0IGJ1c2luZXNzIGJ1dHRlciBjYW52YXMgY2FyZSBjYXVzZSBjaGFsayBjaGFuY2UgY2hhbmdlIGNsb3RoIGNvYWwgY29sb3VyIGNvbWZvcnQgY29tbWl0dGVlIGNvbXBhbnkgY29tcGFyaXNvbiBjb21wZXRpdGlvbiBjb25kaXRpb24gY29ubmVjdGlvbiBjb250cm9sIGNvb2sgY29wcGVyIGNvcHkgY29yayBjb3R0b24gY291Z2ggY291bnRyeSBjb3ZlciBjcmFjayBjcmVkaXQgY3JpbWUgY3J1c2ggY3J5IGN1cnJlbnQgY3VydmUgZGFtYWdlIGRhbmdlciBkYXVnaHRlciBkYXkgZGVhdGggZGVidCBkZWNpc2lvbiBkZWdyZWUgZGVzaWduIGRlc2lyZSBkZXN0cnVjdGlvbiBkZXRhaWwgZGV2ZWxvcG1lbnQgZGlnZXN0aW9uIGRpcmVjdGlvbiBkaXNjb3ZlcnkgZGlzY3Vzc2lvbiBkaXNlYXNlIGRpc2d1c3QgZGlzdGFuY2UgZGlzdHJpYnV0aW9uIGRpdmlzaW9uIGRvdWJ0IGRyaW5rIGRyaXZpbmcgZHVzdCBlYXJ0aCBlZGdlIGVkdWNhdGlvbiBlZmZlY3QgZW5kIGVycm9yIGV2ZW50IGV4YW1wbGUgZXhjaGFuZ2UgZXhpc3RlbmNlIGV4cGFuc2lvbiBleHBlcmllbmNlIGV4cGVydCBmYWN0IGZhbGwgZmFtaWx5IGZhdGhlciBmZWFyIGZlZWxpbmcgZmljdGlvbiBmaWVsZCBmaWdodCBmaXJlIGZsYW1lIGZsaWdodCBmbG93ZXIgZm9sZCBmb29kIGZvcmNlIGZvcm0gZnJpZW5kIGZyb250IGZydWl0IGdsYXNzIGdvbGQgZ292ZXJubWVudCBncmFpbiBncmFzcyBncmlwIGdyb3VwIGdyb3d0aCBndWlkZSBoYXJib3IgaGFybW9ueSBoYXRlIGhlYXJpbmcgaGVhdCBoZWxwIGhpc3RvcnkgaG9sZSBob3BlIGhvdXIgaHVtb3VyIGljZSBpZGVhIGltcHVsc2UgaW5jcmVhc2UgaW5kdXN0cnkgaW5rIGluc2VjdCBpbnN0cnVtZW50IGluc3VyYW5jZSBpbnRlcmVzdCBpbnZlbnRpb24gaXJvbiBqZWxseSBqb2luIGpvdXJuZXkganVkZ2UganVtcCBraWNrIGtpc3Mga25vd2xlZGdlIGxhbmQgbGFuZ3VhZ2UgbGF1Z2ggbGF3IGxlYWQgbGVhcm5pbmcgbGVhdGhlciBsZXR0ZXIgbGV2ZWwgbGlmdCBsaWdodCBsaW1pdCBsaW5lbiBsaXF1aWQgbGlzdCBsb29rIGxvc3MgbG92ZSBtYWNoaW5lIG1hbiBtYW5hZ2VyIG1hcmsgbWFya2V0IG1hc3MgbWVhbCBtZWFzdXJlIG1lYXQgbWVldGluZyBtZW1vcnkgbWV0YWwgbWlkZGxlIG1pbGsgbWluZCBtaW5lIG1pbnV0ZSBtaXN0IG1vbmV5IG1vbnRoIG1vcm5pbmcgbW90aGVyIG1vdGlvbiBtb3VudGFpbiBtb3ZlIG11c2ljIG5hbWUgbmF0aW9uIG5lZWQgbmV3cyBuaWdodCBub2lzZSBub3RlIG51bWJlciBvYnNlcnZhdGlvbiBvZmZlciBvaWwgb3BlcmF0aW9uIG9waW5pb24gb3JkZXIgb3JnYW5pemF0aW9uIG9ybmFtZW50IG93bmVyIHBhZ2UgcGFpbiBwYWludCBwYXBlciBwYXJ0IHBhc3RlIHBheW1lbnQgcGVhY2UgcGVyc29uIHBsYWNlIHBsYW50IHBsYXkgcGxlYXN1cmUgcG9pc29uIHBvaW50IHBvbGlzaCBwb3J0ZXIgcG9zaXRpb24gcG93ZGVyIHBvd2VyIHByaWNlIHByaW50IHByb2Nlc3MgcHJvZHVjZSBwcm9maXQgcHJvcGVydHkgcHJvc2UgcHJvdGVzdCBwdWxsIHB1bmlzaG1lbnQgcHVycG9zZSBwdXNoIHF1YWxpdHkgcXVlc3Rpb24gcmFpbiByYW5nZSByYXRlIHJheSByZWFjdGlvbiByZWFkaW5nIHJlYXNvbiByZWNvcmQgcmVncmV0IHJlbGF0aW9uIHJlbGlnaW9uIHJlcHJlc2VudGF0aXZlIHJlcXVlc3QgcmVzcGVjdCByZXN0IHJld2FyZCByaHl0aG0gcmljZSByaXZlciByb2FkIHJvbGwgcm9vbSBydWIgcnVsZSBydW4gc2FsdCBzYW5kIHNjYWxlIHNjaWVuY2Ugc2VhIHNlYXQgc2VjcmV0YXJ5IHNlbGVjdGlvbiBzZWxmIHNlbnNlIHNlcnZhbnQgc2V4IHNoYWRlIHNoYWtlIHNoYW1lIHNob2NrIHNpZGUgc2lnbiBzaWxrIHNpbHZlciBzaXN0ZXIgc2l6ZSBza3kgc2xlZXAgc2xpcCBzbG9wZSBzbWFzaCBzbWVsbCBzbWlsZSBzbW9rZSBzbmVlemUgc25vdyBzb2FwIHNvY2lldHkgc29uIHNvbmcgc29ydCBzb3VuZCBzb3VwIHNwYWNlIHN0YWdlIHN0YXJ0IHN0YXRlbWVudCBzdGVhbSBzdGVlbCBzdGVwIHN0aXRjaCBzdG9uZSBzdG9wIHN0b3J5IHN0cmV0Y2ggc3RydWN0dXJlIHN1YnN0YW5jZSBzdWdhciBzdWdnZXN0aW9uIHN1bW1lciBzdXBwb3J0IHN1cnByaXNlIHN3aW0gc3lzdGVtIHRhbGsgdGFzdGUgdGF4IHRlYWNoaW5nIHRlbmRlbmN5IHRlc3QgdGhlb3J5IHRoaW5nIHRob3VnaHQgdGh1bmRlciB0aW1lIHRpbiB0b3AgdG91Y2ggdHJhZGUgdHJhbnNwb3J0IHRyaWNrIHRyb3VibGUgdHVybiB0d2lzdCB1bml0IHVzZSB2YWx1ZSB2ZXJzZSB2ZXNzZWwgdmlldyB2b2ljZSB3YWxrIHdhciB3YXNoIHdhc3RlIHdhdGVyIHdhdmUgd2F4IHdheSB3ZWF0aGVyIHdlZWsgd2VpZ2h0IHdpbmQgd2luZSB3aW50ZXIgd29tYW4gd29vZCB3b29sIHdvcmQgd29yayB3b3VuZCB3cml0aW5nIHllYXInLnNwbGl0KCcgJyk7XG4gIHZhciBQSUNUVVJBQkxFUyA9ICdhbmdsZSBhbnQgYXBwbGUgYXJjaCBhcm0gYXJteSBiYWJ5IGJhZyBiYWxsIGJhbmQgYmFzaW4gYmFza2V0IGJhdGggYmVkIGJlZSBiZWxsIGJlcnJ5IGJpcmQgYmxhZGUgYm9hcmQgYm9hdCBib25lIGJvb2sgYm9vdCBib3R0bGUgYm94IGJveSBicmFpbiBicmFrZSBicmFuY2ggYnJpY2sgYnJpZGdlIGJydXNoIGJ1Y2tldCBidWxiIGJ1dHRvbiBjYWtlIGNhbWVyYSBjYXJkIGNhcnJpYWdlIGNhcnQgY2F0IGNoYWluIGNoZWVzZSBjaGVzdCBjaGluIGNodXJjaCBjaXJjbGUgY2xvY2sgY2xvdWQgY29hdCBjb2xsYXIgY29tYiBjb3JkIGNvdyBjdXAgY3VydGFpbiBjdXNoaW9uIGRvZyBkb29yIGRyYWluIGRyYXdlciBkcmVzcyBkcm9wIGVhciBlZ2cgZW5naW5lIGV5ZSBmYWNlIGZhcm0gZmVhdGhlciBmaW5nZXIgZmlzaCBmbGFnIGZsb29yIGZseSBmb290IGZvcmsgZm93bCBmcmFtZSBnYXJkZW4gZ2lybCBnbG92ZSBnb2F0IGd1biBoYWlyIGhhbW1lciBoYW5kIGhhdCBoZWFkIGhlYXJ0IGhvb2sgaG9ybiBob3JzZSBob3NwaXRhbCBob3VzZSBpc2xhbmQgamV3ZWwga2V0dGxlIGtleSBrbmVlIGtuaWZlIGtub3QgbGVhZiBsZWcgbGlicmFyeSBsaW5lIGxpcCBsb2NrIG1hcCBtYXRjaCBtb25rZXkgbW9vbiBtb3V0aCBtdXNjbGUgbmFpbCBuZWNrIG5lZWRsZSBuZXJ2ZSBuZXQgbm9zZSBudXQgb2ZmaWNlIG9yYW5nZSBvdmVuIHBhcmNlbCBwZW4gcGVuY2lsIHBpY3R1cmUgcGlnIHBpbiBwaXBlIHBsYW5lIHBsYXRlIHBsb3VnaCBwb2NrZXQgcG90IHBvdGF0byBwcmlzb24gcHVtcCByYWlsIHJhdCByZWNlaXB0IHJpbmcgcm9kIHJvb2Ygcm9vdCBzYWlsIHNjaG9vbCBzY2lzc29ycyBzY3JldyBzZWVkIHNoZWVwIHNoZWxmIHNoaXAgc2hpcnQgc2hvZSBza2luIHNraXJ0IHNuYWtlIHNvY2sgc3BhZGUgc3BvbmdlIHNwb29uIHNwcmluZyBzcXVhcmUgc3RhbXAgc3RhciBzdGF0aW9uIHN0ZW0gc3RpY2sgc3RvY2tpbmcgc3RvbWFjaCBzdG9yZSBzdHJlZXQgc3VuIHRhYmxlIHRhaWwgdGhyZWFkIHRocm9hdCB0aHVtYiB0aWNrZXQgdG9lIHRvbmd1ZSB0b290aCB0b3duIHRyYWluIHRyYXkgdHJlZSB0cm91c2VycyB1bWJyZWxsYSB3YWxsIHdhdGNoIHdoZWVsIHdoaXAgd2hpc3RsZSB3aW5kb3cgd2luZyB3aXJlIHdvcm0nLnNwbGl0KCcgJyk7XG4gIHZhciBRVUFMSVRJRVMgPSAnYWJsZSBhY2lkIGFuZ3J5IGF1dG9tYXRpYyBiZWF1dGlmdWwgYmxhY2sgYm9pbGluZyBicmlnaHQgYnJva2VuIGJyb3duIGNoZWFwIGNoZW1pY2FsIGNoaWVmIGNsZWFuIGNsZWFyIGNvbW1vbiBjb21wbGV4IGNvbnNjaW91cyBjdXAgZGVlcCBkZXBlbmRlbnQgZWFybHkgZWxhc3RpYyBlbGVjdHJpYyBlcXVhbCBmYXQgZmVydGlsZSBmaXJzdCBmaXhlZCBmbGF0IGZyZWUgZnJlcXVlbnQgZnVsbCBnZW5lcmFsIGdvb2QgZ3JlYXQgZ3JleSBoYW5naW5nIGhhcHB5IGhhcmQgaGVhbHRoeSBoaWdoIGhvbGxvdyBpbXBvcnRhbnQga2luZCBsaWtlIGxpdmluZyBsb25nIG1hbGUgbWFycmllZCBtYXRlcmlhbCBtZWRpY2FsIG1pbGl0YXJ5IG5hdHVyYWwgbmVjZXNzYXJ5IG5ldyBub3JtYWwgb3BlbiBwYXJhbGxlbCBwYXN0IHBoeXNpY2FsIHBvbGl0aWNhbCBwb29yIHBvc3NpYmxlIHByZXNlbnQgcHJpdmF0ZSBwcm9iYWJsZSBxdWljayBxdWlldCByZWFkeSByZWQgcmVndWxhciByZXNwb25zaWJsZSByaWdodCByb3VuZCBzYW1lIHNlY29uZCBzZXBhcmF0ZSBzZXJpb3VzIHNoYXJwIHNtb290aCBzdGlja3kgc3RpZmYgc3RyYWlnaHQgc3Ryb25nIHN1ZGRlbiBzd2VldCB0YWxsIHRoaWNrIHRpZ2h0IHRpcmVkIHRydWUgdmlvbGVudCB3YWl0aW5nIHdhcm0gd2V0IHdpZGUgd2lzZSB5ZWxsb3cgeW91bmcnLnNwbGl0KCcgJyk7XG4gIGZ1bmN0aW9uIHBpY2sgKGNvbGwpIHtcbiAgICByZXR1cm4gY29sbFtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjb2xsLmxlbmd0aCldO1xuICB9XG4gIGZ1bmN0aW9uIGNhcCAod29yZCkge1xuICAgIHJldHVybiB3b3JkWzBdLnRvVXBwZXJDYXNlKCkrd29yZC5zbGljZSgxKTtcbiAgfVxuICB2YXIgaWQgPSAwO1xuICBmdW5jdGlvbiBnZW4gKCkge1xuICAgIGNhbGxiYWNrKHtcbiAgICAgIGlkOiArK2lkLFxuICAgICAgdGl0bGU6IGNhcChwaWNrKFFVQUxJVElFUykpICsgJyAnICsgcGljayhQSUNUVVJBQkxFUykgKyAoTWF0aC5yYW5kb20oKSA8IDAuNCA/ICcnIDogJyAnICsgcGljayhPUEVSQVRPUlMpICsgJyAnICsgcGljayhHRU5FUkFMKSksXG4gICAgICBkYXRlOiBEYXRlLm5vdygpIC0gTWF0aC5mbG9vcigyICogNjAgKiA2MCAqIDEwMDAgKiBNYXRoLnJhbmRvbSgpKSxcbiAgICAgIHVybDogJ2h0dHBzOi8vdW5zcGxhc2guaXQvNDAwLzQwMC8/cmFuZG9tPScgKyBpZCArIERhdGUubm93KCksXG4gICAgICBhdXRob3JOYW1lOiBwaWNrKEdFTkVSQUwpLnNsaWNlKDAsIDIgKyBNYXRoLmZsb29yKDMqTWF0aC5yYW5kb20oKSkpICsgcGljayhHRU5FUkFMKS5zbGljZSgtNSArIE1hdGguZmxvb3IoNSpNYXRoLnJhbmRvbSgpKSksXG4gICAgICBsaWtlczogTWF0aC5mbG9vcig1MDAgKiBNYXRoLnJhbmRvbSgpICogTWF0aC5yYW5kb20oKSlcbiAgICB9KTtcbiAgfVxuICBmb3IgKHZhciBpPTEwICogTWF0aC5yYW5kb20oKTsgaTwyMDsgaSsrKSBnZW4oKTtcbiAgLy8gc2V0SW50ZXJ2YWwoZ2VuLCAxMDAwMCk7XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vKmdsb2JhbHMgSGFuZGxlYmFyczogdHJ1ZSAqL1xudmFyIGJhc2UgPSByZXF1aXJlKFwiLi9oYW5kbGViYXJzL2Jhc2VcIik7XG5cbi8vIEVhY2ggb2YgdGhlc2UgYXVnbWVudCB0aGUgSGFuZGxlYmFycyBvYmplY3QuIE5vIG5lZWQgdG8gc2V0dXAgaGVyZS5cbi8vIChUaGlzIGlzIGRvbmUgdG8gZWFzaWx5IHNoYXJlIGNvZGUgYmV0d2VlbiBjb21tb25qcyBhbmQgYnJvd3NlIGVudnMpXG52YXIgU2FmZVN0cmluZyA9IHJlcXVpcmUoXCIuL2hhbmRsZWJhcnMvc2FmZS1zdHJpbmdcIilbXCJkZWZhdWx0XCJdO1xudmFyIEV4Y2VwdGlvbiA9IHJlcXVpcmUoXCIuL2hhbmRsZWJhcnMvZXhjZXB0aW9uXCIpW1wiZGVmYXVsdFwiXTtcbnZhciBVdGlscyA9IHJlcXVpcmUoXCIuL2hhbmRsZWJhcnMvdXRpbHNcIik7XG52YXIgcnVudGltZSA9IHJlcXVpcmUoXCIuL2hhbmRsZWJhcnMvcnVudGltZVwiKTtcblxuLy8gRm9yIGNvbXBhdGliaWxpdHkgYW5kIHVzYWdlIG91dHNpZGUgb2YgbW9kdWxlIHN5c3RlbXMsIG1ha2UgdGhlIEhhbmRsZWJhcnMgb2JqZWN0IGEgbmFtZXNwYWNlXG52YXIgY3JlYXRlID0gZnVuY3Rpb24oKSB7XG4gIHZhciBoYiA9IG5ldyBiYXNlLkhhbmRsZWJhcnNFbnZpcm9ubWVudCgpO1xuXG4gIFV0aWxzLmV4dGVuZChoYiwgYmFzZSk7XG4gIGhiLlNhZmVTdHJpbmcgPSBTYWZlU3RyaW5nO1xuICBoYi5FeGNlcHRpb24gPSBFeGNlcHRpb247XG4gIGhiLlV0aWxzID0gVXRpbHM7XG4gIGhiLmVzY2FwZUV4cHJlc3Npb24gPSBVdGlscy5lc2NhcGVFeHByZXNzaW9uO1xuXG4gIGhiLlZNID0gcnVudGltZTtcbiAgaGIudGVtcGxhdGUgPSBmdW5jdGlvbihzcGVjKSB7XG4gICAgcmV0dXJuIHJ1bnRpbWUudGVtcGxhdGUoc3BlYywgaGIpO1xuICB9O1xuXG4gIHJldHVybiBoYjtcbn07XG5cbnZhciBIYW5kbGViYXJzID0gY3JlYXRlKCk7XG5IYW5kbGViYXJzLmNyZWF0ZSA9IGNyZWF0ZTtcblxuLypqc2hpbnQgLVcwNDAgKi9cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG52YXIgcm9vdCA9IHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnID8gZ2xvYmFsIDogd2luZG93LFxuICAgICRIYW5kbGViYXJzID0gcm9vdC5IYW5kbGViYXJzO1xuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbkhhbmRsZWJhcnMubm9Db25mbGljdCA9IGZ1bmN0aW9uKCkge1xuICBpZiAocm9vdC5IYW5kbGViYXJzID09PSBIYW5kbGViYXJzKSB7XG4gICAgcm9vdC5IYW5kbGViYXJzID0gJEhhbmRsZWJhcnM7XG4gIH1cbn07XG5cbkhhbmRsZWJhcnNbJ2RlZmF1bHQnXSA9IEhhbmRsZWJhcnM7XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gSGFuZGxlYmFyczsiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBVdGlscyA9IHJlcXVpcmUoXCIuL3V0aWxzXCIpO1xudmFyIEV4Y2VwdGlvbiA9IHJlcXVpcmUoXCIuL2V4Y2VwdGlvblwiKVtcImRlZmF1bHRcIl07XG5cbnZhciBWRVJTSU9OID0gXCIzLjAuMFwiO1xuZXhwb3J0cy5WRVJTSU9OID0gVkVSU0lPTjt2YXIgQ09NUElMRVJfUkVWSVNJT04gPSA2O1xuZXhwb3J0cy5DT01QSUxFUl9SRVZJU0lPTiA9IENPTVBJTEVSX1JFVklTSU9OO1xudmFyIFJFVklTSU9OX0NIQU5HRVMgPSB7XG4gIDE6ICc8PSAxLjAucmMuMicsIC8vIDEuMC5yYy4yIGlzIGFjdHVhbGx5IHJldjIgYnV0IGRvZXNuJ3QgcmVwb3J0IGl0XG4gIDI6ICc9PSAxLjAuMC1yYy4zJyxcbiAgMzogJz09IDEuMC4wLXJjLjQnLFxuICA0OiAnPT0gMS54LngnLFxuICA1OiAnPT0gMi4wLjAtYWxwaGEueCcsXG4gIDY6ICc+PSAyLjAuMC1iZXRhLjEnXG59O1xuZXhwb3J0cy5SRVZJU0lPTl9DSEFOR0VTID0gUkVWSVNJT05fQ0hBTkdFUztcbnZhciBpc0FycmF5ID0gVXRpbHMuaXNBcnJheSxcbiAgICBpc0Z1bmN0aW9uID0gVXRpbHMuaXNGdW5jdGlvbixcbiAgICB0b1N0cmluZyA9IFV0aWxzLnRvU3RyaW5nLFxuICAgIG9iamVjdFR5cGUgPSAnW29iamVjdCBPYmplY3RdJztcblxuZnVuY3Rpb24gSGFuZGxlYmFyc0Vudmlyb25tZW50KGhlbHBlcnMsIHBhcnRpYWxzKSB7XG4gIHRoaXMuaGVscGVycyA9IGhlbHBlcnMgfHwge307XG4gIHRoaXMucGFydGlhbHMgPSBwYXJ0aWFscyB8fCB7fTtcblxuICByZWdpc3RlckRlZmF1bHRIZWxwZXJzKHRoaXMpO1xufVxuXG5leHBvcnRzLkhhbmRsZWJhcnNFbnZpcm9ubWVudCA9IEhhbmRsZWJhcnNFbnZpcm9ubWVudDtIYW5kbGViYXJzRW52aXJvbm1lbnQucHJvdG90eXBlID0ge1xuICBjb25zdHJ1Y3RvcjogSGFuZGxlYmFyc0Vudmlyb25tZW50LFxuXG4gIGxvZ2dlcjogbG9nZ2VyLFxuICBsb2c6IGxvZyxcblxuICByZWdpc3RlckhlbHBlcjogZnVuY3Rpb24obmFtZSwgZm4pIHtcbiAgICBpZiAodG9TdHJpbmcuY2FsbChuYW1lKSA9PT0gb2JqZWN0VHlwZSkge1xuICAgICAgaWYgKGZuKSB7IHRocm93IG5ldyBFeGNlcHRpb24oJ0FyZyBub3Qgc3VwcG9ydGVkIHdpdGggbXVsdGlwbGUgaGVscGVycycpOyB9XG4gICAgICBVdGlscy5leHRlbmQodGhpcy5oZWxwZXJzLCBuYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5oZWxwZXJzW25hbWVdID0gZm47XG4gICAgfVxuICB9LFxuICB1bnJlZ2lzdGVySGVscGVyOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgZGVsZXRlIHRoaXMuaGVscGVyc1tuYW1lXTtcbiAgfSxcblxuICByZWdpc3RlclBhcnRpYWw6IGZ1bmN0aW9uKG5hbWUsIHBhcnRpYWwpIHtcbiAgICBpZiAodG9TdHJpbmcuY2FsbChuYW1lKSA9PT0gb2JqZWN0VHlwZSkge1xuICAgICAgVXRpbHMuZXh0ZW5kKHRoaXMucGFydGlhbHMsICBuYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHR5cGVvZiBwYXJ0aWFsID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKCdBdHRlbXB0aW5nIHRvIHJlZ2lzdGVyIGEgcGFydGlhbCBhcyB1bmRlZmluZWQnKTtcbiAgICAgIH1cbiAgICAgIHRoaXMucGFydGlhbHNbbmFtZV0gPSBwYXJ0aWFsO1xuICAgIH1cbiAgfSxcbiAgdW5yZWdpc3RlclBhcnRpYWw6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBkZWxldGUgdGhpcy5wYXJ0aWFsc1tuYW1lXTtcbiAgfVxufTtcblxuZnVuY3Rpb24gcmVnaXN0ZXJEZWZhdWx0SGVscGVycyhpbnN0YW5jZSkge1xuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignaGVscGVyTWlzc2luZycsIGZ1bmN0aW9uKC8qIFthcmdzLCBdb3B0aW9ucyAqLykge1xuICAgIGlmKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgIC8vIEEgbWlzc2luZyBmaWVsZCBpbiBhIHt7Zm9vfX0gY29uc3R1Y3QuXG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBTb21lb25lIGlzIGFjdHVhbGx5IHRyeWluZyB0byBjYWxsIHNvbWV0aGluZywgYmxvdyB1cC5cbiAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJNaXNzaW5nIGhlbHBlcjogJ1wiICsgYXJndW1lbnRzW2FyZ3VtZW50cy5sZW5ndGgtMV0ubmFtZSArIFwiJ1wiKTtcbiAgICB9XG4gIH0pO1xuXG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCdibG9ja0hlbHBlck1pc3NpbmcnLCBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgdmFyIGludmVyc2UgPSBvcHRpb25zLmludmVyc2UsXG4gICAgICAgIGZuID0gb3B0aW9ucy5mbjtcblxuICAgIGlmKGNvbnRleHQgPT09IHRydWUpIHtcbiAgICAgIHJldHVybiBmbih0aGlzKTtcbiAgICB9IGVsc2UgaWYoY29udGV4dCA9PT0gZmFsc2UgfHwgY29udGV4dCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gaW52ZXJzZSh0aGlzKTtcbiAgICB9IGVsc2UgaWYgKGlzQXJyYXkoY29udGV4dCkpIHtcbiAgICAgIGlmKGNvbnRleHQubGVuZ3RoID4gMCkge1xuICAgICAgICBpZiAob3B0aW9ucy5pZHMpIHtcbiAgICAgICAgICBvcHRpb25zLmlkcyA9IFtvcHRpb25zLm5hbWVdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGluc3RhbmNlLmhlbHBlcnMuZWFjaChjb250ZXh0LCBvcHRpb25zKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBpbnZlcnNlKHRoaXMpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAob3B0aW9ucy5kYXRhICYmIG9wdGlvbnMuaWRzKSB7XG4gICAgICAgIHZhciBkYXRhID0gY3JlYXRlRnJhbWUob3B0aW9ucy5kYXRhKTtcbiAgICAgICAgZGF0YS5jb250ZXh0UGF0aCA9IFV0aWxzLmFwcGVuZENvbnRleHRQYXRoKG9wdGlvbnMuZGF0YS5jb250ZXh0UGF0aCwgb3B0aW9ucy5uYW1lKTtcbiAgICAgICAgb3B0aW9ucyA9IHtkYXRhOiBkYXRhfTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZuKGNvbnRleHQsIG9wdGlvbnMpO1xuICAgIH1cbiAgfSk7XG5cbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2VhY2gnLCBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgaWYgKCFvcHRpb25zKSB7XG4gICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKCdNdXN0IHBhc3MgaXRlcmF0b3IgdG8gI2VhY2gnKTtcbiAgICB9XG5cbiAgICB2YXIgZm4gPSBvcHRpb25zLmZuLCBpbnZlcnNlID0gb3B0aW9ucy5pbnZlcnNlO1xuICAgIHZhciBpID0gMCwgcmV0ID0gXCJcIiwgZGF0YTtcblxuICAgIHZhciBjb250ZXh0UGF0aDtcbiAgICBpZiAob3B0aW9ucy5kYXRhICYmIG9wdGlvbnMuaWRzKSB7XG4gICAgICBjb250ZXh0UGF0aCA9IFV0aWxzLmFwcGVuZENvbnRleHRQYXRoKG9wdGlvbnMuZGF0YS5jb250ZXh0UGF0aCwgb3B0aW9ucy5pZHNbMF0pICsgJy4nO1xuICAgIH1cblxuICAgIGlmIChpc0Z1bmN0aW9uKGNvbnRleHQpKSB7IGNvbnRleHQgPSBjb250ZXh0LmNhbGwodGhpcyk7IH1cblxuICAgIGlmIChvcHRpb25zLmRhdGEpIHtcbiAgICAgIGRhdGEgPSBjcmVhdGVGcmFtZShvcHRpb25zLmRhdGEpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGV4ZWNJdGVyYXRpb24oa2V5LCBpLCBsYXN0KSB7XG4gICAgICBpZiAoZGF0YSkge1xuICAgICAgICBkYXRhLmtleSA9IGtleTtcbiAgICAgICAgZGF0YS5pbmRleCA9IGk7XG4gICAgICAgIGRhdGEuZmlyc3QgPSBpID09PSAwO1xuICAgICAgICBkYXRhLmxhc3QgID0gISFsYXN0O1xuXG4gICAgICAgIGlmIChjb250ZXh0UGF0aCkge1xuICAgICAgICAgIGRhdGEuY29udGV4dFBhdGggPSBjb250ZXh0UGF0aCArIGtleTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXQgPSByZXQgKyBmbihjb250ZXh0W2tleV0sIHtcbiAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgYmxvY2tQYXJhbXM6IFV0aWxzLmJsb2NrUGFyYW1zKFtjb250ZXh0W2tleV0sIGtleV0sIFtjb250ZXh0UGF0aCArIGtleSwgbnVsbF0pXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZihjb250ZXh0ICYmIHR5cGVvZiBjb250ZXh0ID09PSAnb2JqZWN0Jykge1xuICAgICAgaWYgKGlzQXJyYXkoY29udGV4dCkpIHtcbiAgICAgICAgZm9yKHZhciBqID0gY29udGV4dC5sZW5ndGg7IGk8ajsgaSsrKSB7XG4gICAgICAgICAgZXhlY0l0ZXJhdGlvbihpLCBpLCBpID09PSBjb250ZXh0Lmxlbmd0aC0xKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHByaW9yS2V5O1xuXG4gICAgICAgIGZvcih2YXIga2V5IGluIGNvbnRleHQpIHtcbiAgICAgICAgICBpZihjb250ZXh0Lmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgIC8vIFdlJ3JlIHJ1bm5pbmcgdGhlIGl0ZXJhdGlvbnMgb25lIHN0ZXAgb3V0IG9mIHN5bmMgc28gd2UgY2FuIGRldGVjdFxuICAgICAgICAgICAgLy8gdGhlIGxhc3QgaXRlcmF0aW9uIHdpdGhvdXQgaGF2ZSB0byBzY2FuIHRoZSBvYmplY3QgdHdpY2UgYW5kIGNyZWF0ZVxuICAgICAgICAgICAgLy8gYW4gaXRlcm1lZGlhdGUga2V5cyBhcnJheS4gXG4gICAgICAgICAgICBpZiAocHJpb3JLZXkpIHtcbiAgICAgICAgICAgICAgZXhlY0l0ZXJhdGlvbihwcmlvcktleSwgaS0xKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHByaW9yS2V5ID0ga2V5O1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAocHJpb3JLZXkpIHtcbiAgICAgICAgICBleGVjSXRlcmF0aW9uKHByaW9yS2V5LCBpLTEsIHRydWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYoaSA9PT0gMCl7XG4gICAgICByZXQgPSBpbnZlcnNlKHRoaXMpO1xuICAgIH1cblxuICAgIHJldHVybiByZXQ7XG4gIH0pO1xuXG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCdpZicsIGZ1bmN0aW9uKGNvbmRpdGlvbmFsLCBvcHRpb25zKSB7XG4gICAgaWYgKGlzRnVuY3Rpb24oY29uZGl0aW9uYWwpKSB7IGNvbmRpdGlvbmFsID0gY29uZGl0aW9uYWwuY2FsbCh0aGlzKTsgfVxuXG4gICAgLy8gRGVmYXVsdCBiZWhhdmlvciBpcyB0byByZW5kZXIgdGhlIHBvc2l0aXZlIHBhdGggaWYgdGhlIHZhbHVlIGlzIHRydXRoeSBhbmQgbm90IGVtcHR5LlxuICAgIC8vIFRoZSBgaW5jbHVkZVplcm9gIG9wdGlvbiBtYXkgYmUgc2V0IHRvIHRyZWF0IHRoZSBjb25kdGlvbmFsIGFzIHB1cmVseSBub3QgZW1wdHkgYmFzZWQgb24gdGhlXG4gICAgLy8gYmVoYXZpb3Igb2YgaXNFbXB0eS4gRWZmZWN0aXZlbHkgdGhpcyBkZXRlcm1pbmVzIGlmIDAgaXMgaGFuZGxlZCBieSB0aGUgcG9zaXRpdmUgcGF0aCBvciBuZWdhdGl2ZS5cbiAgICBpZiAoKCFvcHRpb25zLmhhc2guaW5jbHVkZVplcm8gJiYgIWNvbmRpdGlvbmFsKSB8fCBVdGlscy5pc0VtcHR5KGNvbmRpdGlvbmFsKSkge1xuICAgICAgcmV0dXJuIG9wdGlvbnMuaW52ZXJzZSh0aGlzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG9wdGlvbnMuZm4odGhpcyk7XG4gICAgfVxuICB9KTtcblxuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcigndW5sZXNzJywgZnVuY3Rpb24oY29uZGl0aW9uYWwsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gaW5zdGFuY2UuaGVscGVyc1snaWYnXS5jYWxsKHRoaXMsIGNvbmRpdGlvbmFsLCB7Zm46IG9wdGlvbnMuaW52ZXJzZSwgaW52ZXJzZTogb3B0aW9ucy5mbiwgaGFzaDogb3B0aW9ucy5oYXNofSk7XG4gIH0pO1xuXG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCd3aXRoJywgZnVuY3Rpb24oY29udGV4dCwgb3B0aW9ucykge1xuICAgIGlmIChpc0Z1bmN0aW9uKGNvbnRleHQpKSB7IGNvbnRleHQgPSBjb250ZXh0LmNhbGwodGhpcyk7IH1cblxuICAgIHZhciBmbiA9IG9wdGlvbnMuZm47XG5cbiAgICBpZiAoIVV0aWxzLmlzRW1wdHkoY29udGV4dCkpIHtcbiAgICAgIGlmIChvcHRpb25zLmRhdGEgJiYgb3B0aW9ucy5pZHMpIHtcbiAgICAgICAgdmFyIGRhdGEgPSBjcmVhdGVGcmFtZShvcHRpb25zLmRhdGEpO1xuICAgICAgICBkYXRhLmNvbnRleHRQYXRoID0gVXRpbHMuYXBwZW5kQ29udGV4dFBhdGgob3B0aW9ucy5kYXRhLmNvbnRleHRQYXRoLCBvcHRpb25zLmlkc1swXSk7XG4gICAgICAgIG9wdGlvbnMgPSB7ZGF0YTpkYXRhfTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZuKGNvbnRleHQsIG9wdGlvbnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gb3B0aW9ucy5pbnZlcnNlKHRoaXMpO1xuICAgIH1cbiAgfSk7XG5cbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2xvZycsIGZ1bmN0aW9uKG1lc3NhZ2UsIG9wdGlvbnMpIHtcbiAgICB2YXIgbGV2ZWwgPSBvcHRpb25zLmRhdGEgJiYgb3B0aW9ucy5kYXRhLmxldmVsICE9IG51bGwgPyBwYXJzZUludChvcHRpb25zLmRhdGEubGV2ZWwsIDEwKSA6IDE7XG4gICAgaW5zdGFuY2UubG9nKGxldmVsLCBtZXNzYWdlKTtcbiAgfSk7XG5cbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2xvb2t1cCcsIGZ1bmN0aW9uKG9iaiwgZmllbGQpIHtcbiAgICByZXR1cm4gb2JqICYmIG9ialtmaWVsZF07XG4gIH0pO1xufVxuXG52YXIgbG9nZ2VyID0ge1xuICBtZXRob2RNYXA6IHsgMDogJ2RlYnVnJywgMTogJ2luZm8nLCAyOiAnd2FybicsIDM6ICdlcnJvcicgfSxcblxuICAvLyBTdGF0ZSBlbnVtXG4gIERFQlVHOiAwLFxuICBJTkZPOiAxLFxuICBXQVJOOiAyLFxuICBFUlJPUjogMyxcbiAgbGV2ZWw6IDEsXG5cbiAgLy8gQ2FuIGJlIG92ZXJyaWRkZW4gaW4gdGhlIGhvc3QgZW52aXJvbm1lbnRcbiAgbG9nOiBmdW5jdGlvbihsZXZlbCwgbWVzc2FnZSkge1xuICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbG9nZ2VyLmxldmVsIDw9IGxldmVsKSB7XG4gICAgICB2YXIgbWV0aG9kID0gbG9nZ2VyLm1ldGhvZE1hcFtsZXZlbF07XG4gICAgICAoY29uc29sZVttZXRob2RdIHx8IGNvbnNvbGUubG9nKS5jYWxsKGNvbnNvbGUsIG1lc3NhZ2UpO1xuICAgIH1cbiAgfVxufTtcbmV4cG9ydHMubG9nZ2VyID0gbG9nZ2VyO1xudmFyIGxvZyA9IGxvZ2dlci5sb2c7XG5leHBvcnRzLmxvZyA9IGxvZztcbnZhciBjcmVhdGVGcmFtZSA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICB2YXIgZnJhbWUgPSBVdGlscy5leHRlbmQoe30sIG9iamVjdCk7XG4gIGZyYW1lLl9wYXJlbnQgPSBvYmplY3Q7XG4gIHJldHVybiBmcmFtZTtcbn07XG5leHBvcnRzLmNyZWF0ZUZyYW1lID0gY3JlYXRlRnJhbWU7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBlcnJvclByb3BzID0gWydkZXNjcmlwdGlvbicsICdmaWxlTmFtZScsICdsaW5lTnVtYmVyJywgJ21lc3NhZ2UnLCAnbmFtZScsICdudW1iZXInLCAnc3RhY2snXTtcblxuZnVuY3Rpb24gRXhjZXB0aW9uKG1lc3NhZ2UsIG5vZGUpIHtcbiAgdmFyIGxvYyA9IG5vZGUgJiYgbm9kZS5sb2MsXG4gICAgICBsaW5lLFxuICAgICAgY29sdW1uO1xuICBpZiAobG9jKSB7XG4gICAgbGluZSA9IGxvYy5zdGFydC5saW5lO1xuICAgIGNvbHVtbiA9IGxvYy5zdGFydC5jb2x1bW47XG5cbiAgICBtZXNzYWdlICs9ICcgLSAnICsgbGluZSArICc6JyArIGNvbHVtbjtcbiAgfVxuXG4gIHZhciB0bXAgPSBFcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IuY2FsbCh0aGlzLCBtZXNzYWdlKTtcblxuICAvLyBVbmZvcnR1bmF0ZWx5IGVycm9ycyBhcmUgbm90IGVudW1lcmFibGUgaW4gQ2hyb21lIChhdCBsZWFzdCksIHNvIGBmb3IgcHJvcCBpbiB0bXBgIGRvZXNuJ3Qgd29yay5cbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgZXJyb3JQcm9wcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgdGhpc1tlcnJvclByb3BzW2lkeF1dID0gdG1wW2Vycm9yUHJvcHNbaWR4XV07XG4gIH1cblxuICBpZiAobG9jKSB7XG4gICAgdGhpcy5saW5lTnVtYmVyID0gbGluZTtcbiAgICB0aGlzLmNvbHVtbiA9IGNvbHVtbjtcbiAgfVxufVxuXG5FeGNlcHRpb24ucHJvdG90eXBlID0gbmV3IEVycm9yKCk7XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gRXhjZXB0aW9uOyIsIlwidXNlIHN0cmljdFwiO1xudmFyIFV0aWxzID0gcmVxdWlyZShcIi4vdXRpbHNcIik7XG52YXIgRXhjZXB0aW9uID0gcmVxdWlyZShcIi4vZXhjZXB0aW9uXCIpW1wiZGVmYXVsdFwiXTtcbnZhciBDT01QSUxFUl9SRVZJU0lPTiA9IHJlcXVpcmUoXCIuL2Jhc2VcIikuQ09NUElMRVJfUkVWSVNJT047XG52YXIgUkVWSVNJT05fQ0hBTkdFUyA9IHJlcXVpcmUoXCIuL2Jhc2VcIikuUkVWSVNJT05fQ0hBTkdFUztcbnZhciBjcmVhdGVGcmFtZSA9IHJlcXVpcmUoXCIuL2Jhc2VcIikuY3JlYXRlRnJhbWU7XG5cbmZ1bmN0aW9uIGNoZWNrUmV2aXNpb24oY29tcGlsZXJJbmZvKSB7XG4gIHZhciBjb21waWxlclJldmlzaW9uID0gY29tcGlsZXJJbmZvICYmIGNvbXBpbGVySW5mb1swXSB8fCAxLFxuICAgICAgY3VycmVudFJldmlzaW9uID0gQ09NUElMRVJfUkVWSVNJT047XG5cbiAgaWYgKGNvbXBpbGVyUmV2aXNpb24gIT09IGN1cnJlbnRSZXZpc2lvbikge1xuICAgIGlmIChjb21waWxlclJldmlzaW9uIDwgY3VycmVudFJldmlzaW9uKSB7XG4gICAgICB2YXIgcnVudGltZVZlcnNpb25zID0gUkVWSVNJT05fQ0hBTkdFU1tjdXJyZW50UmV2aXNpb25dLFxuICAgICAgICAgIGNvbXBpbGVyVmVyc2lvbnMgPSBSRVZJU0lPTl9DSEFOR0VTW2NvbXBpbGVyUmV2aXNpb25dO1xuICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcIlRlbXBsYXRlIHdhcyBwcmVjb21waWxlZCB3aXRoIGFuIG9sZGVyIHZlcnNpb24gb2YgSGFuZGxlYmFycyB0aGFuIHRoZSBjdXJyZW50IHJ1bnRpbWUuIFwiK1xuICAgICAgICAgICAgXCJQbGVhc2UgdXBkYXRlIHlvdXIgcHJlY29tcGlsZXIgdG8gYSBuZXdlciB2ZXJzaW9uIChcIitydW50aW1lVmVyc2lvbnMrXCIpIG9yIGRvd25ncmFkZSB5b3VyIHJ1bnRpbWUgdG8gYW4gb2xkZXIgdmVyc2lvbiAoXCIrY29tcGlsZXJWZXJzaW9ucytcIikuXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBVc2UgdGhlIGVtYmVkZGVkIHZlcnNpb24gaW5mbyBzaW5jZSB0aGUgcnVudGltZSBkb2Vzbid0IGtub3cgYWJvdXQgdGhpcyByZXZpc2lvbiB5ZXRcbiAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJUZW1wbGF0ZSB3YXMgcHJlY29tcGlsZWQgd2l0aCBhIG5ld2VyIHZlcnNpb24gb2YgSGFuZGxlYmFycyB0aGFuIHRoZSBjdXJyZW50IHJ1bnRpbWUuIFwiK1xuICAgICAgICAgICAgXCJQbGVhc2UgdXBkYXRlIHlvdXIgcnVudGltZSB0byBhIG5ld2VyIHZlcnNpb24gKFwiK2NvbXBpbGVySW5mb1sxXStcIikuXCIpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnRzLmNoZWNrUmV2aXNpb24gPSBjaGVja1JldmlzaW9uOy8vIFRPRE86IFJlbW92ZSB0aGlzIGxpbmUgYW5kIGJyZWFrIHVwIGNvbXBpbGVQYXJ0aWFsXG5cbmZ1bmN0aW9uIHRlbXBsYXRlKHRlbXBsYXRlU3BlYywgZW52KSB7XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIGlmICghZW52KSB7XG4gICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcIk5vIGVudmlyb25tZW50IHBhc3NlZCB0byB0ZW1wbGF0ZVwiKTtcbiAgfVxuICBpZiAoIXRlbXBsYXRlU3BlYyB8fCAhdGVtcGxhdGVTcGVjLm1haW4pIHtcbiAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKCdVbmtub3duIHRlbXBsYXRlIG9iamVjdDogJyArIHR5cGVvZiB0ZW1wbGF0ZVNwZWMpO1xuICB9XG5cbiAgLy8gTm90ZTogVXNpbmcgZW52LlZNIHJlZmVyZW5jZXMgcmF0aGVyIHRoYW4gbG9jYWwgdmFyIHJlZmVyZW5jZXMgdGhyb3VnaG91dCB0aGlzIHNlY3Rpb24gdG8gYWxsb3dcbiAgLy8gZm9yIGV4dGVybmFsIHVzZXJzIHRvIG92ZXJyaWRlIHRoZXNlIGFzIHBzdWVkby1zdXBwb3J0ZWQgQVBJcy5cbiAgZW52LlZNLmNoZWNrUmV2aXNpb24odGVtcGxhdGVTcGVjLmNvbXBpbGVyKTtcblxuICB2YXIgaW52b2tlUGFydGlhbFdyYXBwZXIgPSBmdW5jdGlvbihwYXJ0aWFsLCBjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgaWYgKG9wdGlvbnMuaGFzaCkge1xuICAgICAgY29udGV4dCA9IFV0aWxzLmV4dGVuZCh7fSwgY29udGV4dCwgb3B0aW9ucy5oYXNoKTtcbiAgICB9XG5cbiAgICBwYXJ0aWFsID0gZW52LlZNLnJlc29sdmVQYXJ0aWFsLmNhbGwodGhpcywgcGFydGlhbCwgY29udGV4dCwgb3B0aW9ucyk7XG4gICAgdmFyIHJlc3VsdCA9IGVudi5WTS5pbnZva2VQYXJ0aWFsLmNhbGwodGhpcywgcGFydGlhbCwgY29udGV4dCwgb3B0aW9ucyk7XG5cbiAgICBpZiAocmVzdWx0ID09IG51bGwgJiYgZW52LmNvbXBpbGUpIHtcbiAgICAgIG9wdGlvbnMucGFydGlhbHNbb3B0aW9ucy5uYW1lXSA9IGVudi5jb21waWxlKHBhcnRpYWwsIHRlbXBsYXRlU3BlYy5jb21waWxlck9wdGlvbnMsIGVudik7XG4gICAgICByZXN1bHQgPSBvcHRpb25zLnBhcnRpYWxzW29wdGlvbnMubmFtZV0oY29udGV4dCwgb3B0aW9ucyk7XG4gICAgfVxuICAgIGlmIChyZXN1bHQgIT0gbnVsbCkge1xuICAgICAgaWYgKG9wdGlvbnMuaW5kZW50KSB7XG4gICAgICAgIHZhciBsaW5lcyA9IHJlc3VsdC5zcGxpdCgnXFxuJyk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gbGluZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgaWYgKCFsaW5lc1tpXSAmJiBpICsgMSA9PT0gbCkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbGluZXNbaV0gPSBvcHRpb25zLmluZGVudCArIGxpbmVzW2ldO1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdCA9IGxpbmVzLmpvaW4oJ1xcbicpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcIlRoZSBwYXJ0aWFsIFwiICsgb3B0aW9ucy5uYW1lICsgXCIgY291bGQgbm90IGJlIGNvbXBpbGVkIHdoZW4gcnVubmluZyBpbiBydW50aW1lLW9ubHkgbW9kZVwiKTtcbiAgICB9XG4gIH07XG5cbiAgLy8gSnVzdCBhZGQgd2F0ZXJcbiAgdmFyIGNvbnRhaW5lciA9IHtcbiAgICBzdHJpY3Q6IGZ1bmN0aW9uKG9iaiwgbmFtZSkge1xuICAgICAgaWYgKCEobmFtZSBpbiBvYmopKSB7XG4gICAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oJ1wiJyArIG5hbWUgKyAnXCIgbm90IGRlZmluZWQgaW4gJyArIG9iaik7XG4gICAgICB9XG4gICAgICByZXR1cm4gb2JqW25hbWVdO1xuICAgIH0sXG4gICAgbG9va3VwOiBmdW5jdGlvbihkZXB0aHMsIG5hbWUpIHtcbiAgICAgIHZhciBsZW4gPSBkZXB0aHMubGVuZ3RoO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBpZiAoZGVwdGhzW2ldICYmIGRlcHRoc1tpXVtuYW1lXSAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIGRlcHRoc1tpXVtuYW1lXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgbGFtYmRhOiBmdW5jdGlvbihjdXJyZW50LCBjb250ZXh0KSB7XG4gICAgICByZXR1cm4gdHlwZW9mIGN1cnJlbnQgPT09ICdmdW5jdGlvbicgPyBjdXJyZW50LmNhbGwoY29udGV4dCkgOiBjdXJyZW50O1xuICAgIH0sXG5cbiAgICBlc2NhcGVFeHByZXNzaW9uOiBVdGlscy5lc2NhcGVFeHByZXNzaW9uLFxuICAgIGludm9rZVBhcnRpYWw6IGludm9rZVBhcnRpYWxXcmFwcGVyLFxuXG4gICAgZm46IGZ1bmN0aW9uKGkpIHtcbiAgICAgIHJldHVybiB0ZW1wbGF0ZVNwZWNbaV07XG4gICAgfSxcblxuICAgIHByb2dyYW1zOiBbXSxcbiAgICBwcm9ncmFtOiBmdW5jdGlvbihpLCBkYXRhLCBkZWNsYXJlZEJsb2NrUGFyYW1zLCBibG9ja1BhcmFtcywgZGVwdGhzKSB7XG4gICAgICB2YXIgcHJvZ3JhbVdyYXBwZXIgPSB0aGlzLnByb2dyYW1zW2ldLFxuICAgICAgICAgIGZuID0gdGhpcy5mbihpKTtcbiAgICAgIGlmIChkYXRhIHx8IGRlcHRocyB8fCBibG9ja1BhcmFtcyB8fCBkZWNsYXJlZEJsb2NrUGFyYW1zKSB7XG4gICAgICAgIHByb2dyYW1XcmFwcGVyID0gcHJvZ3JhbSh0aGlzLCBpLCBmbiwgZGF0YSwgZGVjbGFyZWRCbG9ja1BhcmFtcywgYmxvY2tQYXJhbXMsIGRlcHRocyk7XG4gICAgICB9IGVsc2UgaWYgKCFwcm9ncmFtV3JhcHBlcikge1xuICAgICAgICBwcm9ncmFtV3JhcHBlciA9IHRoaXMucHJvZ3JhbXNbaV0gPSBwcm9ncmFtKHRoaXMsIGksIGZuKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBwcm9ncmFtV3JhcHBlcjtcbiAgICB9LFxuXG4gICAgZGF0YTogZnVuY3Rpb24oZGF0YSwgZGVwdGgpIHtcbiAgICAgIHdoaWxlIChkYXRhICYmIGRlcHRoLS0pIHtcbiAgICAgICAgZGF0YSA9IGRhdGEuX3BhcmVudDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH0sXG4gICAgbWVyZ2U6IGZ1bmN0aW9uKHBhcmFtLCBjb21tb24pIHtcbiAgICAgIHZhciByZXQgPSBwYXJhbSB8fCBjb21tb247XG5cbiAgICAgIGlmIChwYXJhbSAmJiBjb21tb24gJiYgKHBhcmFtICE9PSBjb21tb24pKSB7XG4gICAgICAgIHJldCA9IFV0aWxzLmV4dGVuZCh7fSwgY29tbW9uLCBwYXJhbSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXQ7XG4gICAgfSxcblxuICAgIG5vb3A6IGVudi5WTS5ub29wLFxuICAgIGNvbXBpbGVySW5mbzogdGVtcGxhdGVTcGVjLmNvbXBpbGVyXG4gIH07XG5cbiAgdmFyIHJldCA9IGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICB2YXIgZGF0YSA9IG9wdGlvbnMuZGF0YTtcblxuICAgIHJldC5fc2V0dXAob3B0aW9ucyk7XG4gICAgaWYgKCFvcHRpb25zLnBhcnRpYWwgJiYgdGVtcGxhdGVTcGVjLnVzZURhdGEpIHtcbiAgICAgIGRhdGEgPSBpbml0RGF0YShjb250ZXh0LCBkYXRhKTtcbiAgICB9XG4gICAgdmFyIGRlcHRocyxcbiAgICAgICAgYmxvY2tQYXJhbXMgPSB0ZW1wbGF0ZVNwZWMudXNlQmxvY2tQYXJhbXMgPyBbXSA6IHVuZGVmaW5lZDtcbiAgICBpZiAodGVtcGxhdGVTcGVjLnVzZURlcHRocykge1xuICAgICAgZGVwdGhzID0gb3B0aW9ucy5kZXB0aHMgPyBbY29udGV4dF0uY29uY2F0KG9wdGlvbnMuZGVwdGhzKSA6IFtjb250ZXh0XTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGVtcGxhdGVTcGVjLm1haW4uY2FsbChjb250YWluZXIsIGNvbnRleHQsIGNvbnRhaW5lci5oZWxwZXJzLCBjb250YWluZXIucGFydGlhbHMsIGRhdGEsIGJsb2NrUGFyYW1zLCBkZXB0aHMpO1xuICB9O1xuICByZXQuaXNUb3AgPSB0cnVlO1xuXG4gIHJldC5fc2V0dXAgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgaWYgKCFvcHRpb25zLnBhcnRpYWwpIHtcbiAgICAgIGNvbnRhaW5lci5oZWxwZXJzID0gY29udGFpbmVyLm1lcmdlKG9wdGlvbnMuaGVscGVycywgZW52LmhlbHBlcnMpO1xuXG4gICAgICBpZiAodGVtcGxhdGVTcGVjLnVzZVBhcnRpYWwpIHtcbiAgICAgICAgY29udGFpbmVyLnBhcnRpYWxzID0gY29udGFpbmVyLm1lcmdlKG9wdGlvbnMucGFydGlhbHMsIGVudi5wYXJ0aWFscyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnRhaW5lci5oZWxwZXJzID0gb3B0aW9ucy5oZWxwZXJzO1xuICAgICAgY29udGFpbmVyLnBhcnRpYWxzID0gb3B0aW9ucy5wYXJ0aWFscztcbiAgICB9XG4gIH07XG5cbiAgcmV0Ll9jaGlsZCA9IGZ1bmN0aW9uKGksIGRhdGEsIGJsb2NrUGFyYW1zLCBkZXB0aHMpIHtcbiAgICBpZiAodGVtcGxhdGVTcGVjLnVzZUJsb2NrUGFyYW1zICYmICFibG9ja1BhcmFtcykge1xuICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbignbXVzdCBwYXNzIGJsb2NrIHBhcmFtcycpO1xuICAgIH1cbiAgICBpZiAodGVtcGxhdGVTcGVjLnVzZURlcHRocyAmJiAhZGVwdGhzKSB7XG4gICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKCdtdXN0IHBhc3MgcGFyZW50IGRlcHRocycpO1xuICAgIH1cblxuICAgIHJldHVybiBwcm9ncmFtKGNvbnRhaW5lciwgaSwgdGVtcGxhdGVTcGVjW2ldLCBkYXRhLCAwLCBibG9ja1BhcmFtcywgZGVwdGhzKTtcbiAgfTtcbiAgcmV0dXJuIHJldDtcbn1cblxuZXhwb3J0cy50ZW1wbGF0ZSA9IHRlbXBsYXRlO2Z1bmN0aW9uIHByb2dyYW0oY29udGFpbmVyLCBpLCBmbiwgZGF0YSwgZGVjbGFyZWRCbG9ja1BhcmFtcywgYmxvY2tQYXJhbXMsIGRlcHRocykge1xuICB2YXIgcHJvZyA9IGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIHJldHVybiBmbi5jYWxsKGNvbnRhaW5lcixcbiAgICAgICAgY29udGV4dCxcbiAgICAgICAgY29udGFpbmVyLmhlbHBlcnMsIGNvbnRhaW5lci5wYXJ0aWFscyxcbiAgICAgICAgb3B0aW9ucy5kYXRhIHx8IGRhdGEsXG4gICAgICAgIGJsb2NrUGFyYW1zICYmIFtvcHRpb25zLmJsb2NrUGFyYW1zXS5jb25jYXQoYmxvY2tQYXJhbXMpLFxuICAgICAgICBkZXB0aHMgJiYgW2NvbnRleHRdLmNvbmNhdChkZXB0aHMpKTtcbiAgfTtcbiAgcHJvZy5wcm9ncmFtID0gaTtcbiAgcHJvZy5kZXB0aCA9IGRlcHRocyA/IGRlcHRocy5sZW5ndGggOiAwO1xuICBwcm9nLmJsb2NrUGFyYW1zID0gZGVjbGFyZWRCbG9ja1BhcmFtcyB8fCAwO1xuICByZXR1cm4gcHJvZztcbn1cblxuZXhwb3J0cy5wcm9ncmFtID0gcHJvZ3JhbTtmdW5jdGlvbiByZXNvbHZlUGFydGlhbChwYXJ0aWFsLCBjb250ZXh0LCBvcHRpb25zKSB7XG4gIGlmICghcGFydGlhbCkge1xuICAgIHBhcnRpYWwgPSBvcHRpb25zLnBhcnRpYWxzW29wdGlvbnMubmFtZV07XG4gIH0gZWxzZSBpZiAoIXBhcnRpYWwuY2FsbCAmJiAhb3B0aW9ucy5uYW1lKSB7XG4gICAgLy8gVGhpcyBpcyBhIGR5bmFtaWMgcGFydGlhbCB0aGF0IHJldHVybmVkIGEgc3RyaW5nXG4gICAgb3B0aW9ucy5uYW1lID0gcGFydGlhbDtcbiAgICBwYXJ0aWFsID0gb3B0aW9ucy5wYXJ0aWFsc1twYXJ0aWFsXTtcbiAgfVxuICByZXR1cm4gcGFydGlhbDtcbn1cblxuZXhwb3J0cy5yZXNvbHZlUGFydGlhbCA9IHJlc29sdmVQYXJ0aWFsO2Z1bmN0aW9uIGludm9rZVBhcnRpYWwocGFydGlhbCwgY29udGV4dCwgb3B0aW9ucykge1xuICBvcHRpb25zLnBhcnRpYWwgPSB0cnVlO1xuXG4gIGlmKHBhcnRpYWwgPT09IHVuZGVmaW5lZCkge1xuICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJUaGUgcGFydGlhbCBcIiArIG9wdGlvbnMubmFtZSArIFwiIGNvdWxkIG5vdCBiZSBmb3VuZFwiKTtcbiAgfSBlbHNlIGlmKHBhcnRpYWwgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuICAgIHJldHVybiBwYXJ0aWFsKGNvbnRleHQsIG9wdGlvbnMpO1xuICB9XG59XG5cbmV4cG9ydHMuaW52b2tlUGFydGlhbCA9IGludm9rZVBhcnRpYWw7ZnVuY3Rpb24gbm9vcCgpIHsgcmV0dXJuIFwiXCI7IH1cblxuZXhwb3J0cy5ub29wID0gbm9vcDtmdW5jdGlvbiBpbml0RGF0YShjb250ZXh0LCBkYXRhKSB7XG4gIGlmICghZGF0YSB8fCAhKCdyb290JyBpbiBkYXRhKSkge1xuICAgIGRhdGEgPSBkYXRhID8gY3JlYXRlRnJhbWUoZGF0YSkgOiB7fTtcbiAgICBkYXRhLnJvb3QgPSBjb250ZXh0O1xuICB9XG4gIHJldHVybiBkYXRhO1xufSIsIlwidXNlIHN0cmljdFwiO1xuLy8gQnVpbGQgb3V0IG91ciBiYXNpYyBTYWZlU3RyaW5nIHR5cGVcbmZ1bmN0aW9uIFNhZmVTdHJpbmcoc3RyaW5nKSB7XG4gIHRoaXMuc3RyaW5nID0gc3RyaW5nO1xufVxuXG5TYWZlU3RyaW5nLnByb3RvdHlwZS50b1N0cmluZyA9IFNhZmVTdHJpbmcucHJvdG90eXBlLnRvSFRNTCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gXCJcIiArIHRoaXMuc3RyaW5nO1xufTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBTYWZlU3RyaW5nOyIsIlwidXNlIHN0cmljdFwiO1xuLypqc2hpbnQgLVcwMDQgKi9cbnZhciBlc2NhcGUgPSB7XG4gIFwiJlwiOiBcIiZhbXA7XCIsXG4gIFwiPFwiOiBcIiZsdDtcIixcbiAgXCI+XCI6IFwiJmd0O1wiLFxuICAnXCInOiBcIiZxdW90O1wiLFxuICBcIidcIjogXCImI3gyNztcIixcbiAgXCJgXCI6IFwiJiN4NjA7XCJcbn07XG5cbnZhciBiYWRDaGFycyA9IC9bJjw+XCInYF0vZztcbnZhciBwb3NzaWJsZSA9IC9bJjw+XCInYF0vO1xuXG5mdW5jdGlvbiBlc2NhcGVDaGFyKGNocikge1xuICByZXR1cm4gZXNjYXBlW2Nocl07XG59XG5cbmZ1bmN0aW9uIGV4dGVuZChvYmogLyogLCAuLi5zb3VyY2UgKi8pIHtcbiAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gYXJndW1lbnRzW2ldKSB7XG4gICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGFyZ3VtZW50c1tpXSwga2V5KSkge1xuICAgICAgICBvYmpba2V5XSA9IGFyZ3VtZW50c1tpXVtrZXldO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBvYmo7XG59XG5cbmV4cG9ydHMuZXh0ZW5kID0gZXh0ZW5kO3ZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5leHBvcnRzLnRvU3RyaW5nID0gdG9TdHJpbmc7XG4vLyBTb3VyY2VkIGZyb20gbG9kYXNoXG4vLyBodHRwczovL2dpdGh1Yi5jb20vYmVzdGllanMvbG9kYXNoL2Jsb2IvbWFzdGVyL0xJQ0VOU0UudHh0XG52YXIgaXNGdW5jdGlvbiA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbic7XG59O1xuLy8gZmFsbGJhY2sgZm9yIG9sZGVyIHZlcnNpb25zIG9mIENocm9tZSBhbmQgU2FmYXJpXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuaWYgKGlzRnVuY3Rpb24oL3gvKSkge1xuICBpc0Z1bmN0aW9uID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nICYmIHRvU3RyaW5nLmNhbGwodmFsdWUpID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xuICB9O1xufVxudmFyIGlzRnVuY3Rpb247XG5leHBvcnRzLmlzRnVuY3Rpb24gPSBpc0Z1bmN0aW9uO1xuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpID8gdG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09ICdbb2JqZWN0IEFycmF5XScgOiBmYWxzZTtcbn07XG5leHBvcnRzLmlzQXJyYXkgPSBpc0FycmF5O1xuLy8gT2xkZXIgSUUgdmVyc2lvbnMgZG8gbm90IGRpcmVjdGx5IHN1cHBvcnQgaW5kZXhPZiBzbyB3ZSBtdXN0IGltcGxlbWVudCBvdXIgb3duLCBzYWRseS5cbmZ1bmN0aW9uIGluZGV4T2YoYXJyYXksIHZhbHVlKSB7XG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBhcnJheS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIGlmIChhcnJheVtpXSA9PT0gdmFsdWUpIHtcbiAgICAgIHJldHVybiBpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gLTE7XG59XG5cbmV4cG9ydHMuaW5kZXhPZiA9IGluZGV4T2Y7XG5mdW5jdGlvbiBlc2NhcGVFeHByZXNzaW9uKHN0cmluZykge1xuICAvLyBkb24ndCBlc2NhcGUgU2FmZVN0cmluZ3MsIHNpbmNlIHRoZXkncmUgYWxyZWFkeSBzYWZlXG4gIGlmIChzdHJpbmcgJiYgc3RyaW5nLnRvSFRNTCkge1xuICAgIHJldHVybiBzdHJpbmcudG9IVE1MKCk7XG4gIH0gZWxzZSBpZiAoc3RyaW5nID09IG51bGwpIHtcbiAgICByZXR1cm4gXCJcIjtcbiAgfSBlbHNlIGlmICghc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZyArICcnO1xuICB9XG5cbiAgLy8gRm9yY2UgYSBzdHJpbmcgY29udmVyc2lvbiBhcyB0aGlzIHdpbGwgYmUgZG9uZSBieSB0aGUgYXBwZW5kIHJlZ2FyZGxlc3MgYW5kXG4gIC8vIHRoZSByZWdleCB0ZXN0IHdpbGwgZG8gdGhpcyB0cmFuc3BhcmVudGx5IGJlaGluZCB0aGUgc2NlbmVzLCBjYXVzaW5nIGlzc3VlcyBpZlxuICAvLyBhbiBvYmplY3QncyB0byBzdHJpbmcgaGFzIGVzY2FwZWQgY2hhcmFjdGVycyBpbiBpdC5cbiAgc3RyaW5nID0gXCJcIiArIHN0cmluZztcblxuICBpZighcG9zc2libGUudGVzdChzdHJpbmcpKSB7IHJldHVybiBzdHJpbmc7IH1cbiAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKGJhZENoYXJzLCBlc2NhcGVDaGFyKTtcbn1cblxuZXhwb3J0cy5lc2NhcGVFeHByZXNzaW9uID0gZXNjYXBlRXhwcmVzc2lvbjtmdW5jdGlvbiBpc0VtcHR5KHZhbHVlKSB7XG4gIGlmICghdmFsdWUgJiYgdmFsdWUgIT09IDApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIGlmIChpc0FycmF5KHZhbHVlKSAmJiB2YWx1ZS5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuZXhwb3J0cy5pc0VtcHR5ID0gaXNFbXB0eTtmdW5jdGlvbiBibG9ja1BhcmFtcyhwYXJhbXMsIGlkcykge1xuICBwYXJhbXMucGF0aCA9IGlkcztcbiAgcmV0dXJuIHBhcmFtcztcbn1cblxuZXhwb3J0cy5ibG9ja1BhcmFtcyA9IGJsb2NrUGFyYW1zO2Z1bmN0aW9uIGFwcGVuZENvbnRleHRQYXRoKGNvbnRleHRQYXRoLCBpZCkge1xuICByZXR1cm4gKGNvbnRleHRQYXRoID8gY29udGV4dFBhdGggKyAnLicgOiAnJykgKyBpZDtcbn1cblxuZXhwb3J0cy5hcHBlbmRDb250ZXh0UGF0aCA9IGFwcGVuZENvbnRleHRQYXRoOyIsIi8vIENyZWF0ZSBhIHNpbXBsZSBwYXRoIGFsaWFzIHRvIGFsbG93IGJyb3dzZXJpZnkgdG8gcmVzb2x2ZVxuLy8gdGhlIHJ1bnRpbWUgb24gYSBzdXBwb3J0ZWQgcGF0aC5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9kaXN0L2Nqcy9oYW5kbGViYXJzLnJ1bnRpbWUnKS5kZWZhdWx0O1xuIiwidmFyIHRlbXBsYXRlciA9IHJlcXVpcmUoXCJoYW5kbGViYXJzL3J1bnRpbWVcIilbXCJkZWZhdWx0XCJdLnRlbXBsYXRlO21vZHVsZS5leHBvcnRzID0gdGVtcGxhdGVyKHtcImNvbXBpbGVyXCI6WzYsXCI+PSAyLjAuMC1iZXRhLjFcIl0sXCJtYWluXCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICAgIHZhciBoZWxwZXIsIGFsaWFzMT1oZWxwZXJzLmhlbHBlck1pc3NpbmcsIGFsaWFzMj1cImZ1bmN0aW9uXCIsIGFsaWFzMz10aGlzLmVzY2FwZUV4cHJlc3Npb247XG5cbiAgcmV0dXJuIFwiPGRpdlxcbiAgY2xhc3M9XFxcImFydCBpbmxpbmUtYmxvY2sgcmVsYXRpdmUgY3Vyc29yIG0yIGZmLW92ZXJsb2NrXFxcIlxcbiAgc3R5bGU9XFxcImZvbnQtZmFtaWx5OiBcIlxuICAgICsgYWxpYXMzKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMuZm9udEZhbWlseSB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuZm9udEZhbWlseSA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBhbGlhczEpLCh0eXBlb2YgaGVscGVyID09PSBhbGlhczIgPyBoZWxwZXIuY2FsbChkZXB0aDAse1wibmFtZVwiOlwiZm9udEZhbWlseVwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpKVxuICAgICsgXCJcXFwiPlxcbiAgPGRpdiBjbGFzcz1cXFwiIGFic29sdXRlIHRvcC0wIGxlZnQtMCBmbGV4IGZsZXgtY2VudGVyIGZ1bGwtaGVpZ2h0IGNvbCBjb2wtMTIgcHgyIHoyXFxcIj5cXG4gICAgPHNwYW5cXG4gICAgICBjbGFzcz1cXFwic2hhZG93IGNlbnRlciBmMSB3aGl0ZSBtMCBjb2wgY29sLTEyXFxcIlxcbiAgICAgIHN0eWxlPVxcXCJjb2xvcjogXCJcbiAgICArIGFsaWFzMygoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLmZvbnRDb2xvciB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuZm9udENvbG9yIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGFsaWFzMSksKHR5cGVvZiBoZWxwZXIgPT09IGFsaWFzMiA/IGhlbHBlci5jYWxsKGRlcHRoMCx7XCJuYW1lXCI6XCJmb250Q29sb3JcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSlcbiAgICArIFwiXFxuICAgIFxcXCI+XCJcbiAgICArIGFsaWFzMygoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLnRpdGxlIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC50aXRsZSA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBhbGlhczEpLCh0eXBlb2YgaGVscGVyID09PSBhbGlhczIgPyBoZWxwZXIuY2FsbChkZXB0aDAse1wibmFtZVwiOlwidGl0bGVcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSlcbiAgICArIFwiPC9zcGFuPlxcbiAgPC9kaXY+XFxuICA8aW1nXFxuICAgIGNsYXNzPVxcXCJcXFwiXFxuICAgIHN0eWxlPVxcXCJmaWx0ZXI6IFwiXG4gICAgKyBhbGlhczMoKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy5maWx0ZXIgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLmZpbHRlciA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBhbGlhczEpLCh0eXBlb2YgaGVscGVyID09PSBhbGlhczIgPyBoZWxwZXIuY2FsbChkZXB0aDAse1wibmFtZVwiOlwiZmlsdGVyXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIlxcXCJcXG4gICAgc3JjPVxcXCJcIlxuICAgICsgYWxpYXMzKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMudXJsIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC51cmwgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogYWxpYXMxKSwodHlwZW9mIGhlbHBlciA9PT0gYWxpYXMyID8gaGVscGVyLmNhbGwoZGVwdGgwLHtcIm5hbWVcIjpcInVybFwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpKVxuICAgICsgXCJcXFwiXFxuICAgIGFsdD1cXFwiYSByYW5kb21seSBzZWxlY3RlZCBwaWN0dXJlXFxcIj5cXG48L2Rpdj5cXG5cIjtcbn0sXCJ1c2VEYXRhXCI6dHJ1ZX0pOyJdfQ==
