var IO = require('fantasy-io'),
    combinators = require('fantasy-combinators'),

    defenders = require('../defenders'),

    constant = combinators.constant,

    defender = defenders.defender,
    guardian = defenders.guardian,
    soothsayer = defenders.soothsayer,

    runes = defenders.runes,

    anythingBut = runes.anythingBut,
    range = runes.range,
    then = runes.then,

    readSortCode = function() {
        return IO(function() {
            return '1 1 - 2 2 - 3 3';
        });
    },

    readEmail = function() {
        return IO(function() {
            return 'dark.knight+spam@batman.gotham.com';
        });
    },

    isSuccessful = function(a) {
        return a.cata({
            Success: constant(true),
            Maybe: constant(false),
            Failure: constant(false)
        });
    },

    readSortCodePattern = function() {
        return IO(function() {
            return '##-##-##';
        });
    },
    readEmailPattern = function() {
        return IO(function() {
            return '_@_';
        });
    };

exports.defenders = {
    'when testing the defenders against a sort code should return correct value': function(test) {
        var sayer = soothsayer({
                '#': range(0, 9),
                '-': then('-')
            })(readSortCodePattern()),
            defend = defender(sayer),
            value = guardian(/^\s/)(readSortCode());

        test.ok(isSuccessful(defend(value).unsafePerform()));
        test.done();
    },
    'when testing the defenders against a email should return correct value': function(test) {
        var sayer = soothsayer({
                '_': anythingBut('@'),
                '@': then('@')
            })(readEmailPattern()),
            defend = defender(sayer),
            value = guardian(/^\s/)(readEmail());

        test.ok(isSuccessful(defend(value).unsafePerform()));
        test.done();
    }
};
