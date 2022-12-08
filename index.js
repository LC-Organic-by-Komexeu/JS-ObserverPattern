window.LC = window.LC || {};
window.LC.Store = window.LC.Store || {
    Username: '',
    Password: '',
};
window.LC.StoreObserve = new Set();
window.LC.StoreProxy = new Proxy(window.LC.Store, {
    set(target, key, value, receiver) {
        const result = Reflect.set(target, key, value, receiver)
        Array.from(window.LC.StoreObserve).filter(a => a.key === key).forEach(observe => {
            observe.element.value = value
        })
        return result
    },
})

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll(`[data-bind]`).forEach(e => {
        let key = e.dataset.bind
        window.LC.StoreObserve.add({
            key: key,
            element: e,
        })
    })
});
