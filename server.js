const express = require('express');

const db = require('./data/dbConfig.js');

const server = express();

server.use(express.json());

// middleware
function validateId(req, res, next){
    db.select('*').from('accounts').where('id', `${req.params.id}`).first()
    .then(response => {
        if (response){
            req.data = response;
            next();
        } else {
            res.status(404).json({message: 'No record found with that ID'})
        }
    })
    .catch(error => {
        res.status(500).json({message: 'Error looking up ID'})
    })
}


function validateAccount(req, res, next){
    const account = req.body;
    if (!account.name){
        res.status(400).json({message: 'Account is missing required name field'}).end();
    }
    else if (!account.budget){
        res.status(400).json({message: 'Account is missing required budget field'}).end();
    }
    else if (typeof account.name != 'string'){
        res.status(400).json({message: 'Account name must be a string'}).end();
    }
    else if (typeof account.budget != 'number'){
        res.status(400).json({message: 'Budget must be of a number'}).end();
    }
    next();
}

function validateUniqueName(req, res, next){
    db.select('*').from('accounts').where('name', `${req.body.name}`).first()
    .then(response => {
        if (response){
            res.status(400).json({message: 'An account with that name already exists'}).end();
        } else {
            next()
        }
    })
    .catch(error => {
        res.status(500).json({message: 'Error looking up name'})
    })
}

server.get('/accounts/', (req, res)=>{
    db.select('*').from('accounts')
    .then(response => {
        res.status(200).json(response)
    })
    .catch(error => {
        res.json(error)
    })
})

server.get('/accounts/:id', validateId, (req, res)=>{
    res.status(200).json(req.data);
})

server.post('/accounts/', validateAccount, validateUniqueName, (req, res)=>{
    db('accounts').insert(req.body, 'id')
    .then(([id]) => {
        db('accounts').where({ id })
        .then(response => {
            res.status(200).json(response).first();
        })
        .catch(err => { res.json(err)})
    })
    .catch(err => { res.json(err)})
})

server.delete('/accounts/:id', validateId, (req, res)=>{
    db('accounts').where({id: req.params.id}).del()
    .then(count => {
        res.status(200).json({message: `deleted ${count} record(s)`})
    })
    .catch(err => { res.json(err)})
})



module.exports = server;