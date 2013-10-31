var helpers = require('fantasy-helpers'),
    combinators = require('fantasy-combinators'),
    Option = require('fantasy-options'),

    defender = require('../defender'),

    ap = combinators.apply,
    compose = combinators.compose,

    Some = Option.Some,
    None = Option.None,

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
                if (f(x[i])) accum.push(x[i]);
            }
            return accum;
        };
    },
    normaliser = function(f) {
        return function(x) {
            var list = dimap(split(''), join(''));
            return list(f)(x);
        };
    };

exports.defender = {
    'testing': function(test) {

        var defend = defender('##-##-##'),
            norm = ap(normaliser(filter(
                function(x) {
                    return !/\s/.test(x);
                }
            ))),
            value = norm('1 1 - 2 2 - 3 3');

        defend(value).fold(
            function(errors) {
                console.log('Failure', errors);
            },
            function(result) {
                console.log('Success', result);
            }
        );

        test.ok(true);
        test.done();
    }
};
    