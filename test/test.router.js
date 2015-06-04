describe('router', function(){
    'use strict';

    var expect = chai.expect;

    it('should invoke callback for matching path', function(){
        var router = new Router();
        var spy = sinon.spy();
        router.route('/foo/bar', spy);
        router.dispatch('/foo/bar');
        expect(spy.called).to.equal(true);
    });

    it('should pass parameters to the callback for matching path', function(){
        var router = Router();
        var spy = sinon.spy();
        router.route('/foo/:bar/baz/:qux', spy);
        router.dispatch('/foo/123/baz/abc');
        expect(spy.called).to.equal(true);
        expect(spy.calledWith('123', 'abc')).to.equal(true);
    });

    it('should support special characters as defined by RFC 3986', function(){
        var router = Router();
        var spy = sinon.spy();
        router.route('/foo/:bar', spy);
        router.dispatch('/foo/-._~:?#[]@!$&\'()*+,;=');
        expect(spy.called).to.equal(true);
        expect(spy.calledWith('-._~:?#[]@!$&\'()*+,;=')).to.equal(true);
    });

    it('should stop matching after finding the first successful match', function(){
        var spy1 = sinon.spy();
        var spy2 = sinon.spy();
        var spy3 = sinon.spy();
        Router()
            .route('/foo', spy1)
            .route('/bar', spy2)
            .route('/baz', spy3)
            .dispatch('/foo');
        expect(spy1.called).to.equal(true);
        expect(spy2.called).to.equal(false);
        expect(spy3.called).to.equal(false);
    });

});