const express = require('express');
const {body, matchedData, validationResult, query, param} = require('express-validator')
const db = require('../models/index.js');
const Answer = db['Answer'];

const answers = express.Router();

answers.delete('/:id/delete/',
    param('id').isInt({ gt: 0 }),
    async(req, res) => {
        const result = validationResult(req);
        if (result.isEmpty()){
            const data = matchedData(req);
            // TODO: Handle cascaded deletion
            let answersDeletedCount = await Answer.destroy({ where: { id: data.id}});
            answersDeletedCount ?
                res.send({'id': data.id}) :
                res.status(404).send({"error": "QUESTION_NOT_FOUND"});


        } else {
            res.status(400).send({errors: result.array()});
        }
    }
);

answers.get('/:id/comment/',
    param('id').isInt({ gt: 0 }),
    async (req, res) => {
        let result = validationResult(req);
        if(result.isEmpty()) {
            let data = matchedData(req);
            let answer = await Answer.findByPk(data.id, {
                include: db['Comment']
            });
            answer ?
                res.send(answer.Comments) : // TODO: returns both answerId and answerId. Fix this to send only a postId.
                res.status(404).send({"error": "QUESTION_NOT_FOUND"});

        } else {
            res.status(400).send({errors: result.array()});
        }
    });

answers.get('/:id/comment/add/',
    param('id').isInt({ gt: 0 }),
    body('content').isString().notEmpty().escape(),
    async (req, res) => {
        let result = validationResult(req);
        if(result.isEmpty()){
            let data = matchedData(req);
            let answer = await Answer.findByPk(data.id);
            if(answer){
                let comment = await db['Comment'].create({
                    content: data.content,
                    authorId: 1, // TODO: add sessions
                    answerId: data.id
                });
                res.send({ id: comment.id });
            } else {
                res.status(404).send({"error": "QUESTION_NOT_FOUND"});
            }
        } else {
            res.status(400).send({errors: result.array()});
        }
    });

answers.post('/:id/accept/',
    param('id').isInt({ gt: 0 }),
    async (req, res) => {
        let result = validationResult(req);
        if(result.isEmpty()){
            let data = matchedData(req);
            let answer = await Answer.findByPk(data.id);
            if(answer){
                // TODO: Add sessions
                let upvoter = await db['User'].findByPk(1);
                // TODO: adding the same upvoter to the same answer is redundant in db.
                //  While this is desired, why is it happening by default?
                //  The Sequleize insert query is just a regular one.
                await answer.addUpvoter(upvoter);
                res.send({"id": answer.id});
            } else {
                res.status(404).send({"error": "QUESTION_NOT_FOUND"});
            }
        } else {
            res.status(400).send({errors: result.array()});
        }
    });

answers.post('/:id/upvote/',
    param('id').isInt({ gt: 0 }),
    async (req, res) => {
        let result = validationResult(req);
        if(result.isEmpty()){
            let data = matchedData(req);
            let answer = await Answer.findByPk(data.id);
            if(answer){
                // TODO: Add sessions
                let upvoter = await db['User'].findByPk(1);
                // TODO: adding the same upvoter to the same answer is redundant in db.
                //  While this is desired, why is it happening by default?
                //  The Sequleize insert query is just a regular one.
                await answer.addUpvoter(upvoter);
                res.send({"id": answer.id});
            } else {
                res.status(404).send({"error": "QUESTION_NOT_FOUND"});
            }
        } else {
            res.status(400).send({errors: result.array()});
        }
    });

answers.post('/:id/upvote/undo/',
    param('id').isInt({ gt: 0 }),
    async (req, res) => {
        let result = validationResult(req);
        if(result.isEmpty()){
            let data = matchedData(req);
            let answer = await Answer.findByPk(data.id);
            if(answer){
                // TODO: Add sessions
                let upvoter = await db['User'].findByPk(1);
                // TODO: removing an upvoter that didn't upvote just goes silently and returns 200 OK.
                //  Is this typical? Shouldn't we return an error or another 2XX?
                await answer.removeUpvoter(upvoter);
                res.send({"id": answer.id});
            } else {
                res.status(404).send({"error": "QUESTION_NOT_FOUND"});
            }
        } else {
            res.status(400).send({errors: result.array()});
        }
    });

answers.post('/:id/downvote/',
    param('id').isInt({ gt: 0 }),
    async (req, res) => {
        let result = validationResult(req);
        if(result.isEmpty()){
            let data = matchedData(req);
            let answer = await Answer.findByPk(data.id);
            if(answer){
                // TODO: Add sessions
                let downvoter = await db['User'].findByPk(1);
                await answer.addDownvoter(downvoter);
                res.send({"id": answer.id});
            } else {
                res.status(404).send({"error": "QUESTION_NOT_FOUND"});
            }
        } else {
            res.status(400).send({errors: result.array()});
        }
    });

answers.post('/:id/downvote/undo/',
    param('id').isInt({ gt: 0 }),
    async (req, res) => {
        let result = validationResult(req);
        if(result.isEmpty()){
            let data = matchedData(req);
            let answer = await Answer.findByPk(data.id);
            if(answer){
                // TODO: Add sessions
                let downvoter = await db['User'].findByPk(1);
                await answer.removeDownvoter(downvoter);
                res.send({"id": answer.id});
            } else {
                res.status(404).send({"error": "QUESTION_NOT_FOUND"});
            }
        } else {
            res.status(400).send({errors: result.array()});
        }
    });

module.exports = answers;