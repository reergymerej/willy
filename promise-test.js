var Q = require('q');

var async = function (fn, wait) {
    setTimeout(fn, wait);
};

var get10Promise = function () {
    return Q.Promise(function (resolve, reject, notify) {
        async(function () {
            resolve(10);
        }, 100);
    });
};

var thrPromise = function () {
    return Q.Promise(function (resolve, reject, notify) {
        async(function () {
            reject(new Error('dang'));
        }, 500);
    });
};

var valPromise = function () {
    return Q.fcall(function () {
        return 666;
    });
};

var getRandPromise = function () {
    var num = Math.random();
    if (num < 0.33) {
        return get10Promise();
    } else if (num < 0.66) {
        return thrPromise();
    } else {
        return valPromise();
    }
};

var success = function (val) {
    console.log('got val', val);
};

var err = function (err) {
    console.log('caught error', err);
};

var promise;
for (var i = 10; i; i--) {
    promise = getRandPromise();
    console.log(promise);
    promise.then(success, err);
}