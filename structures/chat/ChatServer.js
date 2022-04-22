const EventEmitter = require("events");
const ChatServerState = require("./ChatServerState")
const DatabaseProvider = require("./database")
const accesToken = require("./AccessToken")
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
            console.log("Got a connection")
            const socket_data = this.sockets.find(x => x.ids.socket === socket.id)
            if (!socket_data) this.sockets.push({ ids: { socket: socket.id, acces_token: new accesToken({ type: 2 }) }, user: {}, socket: socket });
            socket.on('message_op', async data => {
                console.log(data)
                if (!data.authorization) return false
                if (!this.checkAccessToken(data.authorization)) return { error: "Nah you can't", code: 501 }
                console.log("Making msg")
                if (!data.message) {
                    data.message = {
                        id: new accesToken({ type: 2 }),
                        author: { username: data.author ? data.author.url : null, id: data.author ? data.author.id : null, username: data.author ? data.author.username : null },
                        content: data.content,
                        timestamp: Date.now(),
                        targetUser: data.targetUser ? data.targetUser : null,
                        reached: false
                    }
                }
                socket.broadcast.emit('message', data.message)
                    // this.database.req({ op: 'action', id: 3, content: data.message, group: this.database.group })
                    //  this.cache.stats.addMessage(data.message)
                return data.message
            });
            socket.on("disconnect", () => {
                this.sockets = this.sockets.filter(s => s.ids.socket !== socket.id);
            });
        });

        this.state = ChatServerState.CONNECTING;
        this.database = new DatabaseProvider({
            group: 1,
            provider: "enmap"
        })
        this._launch()

    }

    async _launch() {
        // const db = await this.database.start()
        //if (!db) return false
        this.state = ChatServerState.RUNNING
    }

    async checkAccessToken() {
        return true
    }

    async sendMessage(data) {

    }
}
module.exports = ChatServer;
module.exports.default = ChatServer