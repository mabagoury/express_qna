const express = require('express');
const {body, matchedData, validationResult, query, param} = require('express-validator')
const db = require('../models/index.js');
const Question = db['Question'];

const questions = express.Router();

questions.get('/', async (req, res) => {
    // TODO: Add author data
    let allQuestions = await Question.findAll();
    res.send(allQuestions);
});

questions.get('/:id',
    param('id').isInt({ gt: 0 }),
    async (req, res) => {
        let result = validationResult(req);
        if (result.isEmpty()) {
            let data = matchedData(req);
            // TODO: Add author data
            let question = await Question.findByPk(data.id);
            if (question)
                res.send(question);
            else
                // Seems that the Sequelize promise resolves to null
                // So, res.send(null) would just send an empty string
                res.status(404).send();

        } else {
            res.status(400).send({errors: result.array()});
        }
    }
);

questions.post('/add/',
    body('title').isString().notEmpty().escape(),
    body('content').isString().notEmpty().escape(),
    async(req, res) => {
        const result = validationResult(req);
        if (result.isEmpty()) {
            const data = matchedData(req);
            let question = await Question.create({
                title: data.title,
                authorId: 1 // TODO: implement sessions
            });
            res.send({id: question.id});
        } else {
            res.status(400).send({errors: result.array()});
        }
    }
);

questions.delete('/:id/delete/',
    param('id').isInt({ gt: 0 }),
    async(req, res) => {
        const result = validationResult(req);
        if (result.isEmpty()){
            const data = matchedData(req);
            // TODO: Handle cascaded deletion
            let questionsDeletedCount = await Question.destroy({ where: { id: data.id}});
            questionsDeletedCount ?
                res.send({'id': data.id}) :
                res.status(404).send({"error": "QUESTION_NOT_FOUND"});


        } else {
            res.status(400).send({errors: result.array()});
        }
    }
);

questions.get('/:id/comment/',
    param('id').isInt({ gt: 0 }),
    async (req, res) => {
        let result = validationResult(req);
        if(result.isEmpty()) {
            let data = matchedData(req);
            let question = await Question.findByPk(data.id, {
                include: db['Comment']
            });
            question ?
                res.send(question.Comments) : // TODO: returns both questionId and answerId. Fix this to send only a postId.
                res.status(404).send({"error": "QUESTION_NOT_FOUND"});

        } else {
            res.status(400).send({errors: result.array()});
        }
});

questions.get('/:id/comment/add/',
    param('id').isInt({ gt: 0 }),
    body('content').isString().notEmpty().escape(),
    async (req, res) => {
    let result = validationResult(req);
    if(result.isEmpty()){
        let data = matchedData(req);
        let question = await Question.findByPk(data.id);
        if(question){
            let comment = await db['Comment'].create({
                content: data.content,
                authorId: 1, // TODO: add sessions
                questionId: data.id
            });
            res.send({ id: comment.id });
        } else {
            res.status(404).send({"error": "QUESTION_NOT_FOUND"});
        }
    } else {
        res.status(400).send({errors: result.array()});
    }
});

questions.get('/:id/answer/',
    param('id').isInt({ gt: 0 }),
    async (req, res) => {
        let result = validationResult(req);
        if(result.isEmpty()) {
            let data = matchedData(req);
            let question = await Question.findByPk(data.id, {
                include: db['Answer']
            });
            question ?
                res.send(question.Answers) :
                res.status(404).send({"error": "QUESTION_NOT_FOUND"});

        } else {
            res.status(400).send({errors: result.array()});
        }
});

questions.get('/:id/answer/add/',
    param('id').isInt({ gt: 0 }),
    body('content').isString().notEmpty().escape(),
    async (req, res) => {
        let result = validationResult(req);
        if(result.isEmpty()){
            let data = matchedData(req);
            let question = await Question.findByPk(data.id);
            if(question){
                let answer = await db['Answer'].create({
                    content: data.content,
                    authorId: 1, // TODO: add sessions
                    questionId: data.id
                });
                res.send({ id: answer.id });
            } else {
                res.status(404).send({"error": "QUESTION_NOT_FOUND"});
            }
        } else {
            res.status(400).send({errors: result.array()});
        }
});

questions.post('/:id/upvote/',
    param('id').isInt({ gt: 0 }),
    async (req, res) => {
        let result = validationResult(req);
        if(result.isEmpty()){
            let data = matchedData(req);
            let question = await Question.findByPk(data.id);
            if(question){
                // TODO: Add sessions
                let upvoter = await db['User'].findByPk(1);
                // TODO: adding the same upvoter to the same question is redundant in db.
                //  While this is desired, why is it happening by default?
                //  The Sequleize insert query is just a regular one.
                await question.addUpvoter(upvoter);
                res.send({"id": question.id});
            } else {
                res.status(404).send({"error": "QUESTION_NOT_FOUND"});
            }
        } else {
            res.status(400).send({errors: result.array()});
        }
});

questions.post('/:id/upvote/undo/',
    param('id').isInt({ gt: 0 }),
    async (req, res) => {
        let result = validationResult(req);
        if(result.isEmpty()){
            let data = matchedData(req);
            let question = await Question.findByPk(data.id);
            if(question){
                // TODO: Add sessions
                let upvoter = await db['User'].findByPk(1);
                // TODO: removing an upvoter that didn't upvote just goes silently and returns 200 OK.
                //  Is this typical? Shouldn't we return an error or another 2XX?
                await question.removeUpvoter(upvoter);
                res.send({"id": question.id});
            } else {
                res.status(404).send({"error": "QUESTION_NOT_FOUND"});
            }
        } else {
            res.status(400).send({errors: result.array()});
        }
});

questions.post('/:id/downvote/',
    param('id').isInt({ gt: 0 }),
    async (req, res) => {
        let result = validationResult(req);
        if(result.isEmpty()){
            let data = matchedData(req);
            let question = await Question.findByPk(data.id);
            if(question){
                // TODO: Add sessions
                let downvoter = await db['User'].findByPk(1);
                await question.addDownvoter(downvoter);
                res.send({"id": question.id});
            } else {
                res.status(404).send({"error": "QUESTION_NOT_FOUND"});
            }
        } else {
            res.status(400).send({errors: result.array()});
        }
    });

questions.post('/:id/downvote/undo/',
    param('id').isInt({ gt: 0 }),
    async (req, res) => {
        let result = validationResult(req);
        if(result.isEmpty()){
            let data = matchedData(req);
            let question = await Question.findByPk(data.id);
            if(question){
                // TODO: Add sessions
                let downvoter = await db['User'].findByPk(1);
                await question.removeDownvoter(downvoter);
                res.send({"id": question.id});
            } else {
                res.status(404).send({"error": "QUESTION_NOT_FOUND"});
            }
        } else {
            res.status(400).send({errors: result.array()});
        }
    });

module.exports = questions;