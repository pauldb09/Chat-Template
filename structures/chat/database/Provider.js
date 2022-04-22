const EventEmitter = require("events");
const EnmapProvider = require("./enmap/index.js");
const ServerError = require("../../ServerError");

class Provider extends EventEmitter {
    constructor(options) {
        super();
        this.group = options.group ? options.group : "default";
        this.provider = this.resolveProvider(options ? options.provider : "enmap");
    }

    async start() {
        const op = await this.provider.sendOp({ op: 'action', id: 1, group: this.options.group })
        return op
    }

    async req(data) {
        return await this.provider.sendOp(data)
    }

    resolveProvider(provider) {
        if (typeof(provider) === "object") return new provider
        if (provider.includes("enmap")) return new EnmapProvider(provider)
        if (provider.includes("sql")) return new SqlProvider(provider)
        if (provider.includes("mongodb")) return new MongosProvider(provider)
        return new ServerError("Unknown provider for chat server")
    }
}

module.exports = Provider