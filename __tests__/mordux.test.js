import { State } from '../mordux';
describe('State', () => {
    it('getter should return the initial value', () => {
        const a = State("cat");
        expect(a()).toEqual("cat");
    });
    it('getter should not change value when calling without an argument', () => {
        const a = State("cat");
        const firstCall = a();
        const secondCall = a();
        expect(firstCall).toEqual("cat");
        expect(secondCall).toEqual("cat");
    });

    it('setter should return new value', () => {
        const a = State("dog");
        expect(a("doge")).toEqual("doge");
    });

    it('setter should set new value and getter should return it', () => {
        const a = State("dog");
        a("doge");
        expect(a()).toEqual("doge");
    });

    it('should subscribe via passing callback to constructor', () => {
        const events = [];
        const a = State("cat", (v) => {
            events.push(v);
        });
        a("dog");
        a("monkey");
        a("duck");
        expect(events).toEqual([
            "cat", "dog", "monkey", "duck",
        ]);
    });

    it('should subscribe via `subscribe` method', () => {
        const events = [];
        const a = State("cat");
        a.subscribe((v) => {
            events.push(v);
        });
        a("dog");
        a("monkey");
        a.subscribe(function secondListener(v) {
            events.push(v + "!");
        });
        a("duck");
        expect(events).toEqual([
            "dog", "monkey", "duck", "duck!",
        ]);
    });

    it('should be thenable', () => {
        const events = [];
        const a = State(1);
        Promise.resolve().then(async () => {
            a(2);
            await Promise.resolve();
            expect(events).toEqual([
                2, 4
            ]);
        });
        return a.then(v => {
            events.push(v);
            return v * 2;
        }).then(v => {
            events.push(v);
        });
    });

    it('should be awaitable', async () => {
        const events = [];
        const a = State(1);
        setTimeout(() => {
            a(2);
            setTimeout(() => {
                a(3);
            }, 0);
        }, 0);
        let v = await a;
        expect(v).toEqual(2);
        v = await a;
        expect(v).toEqual(3);
    });
});