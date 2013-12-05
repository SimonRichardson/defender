var Validation = require('fantasy-validations'),
    combinators = require('fantasy-combinators'),
    IO = require('fantasy-io'),
    Maybe = require('fantasy-options'),
    State = require('fantasy-states'),
    Tuples = require('fantasy-tuples'),
    Either = require('fantasy-eithers'),

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

    validateString = function(string) {
        if(possible) {
            string = string.slice(possible[0].length);
        } else {
            position = (a.length - string.length) + 1;
            accum.push(Tuple3(string, Maybe.Some(value), position));
            /* Let's move the string onwards */
            if (string.length < 1)
                return Tuple2(string, accum);
            string = string.slice(1);
        }
    },

    consume = function(a) {
        var M = State.StateT(IO);

        return function(b) {
            var rec = function(index, program) {
                return function(string) {
                    if (index < b.length) {
                        return program
                                .chain(constant(M.lift(b[index])))
                                .chain(constant(M.modify)(executeExpr(string)))
                                .chain(constant(M.get))
                                .chain(constant(M.modify)(validateString))
                                .chain(constant(M.get))
                                .chain(constant(M.modify)(rec(index + 1, program)));
                    } else {
                        return program;
                    }
                };
            };
            result = rec(0, M.of(''))(a);
            console.log(result.exec('').unsafePerform());

            return Tuple3(a, '', '');
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
