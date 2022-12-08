window.LC = window.LC || {};
window.LC.Store = window.LC.Store || {
    Username: '',
    Password: '',
};

window.LC.ProxyStore = new Proxy(window.LC.Store, {
    set(target, key, value, receiver) {
        const result = Reflect.set(target, key, value, receiver);
        return result;
    },
})

document.addEventListener('DOMContentLoaded', () => {

});
