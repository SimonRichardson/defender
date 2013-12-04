var combinators = require('fantasy-combinators'),
    IO = require('fantasy-io'),
    State = require('fantasy-states'),
    steward = require('./steward'),

    ap = combinators.apply,
    compose = combinators.compose,
    constant = combinators.constant,
    identity = combinators.identity,

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

    remove = function(values) {
        var a = values.slice();
        return function(x, y) {
            a.splice(x, y);
            return a;
        };
    },

    update = function(values) {
        var a = values.slice();
        return function(x, y) {
            return function(z) {
                a.splice(x, y, z);
                return a;
            };
        };
    },

    replace = function(e) {
        return function(b) {
            var selection = b[1],
                start = selection[0],
                result = e.fold(
                    function(x) {
                        var a = remove(b[0]);
                        return x.fold(
                            constant(a(start - 1, 1)),
                            constant(a(start, 1))
                        );
                    },
                    function(x) {
                        var a = update(b[0]);
                        return x.fold(
                            constant(b[0]),
                            a(start, selection[1] - start)
                        );
                    }
                );
            return [result, selection];
        };
    },

    inject = function(x) {
        return function(a) {
            return function(b) {
                var list = steward(split(''), join(''));
                return list(replace(a))(b);
            };
        };
    },

    together = function(a) {
        return function(b) {
            return [b, a];
        };
    },

    extract = function() {
        return function(b) {
            return b[0];
        };
    },

    fortune = function(io) {
        return function(key, selection) {
            var M = State.StateT(IO),
 
                values =
                    M.lift(key)
                    .chain(compose(M.modify)(constant))
                    .chain(constant(M.get))
                    .chain(compose(M.modify)(inject))
                    .chain(constant(M.get)),
 
                possible = values.exec(''),
 
                fortune =
                    M.lift(io)
                    .chain(compose(M.modify)(constant))
                    .chain(constant(M.lift(selection)))
                    .chain(compose(M.modify)(together))
                    .chain(constant(M.get))
                    .chain(constant(M.lift(possible)))
                    .chain(compose(M.modify)(ap))
                    .chain(constant(M.get))
                    .chain(compose(M.modify)(extract))
                    .chain(constant(M.get));
 
            return fortune.exec('');
        };
    };

exports = module.exports = fortune;
