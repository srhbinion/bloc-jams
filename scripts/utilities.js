//HTMLCollection.prototype.forEach = function(callback) {
//    for (var i = 0; i < this.length; i++) {
//        callback(this[i]);
//    };
//};

var forEach = function(array, callback) {
    for (var i = 0; i < array.length; i++) {
        callback(array[i]);
    };
};