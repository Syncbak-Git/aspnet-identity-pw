aspnet-identity-pw
==================

Node.js package for hashing and validating passwords using the default ASP.NET Identity password hash algorithm.

## Installation

  npm install aspnet-identity-pw

## Usage (Sync)
```javascript
  var passwordHasher = require('aspnet-identity-pw');
  
  var hashedPassword = passwordHasher.hashPassword('SomePassword');
  
  var isValid = passwordHasher.validatePassword('SomePassword', hashedPassword);
  ```

## Usage (Async)
```javascript
  var passwordHasher = require('aspnet-identity-pw');
  var hashedPassword = null;
  var isValid = null;

  passwordHasher.hashPassword('SomePassword', function(err, result) {
    hashedPassword = result;
  });

  passwordHasher.validatePassword('SomePassword', hashedPassword, function(err, result) {
    isValid = result;
  });
```
## Tests

  npm test

## Release History

* 1.0.0 Initial release
* 1.0.1 Updated deasync package
* 1.0.2 Fixed crypto.pbkdf2 deprecation warning
