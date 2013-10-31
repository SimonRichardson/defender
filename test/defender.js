var helpers = require('fantasy-helpers'),
    combinators = require('fantasy-combinators'),
    Option = require('fantasy-options'),

    defender = require('../defender'),

    ap = combinators.apply,
    compose = combinators.compose,

    Some = Option.Some,
    None = Option.None,

    whitespace = /^\s/,

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
    norm = function(x) {
        var noneWhitespace = compose(not)(test(whitespace));
        return ap(
            every(filter(noneWhitespace))
        )(x);
    };

exports.defender = {
    'testing': function(test) {

        var defend = defender('##-##-##'),
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
    