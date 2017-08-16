import { singlify, singly } from './index';

declare global {
    const setTimeout: Function;
}

function sleep(t: number) {
    return new Promise(f => setTimeout(f, t));
}

describe('singlify', () => {
    function prepare() {
        let resolve = () => {};
        const promise = new Promise(_resolve => resolve = _resolve);
        const original = jest.fn(() => promise);
        const modified = singlify(original);
        return { original, modified, promise, resolve };
    }

    it('should call the target when it was run for the first time', async () => {
        const { original, modified } = prepare();
        modified();
        expect(original).toHaveBeenCalledTimes(1);
    });

    it('should not call the target until the result promise resolves', async () => {
        const { original, modified } = prepare();
        modified();
        expect(original).toHaveBeenCalledTimes(1);
        modified();
        await sleep(10);
        expect(original).toHaveBeenCalledTimes(1);
    });

    it('should call the target after the result promise resolves', async () => {
        const { original, modified, resolve } = prepare();
        modified();
        expect(original).toHaveBeenCalledTimes(1);
        resolve();
        await sleep(10);
        modified();
        expect(original).toHaveBeenCalledTimes(2);
    });

    it('should call the target again if called before promise resolves', async () => {
        const { original, modified, resolve } = prepare();
        modified();
        expect(original).toHaveBeenCalledTimes(1);
        modified(); // called before resolve
        resolve();
        await sleep(10);
        expect(original).toHaveBeenCalledTimes(2);
    });
});

describe('singly', () => {
    function prepare() {
        let resolve = () => {};
        const promise = new Promise(_resolve => resolve = _resolve);
        const original = jest.fn(() => promise);
        class Tester {
            @singly public test() {
                original();
                return promise;
            }
        }
        const tester = new Tester();
        const modified = () => tester.test();
        return { original, modified, promise, resolve };
    }

    it('should call the target when it was run for the first time', async () => {
        const { original, modified } = prepare();
        modified();
        expect(original).toHaveBeenCalledTimes(1);
    });

    it('should not call the target until the result promise resolves', async () => {
        const { original, modified } = prepare();
        modified();
        expect(original).toHaveBeenCalledTimes(1);
        modified();
        await sleep(10);
        expect(original).toHaveBeenCalledTimes(1);
    });

    it('should call the target after the result promise resolves', async () => {
        const { original, modified, resolve } = prepare();
        modified();
        expect(original).toHaveBeenCalledTimes(1);
        resolve();
        await sleep(10);
        modified();
        expect(original).toHaveBeenCalledTimes(2);
    });

    it('should call the target again if called before promise resolves', async () => {
        const { original, modified, resolve } = prepare();
        modified();
        expect(original).toHaveBeenCalledTimes(1);
        modified(); // called before resolve
        resolve();
        await sleep(10);
        expect(original).toHaveBeenCalledTimes(2);
    });
});