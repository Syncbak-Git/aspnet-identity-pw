var should = require('chai').should();
var expect = require('chai').expect;
var aspnetIdentityPW = require('../lib/aspnet-identity-pw');
var hashPassword = aspnetIdentityPW.hashPassword;
var validatePassword = aspnetIdentityPW.validatePassword;

var testPassword = '"Abc&123"';
var knownGoodHashValue = 'APCBvv9IQMJuBVmuNQOVA+XPPPPtF5zhnghAWDad7JWdx9BDv7HjiFSjo+IgZu3/Xw==';
var knownBadHashValue = 'APCBvv9IQMJuBVmuNQOVA+XPPPPtF5zhXDFSDDad7JWdx9BDv7HjiFSjo+IgZu3/Xw==';

var base64Regex = /^([A-Za-z0-9+\/]{4})*([A-Za-z0-9+\/]{4}|[A-Za-z0-9+\/]{3}=|[A-Za-z0-9+\/]{2}==)$/;


describe('#hashPassword - synchronous', function() {

    it('should throw an exception if password is null', function() {
        expect(function(){ hashedPassword(null); }).to.throw(Error);
    });

    it('should throw an exception if password is empty', function() {
        expect(function(){ hashedPassword(""); }).to.throw(Error);
    });

    var hashedPassword = hashPassword(testPassword);
    var buffer = new Buffer(hashedPassword, 'base64');

    it('should return a hashed password as a base64 encoded string', function() {
        base64Regex.test(hashedPassword).should.equal(true);
    });

    it('should return a result with a leading zero byte', function(){
        buffer[0].should.equal(0);
    });

    it('should return a result containing 49 bytes', function(){
        buffer.length.should.equal(49);
    });

});

describe('#hashPassword - asynchronous', function() {

    it('should callback with an error if password is null', function(done) {
        hashPassword(null, function(err, result){
            expect(err).to.be.an('object');
            done();
        })
    });

    it('should callback with an error if password is empty', function(done) {
        hashPassword("", function(err, result){
            err.should.be.an('object');
            done();
        })
    });

    it('should callback with a hashed password as a base64 encoded string', function(done) {
        hashPassword(testPassword, function(err, hashed) {
            base64Regex.test(hashed).should.equal(true);
            done();
        })
    });

    it('should callback with a result with a leading zero byte', function(done){
        hashPassword(testPassword, function(err, hashed) {
            var buffer = new Buffer(hashed, 'base64');
            buffer[0].should.equal(0);
            done();
        });
    });

    it('should callback with a result containing 49 bytes', function(done){
        hashPassword(testPassword, function(err, hashed) {
            var buffer = new Buffer(hashed, 'base64');
            buffer.length.should.equal(49);
            done();
        });
    });

});

describe('#validatePassword - synchronous', function() {

    var hashedPassword = hashPassword(testPassword);

    it('should throw an exception if the password is null', function() {
        expect(function() { validatePassword(null, hashedPassword); }).to.throw(Error);
    });

    it('should throw an exception if the password is empty', function() {
        expect(function() { validatePassword("", hashedPassword); }).to.throw(Error);
    });

    it('should return false if hashedPassword is null', function() {
        validatePassword(testPassword, null).should.equal(false);
    });

    it('should return false if hashedPassword is empty', function() {
        validatePassword(testPassword, "").should.equal(false);
    });

    it('should return true when comparing the password and it\'s hashed value', function() {
        validatePassword(testPassword, hashedPassword).should.equal(true);
    });

    it('should return true when comparing the password against a known good hash', function() {

        validatePassword(testPassword, knownGoodHashValue).should.equal(true);
    });

    it('should return false when comparing the password against a known bad hash', function() {

        validatePassword(testPassword, knownBadHashValue).should.equal(false);
    });

});

describe('#validatePassword - asynchronous', function() {

    var hashedPassword = hashPassword(testPassword);

    it('should callback with an error if the password is null', function(done) {
        validatePassword(null, hashedPassword, function(err, result) {
            expect(err).to.be.an('object');
            done();
        });
    });

    it('should callback with an error if the password is empty', function(done) {
        validatePassword("", hashedPassword, function(err, result) {
            expect(err).to.be.an('object');
            done();
        });
    });

    it('should callback with a result of false if hashedPassword is null', function(done) {
        validatePassword(testPassword, null, function(err, result) {
            result.should.equal(false);
            done();
        });
    });

    it('should callback with a result of false if hashedPassword is empty', function(done) {
        validatePassword(testPassword, "", function(err, result) {
            result.should.equal(false);
            done();
        });
    });

    it('should callback with a result of true when comparing the password and it\'s hashed value', function(done) {
        validatePassword(testPassword, hashedPassword, function(err, result) {
            result.should.equal(true);
            done();
        });
    });

    it('should callback with a result of true when comparing the password against a known good hash', function(done) {
        validatePassword(testPassword, knownGoodHashValue, function(err, result) {
            result.should.equal(true);
            done();
        });
    });

    it('should callback with a result of false when comparing the password against a known bad hash', function(done) {
        validatePassword(testPassword, knownBadHashValue, function(err, result) {
            result.should.equal(false);
            done();
        });
    });

});


