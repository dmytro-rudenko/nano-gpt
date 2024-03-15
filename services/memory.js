const useMemory = () => {
    const store = new Map();
    // memory based on Set
    const memory = {
        set: (key, value) => {
            store.set(key, value);
        },
        get: (key) => {
            return store.get(key);
        },
        has: (key) => {
            return store.has(key);
        },
        delete: (key) => {
            store.delete(key);
        },
        clear: () => {
            store.clear();
        },
        size: () => {
            return store.size;
        },
        keys: () => {
            return store.keys();
        },
    }

    return memory;
}

module.exports = useMemory()