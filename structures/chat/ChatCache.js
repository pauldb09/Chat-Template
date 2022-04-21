const EventEmitter = require("events");

class ChatCache extends EventEmitter {
    constructor(options) {
        super();
        this.options = options;

    }
}
module.exports = ChatCache;