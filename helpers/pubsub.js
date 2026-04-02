// Super small event bus
const events = {};

export function subscribe(eventName, callback) {
  if (!events[eventName]) {
    events[eventName] = []; // create array for new eventName if !eventName
  }
  events[eventName].push(callback); // add callback

  // console.log(`Subscribed to ${eventName}`);

  return () => {
    events[eventName] = events[eventName].filter(cb => cb !== callback);
  };
}

export function publish(eventName, data = {}) {
  if (!events[eventName]) return;
  events[eventName].forEach((callback) => callback(data)); // execute callback with data
}



