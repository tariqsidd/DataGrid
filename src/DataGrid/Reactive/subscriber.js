import Reactive from "./";

const dataSharing = new Reactive();

// Function to subscribe to data updates
export function subscribeToData(key, callback) {
  dataSharing.addObserver(key, callback);
}

// Function to set data
export function setSubscribedData(key, value) {
  dataSharing.setData(key, value);
}

export function unsubscribe(key) {
  dataSharing.unsubscribe(key);
}

export function getSubscribedData(key) {
  return dataSharing.getData(key);
}
