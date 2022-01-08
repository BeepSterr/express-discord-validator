const express = require('express')
const app = express()

const discord_validator = require('express-discord-validator');

app.post('/interactions',discord_validator("YOUR_PUBLIC_KEY_HERE"), (req, res) => {

    if(req.interaction){
        // Ack's the initial ping request
        // See: https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object
        if(req.interaction.type === 1){
            return res.json({ type: 1, data: []})
        }
    }

    res.send('Invalid state!')

});