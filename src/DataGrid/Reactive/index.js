export default class Reactive {
  constructor() {
    this.dataStore = new Map();
    this.observers = new Map();
  }

  // Register an observer for a specific data key
  addObserver(key, observer) {
    if (!this.observers.has(key)) {
      this.observers.set(key, []);
    }
    this.observers.get(key).push(observer);
  }

  unsubscribe(key) {
    if (this.observers.has(key)) {
      this.observers.delete(key);
    }
  }

  // Set data and notify observers
  setData(key, value) {
    this.dataStore.set(key, value);
    this.notifyObservers(key);
  }

  // Get data for a specific key
  getData(key) {
    return this.dataStore.get(key);
  }

  // Notify all registered observers for a specific key
  notifyObservers(key) {
    const observers = this.observers.get(key);
    if (observers) {
      observers.forEach((observer) => {
        observer(this.getData(key));
      });
    }
  }
}
