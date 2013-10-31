var IO = require('fantasy-io'),

    defender = require('../defender').defender,
    normaliser = require('../defender').normaliser,

    readInput = function() {
        return IO(function() {
            /* This is just for now. */
            return '1 1 - 2 2 - 3 3';
        });
    };

exports.defender = {
    'testing': function(test) {

        var defend = defender('##-##-##'),
            value = normaliser(/^\s/)(readInput());

        console.log(value.unsafePerform());

        defend(value).fold(
            function(errors) {
                console.log('Failure', errors);
            },
            function(result) {
                console.log('Success', result);
            }
        );

        test.ok(true);
        test.done();
    }
};
    