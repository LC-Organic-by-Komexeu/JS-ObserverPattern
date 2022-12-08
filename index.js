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
            observe.element.value = observe.transform(value)
        })
        return result
    },
})

window.LC.StoreTransform = {
    ToUpper: (text) => {
        return text.toUpperCase()
    },
    ToLower: (text) => {
        return text.toLowerCase()
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll(`[data-bind]`).forEach(e => {
        let key = e.dataset.bind
        let transform = e.dataset.transform
        window.LC.StoreObserve.add({
            key: key,
            element: e,
            transform: window.LC.StoreTransform[transform]
        })

        e.addEventListener('input', (event) => {
            Reflect.set(window.LC.Store, key, event.currentTarget.value)
        })
    })
});
