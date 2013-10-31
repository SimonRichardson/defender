var helpers = require('fantasy-helpers'),
    combinators = require('fantasy-combinators'),
    Option = require('fantasy-options'),

    defender = require('../defender').defender,
    normaliser = require('../defender').normaliser,

    ap = combinators.apply,
    compose = combinators.compose,

    Some = Option.Some,
    None = Option.None,

    whitespace = /^\s/;

exports.defender = {
    'testing': function(test) {

        var defend = defender('##-##-##'),
            value = normaliser(whitespace)('1 1 - 2 2 - 3 3');

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
    