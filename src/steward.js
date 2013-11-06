var combinators = require('fantasy-combinators'),
    
    compose = combinators.compose,

    steward = function(a, b) {
        return function(c) {
            return compose(compose(b)(c))(a);
        };
    };

exports = module.exports = steward;
