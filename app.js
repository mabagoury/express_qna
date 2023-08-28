const express = require('express');

const questions = require('./routers/questions.js');
const answers = require('./routers/answers.js');
const comments = require('./routers/comments.js');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());

app.use('/question', questions);
app.listen(PORT, () => {
    console.log(`server is now listening at port ${PORT}...`);
})