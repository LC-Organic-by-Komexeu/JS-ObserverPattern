import {ReflectNestedSet, NotifyObserve } from './ObserverPattern.js'

window.LC = window.LC || {};
window.LC.Store = window.LC.Store || {
    Username: '賣靠北',
    Password: '1234',
    Info: {
        Tel: 3345678,
        Email: 'rayhuang@test.cc',
        City: 'Kaohsiung',
        Address: 'aaaa'
    },
};
window.LC.StoreObserve = new Set();
window.LC.StoreProxy = new Proxy(window.LC.Store, {
    set(target, key, value, receiver) {
        const result = ReflectNestedSet(target, key.split('.'), value)
        NotifyObserve([key], value)
        return result
    }
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
        let ObserveSetting = {
            key: key,
            element: e,
        }

        let transform = e.dataset.transform
        if (transform) {
            ObserveSetting.transform = window.LC.StoreTransform[transform]
        }

        window.LC.StoreObserve.add(ObserveSetting)


        let domEventDict = DomEvent[e.nodeName]
        if (domEventDict) {
            e.addEventListener(domEventDict.EventType, domEventDict.Callback.bind(null, key))
        }        
    })

    NotifyObserve()
});


/**
 * 定義事件類型與回調（策略模式）
 */
let DomEvent = {
    INPUT: {
        EventType: 'input',
        Callback: function (key, event) {
            Reflect.set(window.LC.StoreProxy, key, event.currentTarget.value)
        }
    },
    TEXTAREA: {
        EventType: 'input',
        Callback: function (key, event) {
            Reflect.set(window.LC.StoreProxy, key, event.currentTarget.value)
        }
    },
    SELECT: {
        EventType: 'change',
        Callback: function (key, event) {
            Reflect.set(window.LC.StoreProxy, key, event.currentTarget.value)
        }
    },
}
