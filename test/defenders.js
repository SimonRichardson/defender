var IO = require('fantasy-io'),
    combinators = require('fantasy-combinators'),

    defenders = require('../defenders'),

    constant = combinators.constant,

    defender = defenders.defender,
    guardian = defenders.guardian,
    soothsayer = defenders.soothsayer,

    readInput = function() {
        return IO(function() {
            /* This is just for now. */
            return '1 1 - 2 2 - 3 3';
        });
    },

    isSuccess = function(a) {
        return a.fold(
            constant(false),
            constant(true)
        );
    };

exports.defenders = {
    'when testing the defenders against a sort code should return correct value': function(test) {
        var sayer = soothsayer({
                '#': /^[0-9]/,
                '-': /^-/
            })('##-##-##'),
            defend = defender(sayer),
            value = guardian(/^\s/)(readInput());

        test.ok(isSuccess(defend(value).unsafePerform()));
        test.done();
    }
};
