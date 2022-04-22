const EventEmitter = require("events");
const uuidv4 = require("uuid/v4")


class AccesToken extends EventEmitter {
    constructor(options) {
        super();
        this.type = options.type;
        this.token = options.token
        this.options = options;
        if (!this.options.create) return this.create(options)
    }

    validate(token) {

    }


    create(options) {
        let token
        switch (options.type) {
            case 1:
                token = new AccesToken({ type: "USER_ACCESS_TOKEN", token: uuidv4(), created: Date.now(), create: true })
                break;
            case 2:
                token = new AccesToken({ type: "SOCKET_ACCESS_TOKEN", token: uuidv4(), created: Date.now(), create: true })
                break;
            case 3:
                token = new AccesToken({ type: "MESSAGE_ACCESS_TOKEN", token: uuidv4(), created: Date.now(), create: true })
                break;
            default:
                break;
        }
        return token
    }
}
module.exports = AccesToken;