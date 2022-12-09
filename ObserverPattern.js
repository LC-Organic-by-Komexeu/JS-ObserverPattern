/**
 * 使用Reflect設置目標物件的值
 * @param {object} target 
 * @param {string} keys 
 * @param {*} value 
 * @returns 
 */
function ReflectNestedSet(target, keys, value) {
    if (keys.length === 1) {
        Reflect.set(target, keys, value)        
        return
    }
    return ReflectNestedSet(target[keys[0]], keys.slice(1), value)
}

/**
 * 發送通知給觀察者
 * @param {*} keys 
 * @param {*} value 
 */
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

export {
    ReflectNestedSet,
    NotifyObserve,    
}