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

    isSuccess = function(a) {
        return a.fold(
            constant(false),
            constant(true)
        );
    };

exports.defenders = {
    'when testing the defenders against a sort code should return correct value': function(test) {
        var sayer = soothsayer({
                '#': range(0, 9),
                '-': then('-')
            })('##-##-##'),
            defend = defender(sayer),
            value = guardian(/^\s/)(readSortCode());

        test.ok(isSuccess(defend(value).unsafePerform()));
        test.done();
    },
    'when testing the defenders against a email should return correct value': function(test) {
        var sayer = soothsayer({
                '_': anythingBut('@'),
                '@': then('@')
            })('_@_'),
            defend = defender(sayer),
            value = guardian(/^\s/)(readEmail());

        test.ok(isSuccess(defend(value).unsafePerform()));
        test.done();
    }
};
