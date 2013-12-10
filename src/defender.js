var combinators = require('fantasy-combinators'),
    daggy = require('daggy'),
    
    IO = require('fantasy-io'),
    State = require('fantasy-states'),
    Tuples = require('fantasy-tuples'),

    compose = combinators.compose,
    constant = combinators.constant,

    Tuple2 = Tuples.Tuple2,
    Tuple4 = Tuples.Tuple4,

    Triad = daggy.taggedSum({
        Success: ['x'],
        Maybe: ['flow'],
        Failure: ['errors']
    }),
    Flow = daggy.taggedSum({
        Underflow: ['underflow', 'position'],
        Overflow: ['overflow', 'position']
    }),

    executeExpr = function(a) {
        return function(b) {
            return constant(b.exec(a));
        };
    },

    push = function(a, b) {
        var x = a.slice();
        x.push(b);
        return x;
    },

    validateString = function(program, index, accum, original, modified) {
        return function(possible) {
            if(possible) {
                return constant(
                    Tuple4(
                        program,
                        original,
                        modified.slice(possible[0].length),
                        accum
                    )
                );
            } else {
                return constant(
                    Tuple4(
                        program,
                        original,
                        modified,
                        push(accum, Tuple2(modified, index))
                    )
                );
            }
        };
    },

    consume = function(a) {
        var M = State.StateT(IO),

            rec = function(index, guards) {
                return function(tuple) {
                    var program = tuple._1,
                        original = tuple._2,
                        modified = tuple._3,
                        maybes = tuple._4,
                        guard;

                    if (index < guards.length) {
                        guard = guards[index];

                        return program
                            .chain(constant(M.lift(guard)))
                            .chain(compose(M.modify)(executeExpr(modified)))
                            .chain(constant(M.get))
                            .chain(compose(M.modify)(validateString(program, index, maybes, original, modified)))
                            .chain(constant(M.get))
                            .chain(rec(index + 1, guards));
                    } else {
                        return program;
                    }
                };
            };
        return function(b) {
            return rec(0, b)(Tuple4(M.of(''), a, a, []));
        };
    },

    contains = function(x, f) {
        var i;
        for (i = 0; i < x.length; i++) {
            if (f(x[i]))
                return true;
        }
        return false;
    },

    filter = function(x, f) {
        var accum = [],
            i;
        for (i = 0; i < x.length; i++) {
            if (f(x[i]))
                accum.push(x[i]);
        }
        return accum;
    },

    empty = function(x) {
        return x._1 !== '';
    },

    output = function(a) {
        return function() {
            var original = a._2,
                modified = a._3,
                possibleErrors = a._4,
                actualErrors = filter(possibleErrors, empty);

            if (possibleErrors.length < 1 && modified.length > 0) {
                // Check for overflows
                return Triad.Maybe(Flow.Overflow(modified, original.length - modified.length));

            } else if(possibleErrors.length > 0) {
                
                if (modified.length < 1 && !contains(possibleErrors, empty)) {
                    // Check for underflows
                    return Triad.Maybe(Flow.Underflow(modified, modified.length));

                } else
                    return Triad.Failure(actualErrors);

            } else
                return Triad.Success(original);
        };
    },

    defender = function(sayings) {
        return function(stream) {
            var M = State.StateT(IO),

                program =
                    M.lift(sayings)
                    .chain(compose(M.modify)(constant))
                    .chain(constant(M.lift(stream)))
                    .chain(function(a) {
                        return M.modify(function(b) {
                            return consume(a)(b).exec('');
                        });
                    })
                    .chain(constant(M.get))
                    .chain(function(a) {
                        return M.lift(a);
                    })
                    .chain(compose(M.modify)(output))
                    .chain(constant(M.get));
                    
            return program.exec([]);
        };
    };

exports = module.exports = defender;
