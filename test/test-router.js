/* eslint-disable max-len, no-unused-expressions */

import { expect } from 'chai';
import Router from '../src/router';

describe('Router', () => {
    it('should invoke callback for matching path', () => {
        const router = new Router();
        const spy = sinon.spy();
        router.route('/foo/bar', spy);
        router.dispatch('/foo/bar');
        expect(spy.called).to.equal(true);
    });

    it('should pass parameters to the callback for matching path', () => {
        const router = Router();
        const spy = sinon.spy();
        router.route('/foo/:bar/baz/:qux', spy);
        router.dispatch('/foo/123/baz/abc');
        expect(spy.called).to.equal(true);
        expect(spy.calledWith('123', 'abc')).to.equal(true);
    });

    it('should support special characters as defined by RFC 3986', () => {
        const spy = sinon.spy();
        const router = Router({
            '/foo/:bar': spy
        });
        router.dispatch('/foo/-._~:?#[]@!$&\'()*+,;=');
        expect(spy.called).to.equal(true);
        expect(spy.calledWith('-._~:?#[]@!$&\'()*+,;=')).to.equal(true);
    });

    it('should stop matching after finding the first successful match', () => {
        const spy1 = sinon.spy();
        const spy2 = sinon.spy();
        const spy3 = sinon.spy();
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