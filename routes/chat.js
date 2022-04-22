const { Router } = require('express');
module.exports.Router = class Home extends Router {
    constructor() {
        super();
        this.get('/', async function(req, res) {
            res.status(200).render("chat.ejs", {
                title: "Chat",
                user: {
                    access_token: 'yep'
                }
            })
        });

        this.post('/', async function(req, res) {
            console.log(req.body);
        });
    }
};

module.exports.name = '/chat';