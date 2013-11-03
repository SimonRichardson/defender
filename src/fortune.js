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
            return [b[0].split(a), b[1]];
        };
    },

    join = function(a) {
        return function(b) {
            return [b[0].join(a), b[1]];
        };
    },

    replace = function(x) {
        return function(b) {
            var values = b[0],
                selection = b[1],
                start = selection[0],
                end = selection[1] - start;
            values.splice(start, end, x);
            return b;
        };
    },

    inject = function(x) {
        return function(a) {
            return function(b) {
                var list = dimap(split(''), join(''));
                return list(replace(x))(a);
            };
        };
    },

    together = function(a) {
        return function(b) {
            return [b, a];
        };
    },

    extract = function(a) {
        return function(b) {
            return b[0];
        };
    },

    fortune = function(io) {
        return function(chr, selection) {
            var M = State.StateT(IO),

                fortune =
                    M.lift(io)
                    .chain(compose(M.modify)(constant))
                    .chain(constant(M.lift(selection)))
                    .chain(compose(M.modify)(together))
                    .chain(constant(M.get))
                    .chain(compose(M.modify)(inject(chr)))
                    .chain(constant(M.get))
                    .chain(compose(M.modify)(extract))
                    .chain(constant(M.get));

            return fortune.exec('');
        };
    };

exports = module.exports = fortune;
