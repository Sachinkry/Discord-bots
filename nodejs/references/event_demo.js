const EventEmitter = require("events");

// create class
class Emitter extends EventEmitter{}

// init object
const myEmitter = new Emitter();

// event listener
myEmitter.on('event', () => console.log("Event emitted..."))

myEmitter.emit('event');
myEmitter.emit('event');
myEmitter.emit('event');
myEmitter.emit('event');