window.LC = window.LC || {};
window.LC.Store = window.LC.Store || {
    Username: '',
    Password: '',
    Info: {
        Tel: '',
        Email: '',
    }
};
window.LC.StoreObserve = new Set();
window.LC.StoreProxy = new Proxy(window.LC.Store, {
    set(target, key, value, receiver) {
        const result = ReflectNestedSet(target, key.split('.'), value)
        Array.from(window.LC.StoreObserve).filter(a => a.key === key).forEach(observe => {
            if (observe.transform) { value = observe.transform(value) }
            observe.element.value = value
        })
        return result
    },
})
function ReflectNestedSet(target, keys, value) {
    if (keys.length === 1) {
        Reflect.set(target, keys, value)        
        return
    }
    return ReflectNestedSet(target[keys[0]], keys.slice(1), value)
}

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
        let ObserveSetting = {
            key: key,
            element: e,
        }

        let transform = e.dataset.transform
        if (transform) {
            ObserveSetting.transform = window.LC.StoreTransform[transform]
        }

        window.LC.StoreObserve.add(ObserveSetting)


        e.addEventListener('input', (event) => {
            Reflect.set(window.LC.StoreProxy, key, event.currentTarget.value)
        })
    })
});
