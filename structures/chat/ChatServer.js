const EventEmitter = require("events");
const ChatServerState = require("./ChatServerState")
const DatabaseProvider = require("./database")
const uuidv4 = require("uuid/v4")

const ChatCache = require("./ChatCache")

class ChatServer extends EventEmitter {
    constructor(options) {
        super();
        this.options = options;
        this.sockets = [];
        this.cache = new ChatCache({
            timeout: 1000 * 60 * 12
        })
        this.socketio = options.socketClient;
        this.socketio.on('connection', (socket) => {
            if (!this.sockets.find(x => x.id === socket.id)) this.sockets.push({ id: socket.id, socket: socket });
            socket.on('message_op', data => {
                if (!data.message) {
                    data.message = {
                        id: uuidv4(),
                        author: { username: data.author.url, id: data.author.id, username: data.author.username },
                        content: data.content,
                        timestamp: Date.now(),
                        targetUser: data.targetUser
                    }
                }
                this.cache.stats.addMessage(data.message)
                this.socketio.broadcast.emit('message', data.message);
            });
            socket.on("disconnect", () => {
                this.sockets = this.sockets.filter(s => s.id !== socket.id);
            });
        });

        this.state = ChatServerState.CONNECTING;
        this.database = new DatabaseProvider(options.provider)
        this._launch()

    }

    async _launch() {
        const db = await this.database.start()
        if (!db) return false
        this.state = ChatServerState.RUNNING
    }

    async sendMessage(data) {

    }
}
module.exports = ChatServer;
module.exports.default = ChatServer