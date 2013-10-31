var Validation = require('fantasy-validations'),

    Success = Validation.Success,
    Failure = Validation.Failure;

function defender() {
    return function(x) {
        return Failure(['n/a']);
    };
}

exports = module.exports = defender;