const express = require('express');

const db = require('./data/dbConfig.js');

const server = express();

server.use(express.json());

// middleware



server.get('/accounts', (req, res)=>{
    db.select('*').from('accounts')
    .then(response => {
        res.status(200).json(response)
    })
    .catch(error => {
        res.json(error)
    })
})

server.get('/accounts/:id', (req, res)=>{
    db.select('*').from('accounts').where('id', `${req.params.id}`).first()
    .then(response => {
        res.status(200).json(response)
    })
    .catch(error => {
        res.json(error)
    })
})



module.exports = server;