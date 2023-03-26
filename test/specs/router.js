import { expect } from 'chai';
import sinon from 'sinon';
import Router from '../../src/router.js';

describe('router', () => {
    it('should route root paths', () => {
        const callback = sinon.spy();

        const router = Router();
        expect(router.route('/', callback)).to.equal(router);

        expect(router.dispatch('/')).to.equal(router);
        expect(callback.callCount).to.equal(1);
        expect(callback.args[0][0]).to.deep.equal({});

        router.dispatch('');
        expect(callback.callCount).to.equal(1);
    });

    it('should route single static paths', () => {
        const callback = sinon.spy();

        const router = Router({'/foo': callback});
        router.route('/bar/', callback);

        router.dispatch('/foo');
        expect(callback.callCount).to.equal(1);
        expect(callback.args[0][0]).to.deep.equal({});

        router.dispatch('/foo/');
        expect(callback.callCount).to.equal(2);
        expect(callback.args[1][0]).to.deep.equal({});

        router.dispatch('/bar');
        expect(callback.callCount).to.equal(3);
        expect(callback.args[2][0]).to.deep.equal({});

        router.dispatch('/bar/');
        expect(callback.callCount).to.equal(4);
        expect(callback.args[3][0]).to.deep.equal({});

        router.dispatch('');
        router.dispatch('/');
        router.dispatch('foo/');
        router.dispatch('foo');
        router.dispatch('/foo/bar');
        expect(callback.callCount).to.equal(4);
    });

    it('should route multiple static paths', () => {
        const callback = sinon.spy();

        const router = Router();
        router.route('/foo/bar/baz', callback);

        router.dispatch('/foo/bar/baz');
        expect(callback.callCount).to.equal(1);
        expect(callback.args[0][0]).to.deep.equal({});

        router.dispatch('/foo/bar/baz/');
        expect(callback.callCount).to.equal(2);
        expect(callback.args[1][0]).to.deep.equal({});


        router.dispatch('foo/bar/baz');
        router.dispatch('/foo/bar/baz/qux');
        router.dispatch('/fo/bar/baz');
        expect(callback.callCount).to.equal(2);
    });

    it('should route paths with a single parameter', () => {
        const callback = sinon.spy();

        const router = Router();
        router.route('/:foo', callback);

        router.dispatch('/aaa');
        expect(callback.callCount).to.equal(1);
        expect(callback.args[0][0]).to.deep.equal({foo: 'aaa'});

        router.dispatch('/bbb/');
        expect(callback.callCount).to.equal(2);
        expect(callback.args[1][0]).to.deep.equal({foo: 'bbb'});

        router.dispatch('');
        router.dispatch('/');
        router.dispatch('root');
        router.dispatch('root/');
        expect(callback.callCount).to.equal(2);

        router.route('/root/:foo', callback);

        router.dispatch('/root/aaa');
        expect(callback.callCount).to.equal(3);
        expect(callback.args[2][0]).to.deep.equal({foo: 'aaa'});

        router.dispatch('/root/bbb/');
        expect(callback.callCount).to.equal(4);
        expect(callback.args[3][0]).to.deep.equal({foo: 'bbb'});

        router.dispatch('root/foo');
        router.dispatch('root/foo/');
        router.dispatch('/root/foo/bar');
        expect(callback.callCount).to.equal(4);
    });

    it('should route paths with multiple parameters', () => {
        const callback = sinon.spy();

        const router = Router();
        router.route('/root/:foo/:bar', callback);

        router.dispatch('/root/foo/bar');
        expect(callback.callCount).to.equal(1);
        expect(callback.args[0][0]).to.deep.equal({foo: 'foo', bar: 'bar'});

        router.dispatch('/root/aaa/bbb/');
        expect(callback.callCount).to.equal(2);
        expect(callback.args[1][0]).to.deep.equal({foo: 'aaa', bar: 'bbb'});

        router.dispatch('root/foo/bar');
        router.dispatch('root/foo');
        router.dispatch('root/foo/');
        router.dispatch('/root/foo');
        router.dispatch('/root/foo/');
        expect(callback.callCount).to.equal(2);

        router.route('/root/:foo/static/:bar', callback);

        router.dispatch('/root/foo/static/bar');
        expect(callback.callCount).to.equal(3);
        expect(callback.args[2][0]).to.deep.equal({foo: 'foo', bar: 'bar'});

        router.dispatch('/root/aaa/static/bbb/');
        expect(callback.callCount).to.equal(4);
        expect(callback.args[3][0]).to.deep.equal({foo: 'aaa', bar: 'bbb'});

        router.dispatch('root/foo/static/bar');
        router.dispatch('/root/foo/staic/bar');
        router.dispatch('/root/foo/static/bar/baz');
        expect(callback.callCount).to.equal(4);
    });

    it('should route paths with a single optional parameter', () => {
        const callback = sinon.spy();

        const router = Router();
        router.route('/root/:foo?', callback);

        router.dispatch('/root');
        expect(callback.callCount).to.equal(1);
        expect(callback.args[0][0]).to.deep.equal({foo: null});

        router.dispatch('/root/');
        expect(callback.callCount).to.equal(2);
        expect(callback.args[1][0]).to.deep.equal({foo: null});

        router.dispatch('/root/foo');
        expect(callback.callCount).to.equal(3);
        expect(callback.args[2][0]).to.deep.equal({foo: 'foo'});

        router.dispatch('/root/bar/');
        expect(callback.callCount).to.equal(4);
        expect(callback.args[3][0]).to.deep.equal({foo: 'bar'});

        router.dispatch('root/foo/bar');
        router.dispatch('root/foo/bar/');
        router.dispatch('/root/foo/bar');
        expect(callback.callCount).to.equal(4);

        router.route('/:foo?', callback);

        router.dispatch('/');
        expect(callback.callCount).to.equal(5);
        expect(callback.args[4][0]).to.deep.equal({foo: null});

        router.dispatch('/foo');
        expect(callback.callCount).to.equal(6);
        expect(callback.args[5][0]).to.deep.equal({foo: 'foo'});

        router.dispatch('/bar/');
        expect(callback.callCount).to.equal(7);
        expect(callback.args[6][0]).to.deep.equal({foo: 'bar'});

        router.dispatch('');
        expect(callback.callCount).to.equal(7);
    });

    it('should route paths with multiple optional parameters', () => {
        const callback = sinon.spy();

        const router = Router();
        router.route('/root/:foo?/static/:bar?', callback);

        router.dispatch('/root/foo/static');
        expect(callback.callCount).to.equal(1);
        expect(callback.args[0][0]).to.deep.equal({foo: 'foo', bar: null});

        router.dispatch('/root/bar/static/');
        expect(callback.callCount).to.equal(2);
        expect(callback.args[1][0]).to.deep.equal({foo: 'bar', bar: null});

        router.dispatch('/root/foo/static/bar');
        expect(callback.callCount).to.equal(3);
        expect(callback.args[2][0]).to.deep.equal({foo: 'foo', bar: 'bar'});

        router.dispatch('/root/aaa/static/bbb/');
        expect(callback.callCount).to.equal(4);
        expect(callback.args[3][0]).to.deep.equal({foo: 'aaa', bar: 'bbb'});

        router.dispatch('root/foo/static');
        router.dispatch('root/foo/static/bar/');
        router.dispatch('/root/foo/static/bar/baz');
        router.dispatch('/root/foo/staic/bar');
        expect(callback.callCount).to.equal(4);

        router.route('/root/:foo?/:bar?', callback);

        router.dispatch('/root/foo');
        expect(callback.callCount).to.equal(5);
        expect(callback.args[4][0]).to.deep.equal({foo: 'foo', bar: null});

        router.dispatch('/root/bar/');
        expect(callback.callCount).to.equal(6);
        expect(callback.args[5][0]).to.deep.equal({foo: 'bar', bar: null});

        router.dispatch('/root/foo/bar');
        expect(callback.callCount).to.equal(7);
        expect(callback.args[6][0]).to.deep.equal({foo: 'foo', bar: 'bar'});

        router.dispatch('/root/aaa/bbb/');
        expect(callback.callCount).to.equal(8);
        expect(callback.args[7][0]).to.deep.equal({foo: 'aaa', bar: 'bbb'});

        router.dispatch('root/foo');
        router.dispatch('root/foo/');
        router.dispatch('root/foo/bar');
        router.dispatch('root/foo/bar/');
        router.dispatch('/root/foo/bar/baz');
        expect(callback.callCount).to.equal(8);
    });

    it('should route wildcards', () => {
        const callback = sinon.spy();

        const router = Router();
        router.route('/root/*', callback);

        router.dispatch('/root/foo');
        expect(callback.callCount).to.equal(1);
        expect(callback.args[0][0]).to.deep.equal({wildcard: 'foo'});

        router.dispatch('/root/bar/');
        expect(callback.callCount).to.equal(2);
        expect(callback.args[1][0]).to.deep.equal({wildcard: 'bar'});

        router.dispatch('/root/foo/bar');
        expect(callback.callCount).to.equal(3);
        expect(callback.args[2][0]).to.deep.equal({wildcard: 'foo/bar'});

        router.dispatch('/root');
        router.dispatch('/root/');
        router.dispatch('root/foo');
        router.dispatch('root/foo/');
        expect(callback.callCount).to.equal(3);

        router.route('/*', callback);

        router.dispatch('/');
        expect(callback.callCount).to.equal(4);
        expect(callback.args[3][0]).to.deep.equal({wildcard: ''});

        router.dispatch('/foo');
        expect(callback.callCount).to.equal(5);
        expect(callback.args[4][0]).to.deep.equal({wildcard: 'foo'});

        router.dispatch('/bar/');
        expect(callback.callCount).to.equal(6);
        expect(callback.args[5][0]).to.deep.equal({wildcard: 'bar'});

        router.dispatch('/foo/bar');
        expect(callback.callCount).to.equal(7);
        expect(callback.args[6][0]).to.deep.equal({wildcard: 'foo/bar'});

        router.dispatch('');
        expect(callback.callCount).to.equal(7);
    });

    it('should route paths with parameters and optional parameters', () => {
        const callback = sinon.spy();

        const router = Router();
        router.route('/root/:foo/:bar?/:baz?', callback);

        router.dispatch('/root/foo');
        expect(callback.callCount).to.equal(1);
        expect(callback.args[0][0]).to.deep.equal({foo: 'foo', bar: null, baz: null});

        router.dispatch('/root/bar/');
        expect(callback.callCount).to.equal(2);
        expect(callback.args[1][0]).to.deep.equal({foo: 'bar', bar: null, baz: null});

        router.dispatch('/root/foo/bar');
        expect(callback.callCount).to.equal(3);
        expect(callback.args[2][0]).to.deep.equal({foo: 'foo', bar: 'bar', baz: null});

        router.dispatch('/root/aaa/bbb/');
        expect(callback.callCount).to.equal(4);
        expect(callback.args[3][0]).to.deep.equal({foo: 'aaa', bar: 'bbb', baz: null});

        router.dispatch('/root/foo/bar/baz');
        expect(callback.callCount).to.equal(5);
        expect(callback.args[4][0]).to.deep.equal({foo: 'foo', bar: 'bar', baz: 'baz'});

        router.dispatch('/root/aaa/bbb/ccc/');
        expect(callback.callCount).to.equal(6);
        expect(callback.args[5][0]).to.deep.equal({foo: 'aaa', bar: 'bbb', baz: 'ccc'});

        router.dispatch('/root');
        router.dispatch('/root/');
        router.dispatch('root/foo');
        expect(callback.callCount).to.equal(6);
    });

    it('should not call a static route over an optional route', () => {
        const callback1 = sinon.spy();
        const callback2 = sinon.spy();

        const router = Router({
            '/foo/:bar': callback1,
            '/foo/:bar/:baz?': callback2
        });

        router.dispatch('/foo/aaa');
        expect(callback1.callCount).to.equal(1);
        expect(callback1.args[0][0]).to.deep.equal({bar: 'aaa'});
        expect(callback2.callCount).to.equal(0);

        router.dispatch('/foo/aaa/bbb');
        expect(callback2.callCount).to.equal(1);
        expect(callback2.args[0][0]).to.deep.equal({bar: 'aaa', baz: 'bbb'});
        expect(callback1.callCount).to.equal(1);
    });

    it('should route special characters as defined by RFC 3986', () => {
        const callback = sinon.spy();

        const router = Router();
        router.route('/foo/:bar', callback);

        router.dispatch('/foo/-._~:?#[]@!$&\'()*+,;=');
        expect(callback.called).to.equal(true);
        expect(callback.args[0][0].bar).to.equal('-._~:?#[]@!$&\'()*+,;=');
    });

    it('should decode URL-encoded parameters', () => {
        const callback = sinon.spy();

        const router = Router();
        router.route('/foo/:bar', callback);

        router.dispatch('/foo/%D1%88%D0%B5%D0%BB%D0%BB%D1%8B');
        expect(callback.called).to.equal(true);
        expect(callback.args[0][0].bar).to.equal('шеллы');
    });

    it('should convert string versions of a primitive value to its natural type', () => {
        const callback = sinon.spy();

        const router = Router();
        router.route('/:string/:true/:false/:int/:float', callback);

        router.dispatch('/foo/true/false/123/45.891');
        expect(callback.called).to.equal(true);

        const params = callback.args[0][0];
        expect(params.string).to.equal('foo');
        expect(params.true).to.equal(true);
        expect(params.false).to.equal(false);
        expect(params.int).to.equal(123);
        expect(params.float).to.equal(45.891);
    });
});
