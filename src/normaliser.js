var combinators = require('fantasy-combinators'),

    ap = combinators.apply,
    compose = combinators.compose,
    
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
        var predicate = compose(not)(test(regexp));
        return ap(
            every(filter(predicate))
        );
    };

exports = module.exports = normalise;
