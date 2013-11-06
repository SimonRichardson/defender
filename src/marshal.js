var daggy = require('daggy'),
    combinators = require('fantasy-combinators'),

    compose = combinators.compose,
    constant = combinators.constant;

var Marshal = function(M) {
    
    var Orders = daggy.tagged('run');

    Orders.prototype.modify = function(a) {
        return Orders(this.run.chain(compose(M.modify)(a)));
    };

    Orders.prototype.lift = function(a) {
        return Orders(this.run.chain(constant(M.lift(a))));
    };

    Orders.prototype.get = function() {
        return Orders(this.run.chain(constant(M.get)));
    };

    Orders.prototype.exec = function(a) {
        return this.run.exec(a);
    };

    return Orders;
};

exports = module.exports = Marshal;
