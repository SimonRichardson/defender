var Validation = require('fantasy-validations'),
    combinators = require('fantasy-combinators'),
    IO = require('fantasy-io'),
    Maybe = require('fantasy-options'),
    State = require('fantasy-states'),
    Tuples = require('fantasy-tuples'),

    compose = combinators.compose,
    constant = combinators.constant,

    Success = Validation.Success,
    Failure = Validation.Failure,

    Tuple2 = Tuples.Tuple2,
    Tuple3 = Tuples.Tuple3,

    consume = function(a) {
        var string = a;
        return function(b) {
            var accum = [],
                tuple,
                match,
                possible,
                i;

            /* Re-factor this to become recursive */
            for(i = 0; i < b.length; i++) {
                tuple = b[i];
                possible = tuple._1.exec(string);

                if(possible) {
                    match = possible[0];
                    string = string.slice(match.length);
                } else {
                    accum.push(Tuple3(string, Maybe.Some(tuple._1), tuple._2));
                }
            }

            /* This is to catch overflows */
            if (accum.length === 0 && string.length > 0) {
                accum.push(Tuple3(string, Maybe.None, i));
            }
            
            return Tuple2(a, accum);
        };
    },

    output = function() {
        return function(x) {
            /* This feels dirty */
            return x._2.length > 0 ? Failure(x._2) : Success(x._1);
        };
    },

    defender = function(sayings) {
        return function(stream) {
            var M = State.StateT(IO),

                program =
                    M.lift(sayings)
                    .chain(compose(M.modify)(constant))
                    .chain(constant(M.lift(stream)))
                    .chain(compose(M.modify)(consume))
                    .chain(constant(M.get))
                    .chain(compose(M.modify)(output))
                    .chain(constant(M.get));

            return program.exec([]);
        };
    };

exports = module.exports = defender;
