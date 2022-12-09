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
function ReflectNestedSet(target, keys, value) {
    if (keys.length === 1) {
        Reflect.set(target, keys, value)        
        return
    }
    return ReflectNestedSet(target[keys[0]], keys.slice(1), value)
}
function NotifyObserve(keys, value) {
    let ObserveArr = Array.from(window.LC.StoreObserve)
    if (keys) { 
        ObserveArr = ObserveArr.filter(a => keys.includes(a.key))
    }
    else{
        keys = ObserveArr.map(a => a.key)
    }

    keys.forEach(key => {
        ObserveArr.filter(a => a.key === key).forEach(observe => {
            let valueClone = (' ' + (value || '')).slice(1);
            if (valueClone === '') {                 
                valueClone = FindNestedValueByProperty(window.LC.Store, key)
            }
            if(valueClone){
                if (observe.transform) { valueClone = observe.transform(valueClone) }
                observe.element.value = valueClone
            }
        })
    })    
}
function FindNestedValueByProperty (target, prop) {
    let result
    let keys = Object.keys(target)
    for(let i = 0; i < keys.length; i++){
        if(typeof target[keys[i]] === 'object' && prop.split('.')[0] == keys[i]){
            return FindNestedValueByProperty(target[keys[i]], prop.split('.').slice(1).join('.'))
        }
        if(keys[i] === prop){
            result = target[keys[i]]
            break            
        }
    }
    
    return result  
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


        let domEventDict = DomEvent[e.nodeName]
        if (domEventDict) {
            e.addEventListener(domEventDict.EventType, domEventDict.Callback.bind(null, key))
        }        
    })

    NotifyObserve()
});

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
