var combinators = require('fantasy-combinators'),
    IO = require('fantasy-io'),
    Maybe = require('fantasy-options'),
    State = require('fantasy-states'),
    Tuple2 = require('fantasy-tuples').Tuple2,

    ap = combinators.apply,
    compose = combinators.compose,
    constant = combinators.constant,

    isSome = function(a) {
        return a.cata({
            Some: constant(true),
            None: constant(false)
        });
    },

    create = function(pattern) {
        return IO(function() {
            return pattern;
        });
    },

    filter = function(f) {
        return function(x) {
            return function() {
                var accum = [],
                    i;

                for(i = 0; i < x.length; i++) {
                    if (f(x[i]))
                        accum.push(x[i]);
                }

                return accum;
            };
        };
    },

    map = function(a) {
        return function(b) {
            return function() {
                return b.map(function(x) {
                    return x in a ? Maybe.Some(a[x]) : Maybe.None;
                });
            };
        };
    },

    split = function(a) {
        return function(b) {
            return function() {
                return b.split(a);
            };
        };
    },

    zipWithIndex = function() {
        return function(b) {
            var index = 0;
            return b.map(function(x) {
                return Tuple2(x, index++);
            });
        };
    },

    soothsayer = function(sayings) {
        return function(pattern) {
            var M = State.StateT(IO),

                program =
                    M.lift(create(pattern))
                    .chain(compose(M.modify)(split('')))
                    .chain(constant(M.get))
                    .chain(compose(M.modify)(map(sayings)))
                    .chain(constant(M.get))
                    .chain(compose(M.modify)(filter(isSome)))
                    .chain(constant(M.get))
                    .chain(compose(M.modify)(zipWithIndex))
                    .chain(constant(M.get));

            return program.exec('');
        };
    };

exports = module.exports = soothsayer;
