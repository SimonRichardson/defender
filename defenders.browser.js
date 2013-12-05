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
  require.define('/defenders.js', function (module, exports, __dirname, __filename) {
    var defender = require('/src/defender.js', module), fortune = require('/src/fortune.js', module), guardian = require('/src/guardian.js', module), soothsayer = require('/src/soothsayer.js', module), runes = require('/src/runes.js', module);
    exports = module.exports = {
      defender: defender,
      fortune: fortune,
      guardian: guardian,
      soothsayer: soothsayer,
      runes: runes
    };
  });
  require.define('/src/runes.js', function (module, exports, __dirname, __filename) {
    var IO = require('/node_modules/fantasy-io/io.js', module);
    function anything(a) {
      return IO(function () {
        return new RegExp('^' + a + '+');
      });
    }
    function anythingBut(a) {
      return IO(function () {
        return new RegExp('^[^' + a + ']+');
      });
    }
    function then(a) {
      return IO(function () {
        return new RegExp('^' + a);
      });
    }
    function range(from, to) {
      return IO(function () {
        return new RegExp('^[' + from + '-' + to + ']');
      });
    }
    exports = module.exports = {
      anything: anything,
      anythingBut: anythingBut,
      then: then,
      range: range
    };
  });
  require.define('/node_modules/fantasy-io/io.js', function (module, exports, __dirname, __filename) {
    var daggy = require('/node_modules/fantasy-io/node_modules/daggy/daggy.js', module), IO = daggy.tagged('unsafePerform');
    IO.of = function (x) {
      return IO(function () {
        return x;
      });
    };
    IO.prototype.chain = function (g) {
      var io = this;
      return IO(function () {
        return g(io.unsafePerform()).unsafePerform();
      });
    };
    IO.prototype.map = function (f) {
      return this.chain(function (a) {
        return IO.of(f(a));
      });
    };
    IO.prototype.ap = function (a) {
      return this.chain(function (f) {
        return a.map(f);
      });
    };
    if (typeof module != 'undefined')
      module.exports = IO;
  });
  require.define('/node_modules/fantasy-io/node_modules/daggy/daggy.js', function (module, exports, __dirname, __filename) {
    (function (global, factory) {
      'use strict';
      if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
      } else if (typeof exports !== 'undefined') {
        factory(exports);
      } else {
        global.daggy = {};
        factory(global.daggy);
      }
    }(this, function (exports) {
      function create(proto) {
        function Ctor() {
        }
        Ctor.prototype = proto;
        return new Ctor;
      }
      exports.create = create;
      function getInstance(self, constructor) {
        return self instanceof constructor ? self : create(constructor.prototype);
      }
      exports.getInstance = getInstance;
      function tagged() {
        var fields = [].slice.apply(arguments);
        function wrapped() {
          var self = getInstance(this, wrapped), i;
          if (arguments.length != fields.length)
            throw new TypeError('Expected ' + fields.length + ' arguments, got ' + arguments.length);
          for (i = 0; i < fields.length; i++)
            self[fields[i]] = arguments[i];
          return self;
        }
        wrapped._length = fields.length;
        return wrapped;
      }
      exports.tagged = tagged;
      function taggedSum(constructors) {
        var key;
        function definitions() {
          throw new TypeError('Tagged sum was called instead of one of its properties.');
        }
        function makeCata(key) {
          return function (dispatches) {
            var fields = constructors[key], args = [], i;
            if (!dispatches[key])
              throw new TypeError("Constructors given to cata didn't include: " + key);
            for (i = 0; i < fields.length; i++)
              args.push(this[fields[i]]);
            return dispatches[key].apply(this, args);
          };
        }
        function makeProto(key) {
          var proto = create(definitions.prototype);
          proto.cata = makeCata(key);
          return proto;
        }
        for (key in constructors) {
          if (!constructors[key].length) {
            definitions[key] = makeProto(key);
            continue;
          }
          definitions[key] = tagged.apply(null, constructors[key]);
          definitions[key].prototype = makeProto(key);
        }
        return definitions;
      }
      exports.taggedSum = taggedSum;
    }));
  });
  require.define('/src/soothsayer.js', function (module, exports, __dirname, __filename) {
    var combinators = require('/node_modules/fantasy-combinators/combinators.js', module), IO = require('/node_modules/fantasy-io/io.js', module), Maybe = require('/node_modules/fantasy-options/option.js', module), State = require('/node_modules/fantasy-states/state.js', module), compose = combinators.compose, constant = combinators.constant, identity = combinators.identity, isSome = function (a) {
        return a.cata({
          Some: constant(true),
          None: constant(false)
        });
      }, error = function (str) {
        return function () {
          throw new Error(str);
        };
      }, extract = function () {
        return function (a) {
          return a.map(function (x) {
            return x.cata({
              Some: identity,
              None: error('Invalid Option')
            });
          });
        };
      }, filter = function (f) {
        return function (x) {
          return function () {
            var accum = [], i;
            for (i = 0; i < x.length; i++) {
              if (f(x[i]))
                accum.push(x[i]);
            }
            return accum;
          };
        };
      }, map = function (a) {
        return function (b) {
          return function () {
            return b.map(function (x) {
              return x in a ? Maybe.Some(a[x]) : Maybe.None;
            });
          };
        };
      }, split = function (a) {
        return function (b) {
          return function () {
            return b.split(a);
          };
        };
      }, soothsayer = function (sayings) {
        return function (pattern) {
          var M = State.StateT(IO), program = M.lift(pattern).chain(compose(M.modify)(split(''))).chain(constant(M.get)).chain(compose(M.modify)(map(sayings))).chain(constant(M.get)).chain(compose(M.modify)(filter(isSome))).chain(constant(M.get)).chain(compose(M.modify)(extract)).chain(constant(M.get));
          return program.exec('');
        };
      };
    exports = module.exports = soothsayer;
  });
  require.define('/node_modules/fantasy-states/state.js', function (module, exports, __dirname, __filename) {
    var Tuple2 = require('/node_modules/fantasy-tuples/tuples.js', module).Tuple2, daggy = require('/node_modules/fantasy-states/node_modules/daggy/daggy.js', module), State = daggy.tagged('run');
    State.of = function (a) {
      return State(function (b) {
        return Tuple2(a, b);
      });
    };
    State.prototype.chain = function (f) {
      var state = this;
      return State(function (s) {
        var result = state.run(s);
        return f(result._1).run(result._2);
      });
    };
    State.get = State(function (s) {
      return Tuple2(s, s);
    });
    State.modify = function (f) {
      return State(function (s) {
        return Tuple2(null, f(s));
      });
    };
    State.put = function (s) {
      return State.modify(function (a) {
        return s;
      });
    };
    State.prototype.evalState = function (s) {
      return this.run(s)._1;
    };
    State.prototype.exec = function (s) {
      return this.run(s)._2;
    };
    State.prototype.map = function (f) {
      return this.chain(function (a) {
        return State.of(f(a));
      });
    };
    State.prototype.ap = function (a) {
      return this.chain(function (f) {
        return a.map(f);
      });
    };
    State.StateT = function (M) {
      var StateT = daggy.tagged('run');
      StateT.lift = function (m) {
        return StateT(function (b) {
          return m.map(function (c) {
            return Tuple2(c, b);
          });
        });
      };
      StateT.of = function (a) {
        return StateT(function (b) {
          return M.of(Tuple2(a, b));
        });
      };
      StateT.prototype.chain = function (f) {
        var state = this;
        return StateT(function (s) {
          var result = state.run(s);
          return result.chain(function (t) {
            return f(t._1).run(t._2);
          });
        });
      };
      StateT.get = StateT(function (s) {
        return M.of(Tuple2(s, s));
      });
      StateT.modify = function (f) {
        return StateT(function (s) {
          return M.of(Tuple2(null, f(s)));
        });
      };
      StateT.put = function (s) {
        return StateT.modify(function (a) {
          return s;
        });
      };
      StateT.prototype.evalState = function (s) {
        return this.run(s).map(function (t) {
          return t._1;
        });
      };
      StateT.prototype.exec = function (s) {
        return this.run(s).map(function (t) {
          return t._2;
        });
      };
      StateT.prototype.map = function (f) {
        return this.chain(function (a) {
          return StateT.of(f(a));
        });
      };
      StateT.prototype.ap = function (a) {
        return this.chain(function (f) {
          return a.map(f);
        });
      };
      return StateT;
    };
    if (typeof module != 'undefined')
      module.exports = State;
  });
  require.define('/node_modules/fantasy-states/node_modules/daggy/daggy.js', function (module, exports, __dirname, __filename) {
    (function (global, factory) {
      'use strict';
      if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
      } else if (typeof exports !== 'undefined') {
        factory(exports);
      } else {
        global.daggy = {};
        factory(global.daggy);
      }
    }(this, function (exports) {
      function create(proto) {
        function Ctor() {
        }
        Ctor.prototype = proto;
        return new Ctor;
      }
      exports.create = create;
      function getInstance(self, constructor) {
        return self instanceof constructor ? self : create(constructor.prototype);
      }
      exports.getInstance = getInstance;
      function tagged() {
        var fields = [].slice.apply(arguments);
        function wrapped() {
          var self = getInstance(this, wrapped), i;
          if (arguments.length != fields.length)
            throw new TypeError('Expected ' + fields.length + ' arguments, got ' + arguments.length);
          for (i = 0; i < fields.length; i++)
            self[fields[i]] = arguments[i];
          return self;
        }
        wrapped._length = fields.length;
        return wrapped;
      }
      exports.tagged = tagged;
      function taggedSum(constructors) {
        var key;
        function definitions() {
          throw new TypeError('Tagged sum was called instead of one of its properties.');
        }
        function makeCata(key) {
          return function (dispatches) {
            var fields = constructors[key], args = [], i;
            if (!dispatches[key])
              throw new TypeError("Constructors given to cata didn't include: " + key);
            for (i = 0; i < fields.length; i++)
              args.push(this[fields[i]]);
            return dispatches[key].apply(this, args);
          };
        }
        function makeProto(key) {
          var proto = create(definitions.prototype);
          proto.cata = makeCata(key);
          return proto;
        }
        for (key in constructors) {
          if (!constructors[key].length) {
            definitions[key] = makeProto(key);
            continue;
          }
          definitions[key] = tagged.apply(null, constructors[key]);
          definitions[key].prototype = makeProto(key);
        }
        return definitions;
      }
      exports.taggedSum = taggedSum;
    }));
  });
  require.define('/node_modules/fantasy-tuples/tuples.js', function (module, exports, __dirname, __filename) {
    var daggy = require('/node_modules/fantasy-tuples/node_modules/daggy/daggy.js', module), Tuple2 = daggy.tagged('_1', '_2'), Tuple3 = daggy.tagged('_1', '_2', '_3'), Tuple4 = daggy.tagged('_1', '_2', '_3', '_4'), Tuple5 = daggy.tagged('_1', '_2', '_3', '_4', '_5');
    Tuple2.prototype.concat = function (b) {
      return Tuple2(this._1.concat(b._1), this._2.concat(b._2));
    };
    Tuple3.prototype.concat = function (b) {
      return Tuple3(this._1.concat(b._1), this._2.concat(b._2), this._3.concat(b._3));
    };
    Tuple4.prototype.concat = function (b) {
      return Tuple4(this._1.concat(b._1), this._2.concat(b._2), this._3.concat(b._3), this._4.concat(b._4));
    };
    Tuple5.prototype.concat = function (b) {
      return Tuple5(this._1.concat(b._1), this._2.concat(b._2), this._3.concat(b._3), this._4.concat(b._4), this._5.concat(b._5));
    };
    if (typeof exports != 'undefined') {
      exports.Tuple2 = Tuple2;
      exports.Tuple3 = Tuple3;
      exports.Tuple4 = Tuple4;
      exports.Tuple5 = Tuple5;
    }
  });
  require.define('/node_modules/fantasy-tuples/node_modules/daggy/daggy.js', function (module, exports, __dirname, __filename) {
    (function (global, factory) {
      'use strict';
      if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
      } else if (typeof exports !== 'undefined') {
        factory(exports);
      } else {
        global.daggy = {};
        factory(global.daggy);
      }
    }(this, function (exports) {
      function create(proto) {
        function Ctor() {
        }
        Ctor.prototype = proto;
        return new Ctor;
      }
      exports.create = create;
      function getInstance(self, constructor) {
        return self instanceof constructor ? self : create(constructor.prototype);
      }
      exports.getInstance = getInstance;
      function tagged() {
        var fields = [].slice.apply(arguments);
        function wrapped() {
          var self = getInstance(this, wrapped), i;
          if (arguments.length != fields.length)
            throw new TypeError('Expected ' + fields.length + ' arguments, got ' + arguments.length);
          for (i = 0; i < fields.length; i++)
            self[fields[i]] = arguments[i];
          return self;
        }
        wrapped._length = fields.length;
        return wrapped;
      }
      exports.tagged = tagged;
      function taggedSum(constructors) {
        var key;
        function definitions() {
          throw new TypeError('Tagged sum was called instead of one of its properties.');
        }
        function makeCata(key) {
          return function (dispatches) {
            var fields = constructors[key], args = [], i;
            if (!dispatches[key])
              throw new TypeError("Constructors given to cata didn't include: " + key);
            for (i = 0; i < fields.length; i++)
              args.push(this[fields[i]]);
            return dispatches[key].apply(this, args);
          };
        }
        function makeProto(key) {
          var proto = create(definitions.prototype);
          proto.cata = makeCata(key);
          return proto;
        }
        for (key in constructors) {
          if (!constructors[key].length) {
            definitions[key] = makeProto(key);
            continue;
          }
          definitions[key] = tagged.apply(null, constructors[key]);
          definitions[key].prototype = makeProto(key);
        }
        return definitions;
      }
      exports.taggedSum = taggedSum;
    }));
  });
  require.define('/node_modules/fantasy-options/option.js', function (module, exports, __dirname, __filename) {
    var daggy = require('/node_modules/fantasy-options/node_modules/daggy/daggy.js', module), Option = daggy.taggedSum({
        Some: ['x'],
        None: []
      });
    Option.prototype.fold = function (f, g) {
      return this.cata({
        Some: f,
        None: g
      });
    };
    Option.of = Option.Some;
    Option.prototype.orElse = function (x) {
      return this.fold(function (x) {
        return Option.Some(x);
      }, function () {
        return x;
      });
    };
    Option.prototype.getOrElse = function (x) {
      return this.fold(function (a) {
        return a;
      }, function () {
        return x;
      });
    };
    Option.prototype.chain = function (f) {
      return this.fold(function (a) {
        return f(a);
      }, function () {
        return Option.None;
      });
    };
    Option.prototype.concat = function (x) {
      return this.fold(function (a) {
        return x.chain(function (b) {
          return Option.Some(a.concat(b));
        });
      }, function () {
        return b;
      });
    };
    Option.prototype.map = function (f) {
      return this.chain(function (a) {
        return Option.of(f(a));
      });
    };
    Option.prototype.ap = function (a) {
      return this.chain(function (f) {
        return a.map(f);
      });
    };
    if (typeof module != 'undefined')
      module.exports = Option;
  });
  require.define('/node_modules/fantasy-options/node_modules/daggy/daggy.js', function (module, exports, __dirname, __filename) {
    (function (global, factory) {
      'use strict';
      if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
      } else if (typeof exports !== 'undefined') {
        factory(exports);
      } else {
        global.daggy = {};
        factory(global.daggy);
      }
    }(this, function (exports) {
      function create(proto) {
        function Ctor() {
        }
        Ctor.prototype = proto;
        return new Ctor;
      }
      exports.create = create;
      function getInstance(self, constructor) {
        return self instanceof constructor ? self : create(constructor.prototype);
      }
      exports.getInstance = getInstance;
      function tagged() {
        var fields = [].slice.apply(arguments);
        function wrapped() {
          var self = getInstance(this, wrapped), i;
          if (arguments.length != fields.length)
            throw new TypeError('Expected ' + fields.length + ' arguments, got ' + arguments.length);
          for (i = 0; i < fields.length; i++)
            self[fields[i]] = arguments[i];
          return self;
        }
        wrapped._length = fields.length;
        return wrapped;
      }
      exports.tagged = tagged;
      function taggedSum(constructors) {
        var key;
        function definitions() {
          throw new TypeError('Tagged sum was called instead of one of its properties.');
        }
        function makeCata(key) {
          return function (dispatches) {
            var fields = constructors[key], args = [], i;
            if (!dispatches[key])
              throw new TypeError("Constructors given to cata didn't include: " + key);
            for (i = 0; i < fields.length; i++)
              args.push(this[fields[i]]);
            return dispatches[key].apply(this, args);
          };
        }
        function makeProto(key) {
          var proto = create(definitions.prototype);
          proto.cata = makeCata(key);
          return proto;
        }
        for (key in constructors) {
          if (!constructors[key].length) {
            definitions[key] = makeProto(key);
            continue;
          }
          definitions[key] = tagged.apply(null, constructors[key]);
          definitions[key].prototype = makeProto(key);
        }
        return definitions;
      }
      exports.taggedSum = taggedSum;
    }));
  });
  require.define('/node_modules/fantasy-combinators/combinators.js', function (module, exports, __dirname, __filename) {
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
  require.define('/src/guardian.js', function (module, exports, __dirname, __filename) {
    var combinators = require('/node_modules/fantasy-combinators/combinators.js', module), IO = require('/node_modules/fantasy-io/io.js', module), State = require('/node_modules/fantasy-states/state.js', module), steward = require('/src/steward.js', module), ap = combinators.apply, compose = combinators.compose, constant = combinators.constant, split = function (a) {
        return function (b) {
          return b.split(a);
        };
      }, join = function (a) {
        return function (b) {
          return b.join(a);
        };
      }, filter = function (f) {
        return function (x) {
          var accum = [], i;
          for (i = 0; i < x.length; i++) {
            if (f(x[i]))
              accum.push(x[i]);
          }
          return accum;
        };
      }, every = function (f) {
        return function (x) {
          return steward(split(''), join(''))(f)(x);
        };
      }, not = function (a) {
        return !a;
      }, test = function (a) {
        return function (b) {
          return a.test(b);
        };
      }, normalise = function (regexp) {
        return function (f) {
          var M = State.StateT(IO), predicate = compose(not)(test(regexp)), clean = ap(every(filter(predicate))), program = M.lift(f).chain(compose(M.modify)(function (a) {
              return constant(clean(a));
            })).chain(constant(M.get));
          return program.exec('');
        };
      };
    exports = module.exports = normalise;
  });
  require.define('/src/steward.js', function (module, exports, __dirname, __filename) {
    var combinators = require('/node_modules/fantasy-combinators/combinators.js', module), compose = combinators.compose, steward = function (a, b) {
        return function (c) {
          return compose(compose(b)(c))(a);
        };
      };
    exports = module.exports = steward;
  });
  require.define('/src/fortune.js', function (module, exports, __dirname, __filename) {
    var combinators = require('/node_modules/fantasy-combinators/combinators.js', module), IO = require('/node_modules/fantasy-io/io.js', module), State = require('/node_modules/fantasy-states/state.js', module), steward = require('/src/steward.js', module), ap = combinators.apply, compose = combinators.compose, constant = combinators.constant, identity = combinators.identity, split = function (a) {
        return function (b) {
          return [
            b[0].split(a),
            b[1]
          ];
        };
      }, join = function (a) {
        return function (b) {
          return [
            b[0].join(a),
            b[1]
          ];
        };
      }, remove = function (values) {
        var a = values.slice();
        return function (x, y) {
          a.splice(x, y);
          return a;
        };
      }, update = function (values) {
        var a = values.slice();
        return function (x, y) {
          return function (z) {
            a.splice(x, y, z);
            return a;
          };
        };
      }, replace = function (e) {
        return function (b) {
          var selection = b[1], start = selection[0], result = e.fold(function (x) {
              var a = remove(b[0]);
              return x.fold(constant(a(start - 1, 1)), constant(a(start, 1)));
            }, function (x) {
              var a = update(b[0]);
              return x.fold(constant(b[0]), a(start, selection[1] - start));
            });
          return [
            result,
            selection
          ];
        };
      }, inject = function (x) {
        return function (a) {
          return function (b) {
            var list = steward(split(''), join(''));
            return list(replace(a))(b);
          };
        };
      }, together = function (a) {
        return function (b) {
          return [
            b,
            a
          ];
        };
      }, extract = function () {
        return function (b) {
          return b[0];
        };
      }, fortune = function (io) {
        return function (key, selection) {
          var M = State.StateT(IO), values = M.lift(key).chain(compose(M.modify)(constant)).chain(constant(M.get)).chain(compose(M.modify)(inject)).chain(constant(M.get)), possible = values.exec(''), fortune = M.lift(io).chain(compose(M.modify)(constant)).chain(constant(M.lift(selection))).chain(compose(M.modify)(together)).chain(constant(M.get)).chain(constant(M.lift(possible))).chain(compose(M.modify)(ap)).chain(constant(M.get)).chain(compose(M.modify)(extract)).chain(constant(M.get));
          return fortune.exec('');
        };
      };
    exports = module.exports = fortune;
  });
  require.define('/src/defender.js', function (module, exports, __dirname, __filename) {
    var Validation = require('/node_modules/fantasy-validations/validation.js', module), combinators = require('/node_modules/fantasy-combinators/combinators.js', module), IO = require('/node_modules/fantasy-io/io.js', module), Maybe = require('/node_modules/fantasy-options/option.js', module), State = require('/node_modules/fantasy-states/state.js', module), Tuples = require('/node_modules/fantasy-tuples/tuples.js', module), Either = require('/node_modules/fantasy-eithers/either.js', module), compose = combinators.compose, constant = combinators.constant, Success = Validation.Success, Failure = Validation.Failure, Left = Either.Left, Right = Either.Right, Tuple2 = Tuples.Tuple2, Tuple3 = Tuples.Tuple3, executeExpr = function (a) {
        return function (b) {
          return constant(b.exec(a));
        };
      }, consume = function (a) {
        var M = State.StateT(IO);
        return function (b) {
          var rec = function (index, string, program) {
            if (index < b.length) {
              return rec(index + 1, program.chain(constant(M.lift(b[index]))).chain(compose(M.modify)(executeExpr(string))));
            } else {
              return program;
            }
          };
          result = rec(0, a, M.of(''));
          console.log(result.exec('').unsafePerform());
          return Tuple3(a, '', '');
        };
      }, containsError = function (x) {
        var i;
        for (i = 0; i < x.length; i++) {
          if (x[i]._1 !== '')
            return true;
        }
        return false;
      }, createFailure = function (string, position) {
        return Failure([Tuple3(string, Maybe.None, position)]);
      }, output = function () {
        return function (x) {
          var string = x._2, possibleErrors = x._3;
          if (possibleErrors.length < 1 && string.length > 0) {
            return Left(createFailure(string, x._1.length - string.length + 1));
          } else if (possibleErrors.length > 0) {
            if (string.length < 1 && !containsError(possibleErrors)) {
              return Right(createFailure(string, string.length));
            } else
              return Left(Failure(possibleErrors));
          } else
            return Right(Success(x._1));
        };
      }, defender = function (sayings) {
        return function (stream) {
          var M = State.StateT(IO), program = M.lift(sayings).chain(compose(M.modify)(constant)).chain(constant(M.lift(stream))).chain(compose(M.modify)(consume)).chain(constant(M.get)).chain(compose(M.modify)(output)).chain(constant(M.get));
          return program.exec([]);
        };
      };
    exports = module.exports = defender;
  });
  require.define('/node_modules/fantasy-eithers/either.js', function (module, exports, __dirname, __filename) {
    var daggy = require('/node_modules/fantasy-eithers/node_modules/daggy/daggy.js', module), Either = daggy.taggedSum({
        Left: ['l'],
        Right: ['r']
      });
    Either.prototype.fold = function (f, g) {
      return this.cata({
        Left: f,
        Right: g
      });
    };
    Either.of = Either.Right;
    Either.prototype.swap = function () {
      return this.fold(function (l) {
        return Either.Right(l);
      }, function (r) {
        return Either.Left(r);
      });
    };
    Either.prototype.bimap = function (f, g) {
      return this.fold(function (l) {
        return Either.Left(f(l));
      }, function (r) {
        return Either.Right(g(r));
      });
    };
    Either.prototype.chain = function (f) {
      return this.fold(function (l) {
        return Either.Left(l);
      }, function (r) {
        return f(r);
      });
    };
    Either.prototype.concat = function (b) {
      return this.fold(function (l) {
        return Either.Left(l);
      }, function (r) {
        return b.chain(function (t) {
          return Either.Right(r.concat(t));
        });
      });
    };
    Either.prototype.map = function (f) {
      return this.chain(function (a) {
        return Either.of(f(a));
      });
    };
    Either.prototype.ap = function (a) {
      return this.chain(function (f) {
        return a.map(f);
      });
    };
    if (typeof module != 'undefined')
      module.exports = Either;
  });
  require.define('/node_modules/fantasy-eithers/node_modules/daggy/daggy.js', function (module, exports, __dirname, __filename) {
    (function (global, factory) {
      'use strict';
      if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
      } else if (typeof exports !== 'undefined') {
        factory(exports);
      } else {
        global.daggy = {};
        factory(global.daggy);
      }
    }(this, function (exports) {
      function create(proto) {
        function Ctor() {
        }
        Ctor.prototype = proto;
        return new Ctor;
      }
      exports.create = create;
      function getInstance(self, constructor) {
        return self instanceof constructor ? self : create(constructor.prototype);
      }
      exports.getInstance = getInstance;
      function tagged() {
        var fields = [].slice.apply(arguments);
        function wrapped() {
          var self = getInstance(this, wrapped), i;
          if (arguments.length != fields.length)
            throw new TypeError('Expected ' + fields.length + ' arguments, got ' + arguments.length);
          for (i = 0; i < fields.length; i++)
            self[fields[i]] = arguments[i];
          return self;
        }
        wrapped._length = fields.length;
        return wrapped;
      }
      exports.tagged = tagged;
      function taggedSum(constructors) {
        var key;
        function definitions() {
          throw new TypeError('Tagged sum was called instead of one of its properties.');
        }
        function makeCata(key) {
          return function (dispatches) {
            var fields = constructors[key], args = [], i;
            if (!dispatches[key])
              throw new TypeError("Constructors given to cata didn't include: " + key);
            for (i = 0; i < fields.length; i++)
              args.push(this[fields[i]]);
            return dispatches[key].apply(this, args);
          };
        }
        function makeProto(key) {
          var proto = create(definitions.prototype);
          proto.cata = makeCata(key);
          return proto;
        }
        for (key in constructors) {
          if (!constructors[key].length) {
            definitions[key] = makeProto(key);
            continue;
          }
          definitions[key] = tagged.apply(null, constructors[key]);
          definitions[key].prototype = makeProto(key);
        }
        return definitions;
      }
      exports.taggedSum = taggedSum;
    }));
  });
  require.define('/node_modules/fantasy-validations/validation.js', function (module, exports, __dirname, __filename) {
    var daggy = require('/node_modules/fantasy-validations/node_modules/daggy/daggy.js', module), Validation = daggy.taggedSum({
        Success: ['s'],
        Failure: ['f']
      });
    function identity(a) {
      return a;
    }
    Validation.prototype.fold = function (f, g) {
      return this.cata({
        Failure: f,
        Success: g
      });
    };
    Validation.of = Validation.Success;
    Validation.prototype.bimap = function (f, g) {
      return this.fold(function (a) {
        return Validation.Failure(f(a));
      }, function (b) {
        return Validation.Success(g(b));
      });
    };
    Validation.prototype.map = function (f) {
      return this.bimap(identity, f);
    };
    Validation.prototype.ap = function (b) {
      return this.fold(function (f1) {
        return b.fold(function (f2) {
          return Validation.Failure(f1.concat(f2));
        }, function (s) {
          return Validation.Failure(f1);
        });
      }, function (s) {
        return b.map(s);
      });
    };
    Validation.prototype.concat = function (b) {
      return this.fold(function (f) {
        return b.bimap(function (g) {
          return f.concat(g);
        }, identity);
      }, function (s) {
        return b.map(function (d) {
          return s.concat(d);
        });
      });
    };
    if (typeof module != 'undefined')
      module.exports = Validation;
  });
  require.define('/node_modules/fantasy-validations/node_modules/daggy/daggy.js', function (module, exports, __dirname, __filename) {
    (function (global, factory) {
      'use strict';
      if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
      } else if (typeof exports !== 'undefined') {
        factory(exports);
      } else {
        global.daggy = {};
        factory(global.daggy);
      }
    }(this, function (exports) {
      function create(proto) {
        function Ctor() {
        }
        Ctor.prototype = proto;
        return new Ctor;
      }
      exports.create = create;
      function getInstance(self, constructor) {
        return self instanceof constructor ? self : create(constructor.prototype);
      }
      exports.getInstance = getInstance;
      function tagged() {
        var fields = [].slice.apply(arguments);
        function wrapped() {
          var self = getInstance(this, wrapped), i;
          if (arguments.length != fields.length)
            throw new TypeError('Expected ' + fields.length + ' arguments, got ' + arguments.length);
          for (i = 0; i < fields.length; i++)
            self[fields[i]] = arguments[i];
          return self;
        }
        wrapped._length = fields.length;
        return wrapped;
      }
      exports.tagged = tagged;
      function taggedSum(constructors) {
        var key;
        function definitions() {
          throw new TypeError('Tagged sum was called instead of one of its properties.');
        }
        function makeCata(key) {
          return function (dispatches) {
            var fields = constructors[key], args = [], i;
            if (!dispatches[key])
              throw new TypeError("Constructors given to cata didn't include: " + key);
            for (i = 0; i < fields.length; i++)
              args.push(this[fields[i]]);
            return dispatches[key].apply(this, args);
          };
        }
        function makeProto(key) {
          var proto = create(definitions.prototype);
          proto.cata = makeCata(key);
          return proto;
        }
        for (key in constructors) {
          if (!constructors[key].length) {
            definitions[key] = makeProto(key);
            continue;
          }
          definitions[key] = tagged.apply(null, constructors[key]);
          definitions[key].prototype = makeProto(key);
        }
        return definitions;
      }
      exports.taggedSum = taggedSum;
    }));
  });
  global.defenders = require('/defenders.js');
}.call(this, this));
//# sourceMappingURL=defenders.js.map
