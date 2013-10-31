var IO = require('fantasy-io'),

    defenders = require('../defenders'),

    defender = defenders.defender,
    guardian = defenders.guardian,
    soothsayer = defenders.soothsayer,

    readInput = function() {
        return IO(function() {
            /* This is just for now. */
            return '1 1 - 2 2 - 3 3';
        });
    };

/*
1. split pattern
2. create regexp - verbal or similar?
3. zip with index
4. run through io value unit we match
5. report on where failure occured
*/

exports.defender = {
    'testing': function(test) {

        var sayer = soothsayer({
                '#': /^[0-9]/,
                '-': /^-/
            })('##-##-##'),
            defend = defender(sayer),
            value = guardian(/^\s/)(readInput());

        defend(value).unsafePerform().fold(
            function(errors) {
                console.log('Errors', errors);
            },
            function(x) {
                console.log('Win!', x);
            }
        );

        test.ok(true);
        test.done();
    }
};
    