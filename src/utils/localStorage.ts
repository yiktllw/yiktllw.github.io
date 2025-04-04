const DefaultStorage = {
  theme: "dark" as "dark" | "light",
} as const;

type IStorage = typeof DefaultStorage;

function setStorage<K extends keyof IStorage>(key: K, value: IStorage[K]) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getStorage<K extends keyof IStorage>(key: K): IStorage[K] | null {
  const value = localStorage.getItem(key);
  if (value) {
    return JSON.parse(value) as (typeof DefaultStorage)[K];
  }
  return null;
}

function getStorageOrDefault<K extends keyof IStorage>(key: K): IStorage[K] {
  const value = getStorage(key);
  if (value) {
    return value;
  }
  return DefaultStorage[key];
}

function resetStorage() {
  Object.keys(DefaultStorage).forEach((key) => {
    localStorage.removeItem(key);
  });
}

const Storage = {
  get: getStorage,
  getOrDefault: getStorageOrDefault,
  set: setStorage,
  reset: resetStorage,
};

export default Storage;
