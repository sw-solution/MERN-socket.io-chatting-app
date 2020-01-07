const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const router = express.Router();

const keys = require('../../config/keys');
const verify = require('../../utilities/verify-token');
const Message = require('../../models/Message');
const Conversation = require('../../models/Conversation');
const GlobalMessage = require('../../models/GlobalMessage');

let jwtUser = null;

// Token verfication middleware
router.use(function(req, res, next) {
    try {
        jwtUser = jwt.verify(verify(req), keys.secretOrKey);
        next();
    } catch (err) {
        console.log(err);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Unauthorized' }));
        res.sendStatus(401);
    }
});

// update the block field
router.post('/updateBlock', (req, res) => {
    const _id = req.body._id
    Conversation.findOne({ _id }).then(conversation => {
        // Check if conversation exists
        if (!conversation) {
            return res
                .status(404)
                .json({ conversationnotfound: 'Conversation not found' });
        }
        //Update the block field
        let blocked;
        if(conversation.blocked === '')
            blocked = req.body.currentUserId
        else if(conversation.blocked === req.body.currentUserId)
            blocked = ''
        else
            blocked = conversation.blocked
            

        const item = {
            blocked: blocked
        }
        conversation.updateOne({$set:item}, function(err, result){
            if (err) throw err;
            else {
                console.log('update success');
                return res
                    .status(200)
                    .json({success: 'update success', blocked: blocked})
            }
        })        
    });
});

module.exports = router;