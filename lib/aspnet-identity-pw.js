var crypto = require("crypto");

exports.hashPassword = function hashPassword(password, callback) {

    var error = null;
    var result = null;

    if(!password) {

        error = new Error("Password is required.");

        // If no callback is specified, we are executing in synchronous mode.
        if(!callback) {
            throw error;
        }

        setImmediate(callback, error);
        return;
    }

    crypto.randomBytes(16, function(err, salt) {

        if(err) {

            // If no callback is specified, we are executing in synchronous mode.
            if(!callback) {
                error = err;
                return;
            }

            setImmediate(callback, err);
            return;
        }

        crypto.pbkdf2(password, salt, 1000, 32, 'sha1', function(err, bytes){

            if(err) {

                // If no callback is specified, we are executing in synchronous mode.
                if(!callback) {
                    error = err;
                    return;
                }

                setImmediate(callback, err);
                return;
            }

            var output = new Buffer(49);
            output.fill(0);

            salt.copy(output, 1, 0, 16);
            bytes.copy(output, 17, 0, 32);

            result = output.toString('base64');

            if(!callback) {
                return;
            }

            setImmediate(callback, null, result);
        });
    });

    // If we have a callback, we don't need to go any further
    if(callback) {
        return;
    }

    // Wait for the error or result object to be populated before continuing.
    while(!error && !result) {
        require('deasync').runLoopOnce();
    }

    if(error) {
        throw error;
    }

    return result;
};

exports.validatePassword = function validatePassword(password, hashedPassword, callback) {

    var done = false;
    var error = null;

    if(!hashedPassword) {

        if(callback) {
            setImmediate(callback, null, false);
        }

        return false;
    }

    if(!password) {

        error = new Error("Password is required.");

        if(callback) {
            setImmediate(callback, error);
            return;
        }

        throw error;
    }

    var src = new Buffer(hashedPassword, 'base64');

    if(src.length != 49 || src[0] !== 0) {
        return false;
    }

    var salt = new Buffer(16);
    src.copy(salt, 0, 1, 17);

    var bytes = new Buffer(32);
    src.copy(bytes, 0, 17, 49);

    crypto.pbkdf2(password, salt, 1000, 32, 'sha1', function(err, hashBytes){

        if(err) {

            // If no callback is specified, we are executing in synchronous mode.
            if(!callback) {
                error = err;
                return;
            }

            setImmediate(callback, err);
            return;
        }


        result = true;

        for(i = 0; i < 32; i++) {
            if(bytes[i] !== hashBytes[i]) {
                result = false;
                break;
            }
        }

        done = true;

        if(callback) {
            setImmediate(callback, null, result);
        }

    });

    // If we have a callback, we don't need to go any further
    if(callback) {
        return;
    }

    // Wait for the error or result object to be populated before continuing.
    while(!error && !done) {
        require('deasync').runLoopOnce();
    }

    if(error) {
        throw error;
    }

    return result;
};