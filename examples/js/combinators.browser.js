// Generated by CommonJS Everywhere 0.9.4
(function (global) {
  function require(file, parentModule) {
    if ({}.hasOwnProperty.call(require.cache, file))
      return require.cache[file];
    var resolved = require.resolve(file);
    if (!resolved)
      throw new Error('Failed to resolve module ' + file);
    var module$ = {
        id: file,
        require: require,
        filename: file,
        exports: {},
        loaded: false,
        parent: parentModule,
        children: []
      };
    if (parentModule)
      parentModule.children.push(module$);
    var dirname = file.slice(0, file.lastIndexOf('/') + 1);
    require.cache[file] = module$.exports;
    resolved.call(module$.exports, module$, module$.exports, dirname, file);
    module$.loaded = true;
    return require.cache[file] = module$.exports;
  }
  require.modules = {};
  require.cache = {};
  require.resolve = function (file) {
    return {}.hasOwnProperty.call(require.modules, file) ? require.modules[file] : void 0;
  };
  require.define = function (file, fn) {
    require.modules[file] = fn;
  };
  require.define('/combinators.js', function (module, exports, __dirname, __filename) {
    var combinators = require('/../../node_modules/fantasy-combinators/combinators.js', module);
    exports = module.exports = combinators;
  });
  require.define('/../../node_modules/fantasy-combinators/combinators.js', function (module, exports, __dirname, __filename) {
    function apply(f) {
      return function (x) {
        return f(x);
      };
    }
    function compose(f) {
      return function (g) {
        return function (x) {
          return f(g(x));
        };
      };
    }
    function constant(a) {
      return function (b) {
        return a;
      };
    }
    function fix(f) {
      function g(h) {
        return function (x) {
          return f(h(h))(x);
        };
      }
      ;
      return g(g);
    }
    function flip(f) {
      return function (a) {
        return function (b) {
          return f(b)(a);
        };
      };
    }
    function identity(a) {
      return a;
    }
    function substitution(f) {
      return function (g) {
        return function (x) {
          f(x)(g(x));
        };
      };
    }
    function thrush(x) {
      return function (f) {
        return f(x);
      };
    }
    if (typeof module != 'undefined')
      module.exports = {
        apply: apply,
        compose: compose,
        constant: constant,
        fix: fix,
        flip: flip,
        identity: identity,
        substitution: substitution,
        thrush: thrush
      };
  });
  global.combinators = require('/combinators.js');
}.call(this, this));
