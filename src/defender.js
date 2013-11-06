var Validation = require('fantasy-validations'),
    combinators = require('fantasy-combinators'),
    IO = require('fantasy-io'),
    Maybe = require('fantasy-options'),
    State = require('fantasy-states'),
    Tuples = require('fantasy-tuples'),
    Either = require('fantasy-eithers'),
    Marshal = require('./marshal'),

    compose = combinators.compose,
    constant = combinators.constant,

    Success = Validation.Success,
    Failure = Validation.Failure,

    Left = Either.Left,
    Right = Either.Right,

    Tuple2 = Tuples.Tuple2,
    Tuple3 = Tuples.Tuple3,

    executeExpr = function(a) {
        return function(b) {
            return constant(b.exec(a));
        };
    },

    consume = function(a) {
        var string = a,
            M = State.StateT(IO);

        return function(b) {
            var accum = [],
                value,
                match,
                possible,
                position,
                i;

            /* Re-factor this to become recursive and only perform unsafe at the end */
            for(i = 0; i < b.length; i++) {
                value = b[i];

                possible =
                    M.lift(value)
                    .chain(compose(M.modify)(executeExpr(string)))
                    .chain(constant(M.get))
                    .exec('')
                    .unsafePerform();
                
                if(possible) {
                    match = possible[0];
                    string = string.slice(match.length);
                } else {
                    position = (a.length - string.length) + 1;
                    accum.push(Tuple3(string, Maybe.Some(value), position));
                    /* Let's move the string onwards */
                    if (string.length < 1)
                        break;
                    string = string.slice(1);
                }
            }

            return Tuple3(a, string, accum);
        };
    },

    containsError = function(x) {
        var i;
        for(i = 0; i < x.length; i++) {
            if (x[i]._1 !== '')
                return true;
        }
        return false;
    },

    createFailure = function(string, position) {
        return Failure([Tuple3(string, Maybe.None, position)]);
    },

    output = function() {
        return function(x) {
            var string = x._2,
                possibleErrors = x._3;

            /* Re-factor this, as it's really messy */
            if (possibleErrors.length < 1 && string.length > 0) {
                /* Check for overflows */
                return Left(createFailure(string, (x._1.length - string.length) + 1));

            } else if(possibleErrors.length > 0) {
                
                if (string.length < 1 && !containsError(possibleErrors)) {
                    /* Check for underflows */
                    return Right(createFailure(string, string.length));

                } else
                    return Left(Failure(possibleErrors));

            } else
                return Right(Success(x._1));
        };
    },

    defender = function(sayings) {
        return function(stream) {
            var M = State.StateT(IO),
                program = Marshal(M);

            return program(M.lift(sayings))
                    .modify(constant)
                    .lift(stream)
                    .modify(consume)
                    .get()
                    .modify(output)
                    .get()
                    .exec([]);
        };
    };

exports = module.exports = defender;
