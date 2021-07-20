export const State = (initialState, listener) => {
    let value;
    let listeners = [];
    const state = (newValue) => {
        if (newValue !== undefined) {
            value = newValue;
            listeners = listeners.filter(l => (l.run(value), !l.once));
        }
        return value;
    };
    state.subscribe = (cb, once = false) => new Promise(resolve => {
        listeners.push({ run: v => resolve(cb(v)), once });
    });
    state.then = cb => state.subscribe(cb, true);
    listener && state.subscribe(listener);
    state(initialState);
    return state;
};