
function anything(a) {
	return new RegExp('^' + a + '+');
}

function anythingBut(a) {
	return new RegExp('^[^' + a + ']+');
}

function then(a) {
	return new RegExp('^' + a);
}

function range(from, to) {
	return new RegExp('^[' + from + '-' + to + ']');
}

exports = module.exports = {
	anything: anything,
	anythingBut: anythingBut,
	then: then,
	range: range
};
