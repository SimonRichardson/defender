var IO = require('fantasy-io');

function anything(a) {
    return IO(function() {
        return new RegExp('^' + a + '+');
    });
}

function anythingBut(a) {
    return IO(function() {
        return new RegExp('^[^' + a + ']+');
    });
}

function then(a) {
    return IO(function() {
        return new RegExp('^' + a);
    });
}

function range(from, to) {
    return IO(function() {
        return new RegExp('^[' + from + '-' + to + ']');
    });
}

exports = module.exports = {
	anything: anything,
	anythingBut: anythingBut,
	then: then,
	range: range
};
