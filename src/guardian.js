var combinators = require('fantasy-combinators'),
    IO = require('fantasy-io'),
    State = require('fantasy-states'),

    ap = combinators.apply,
    compose = combinators.compose,
    constant = combinators.constant,
    
    dimap = function(a, b) {
        return function(c) {
            return compose(compose(b)(c))(a);
        };
    },

    split = function(a) {
        return function(b) {
            return b.split(a);
        };
    },
    join = function(a) {
        return function(b) {
            return b.join(a);
        };
    },

    filter = function(f) {
        return function(x) {
            var accum = [],
                i;
            for(i = 0;  i < x.length; i++) {
                if (f(x[i]))
                    accum.push(x[i]);
            }
            return accum;
        };
    },
    every = function(f) {
        return function(x) {
            return dimap(split(''), join(''))(f)(x);
        };
    },
    not = function(a) {
        return !a;
    },
    test = function(a) {
        return function(b) {
            return a.test(b);
        };
    },

    normalise = function(regexp) {
        return function(f) {
            var M = State.StateT(IO),

                predicate = compose(not)(test(regexp)),
                clean = ap(every(filter(predicate))),

                program =
                    M.lift(f)
                    .chain(compose(M.modify)(
                        function(a) {
                            return constant(clean(a));
                        }
                    ))
                    .chain(constant(M.get));

            return program.exec('');
        };
    };

exports = module.exports = normalise;
