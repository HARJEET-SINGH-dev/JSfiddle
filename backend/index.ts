import express from 'express'
import redis, { createClient, RedisSentinel } from 'redis'
import { prisma } from './db';

const client = createClient();
client.connect();

const app = express()

app.use(express.json());

app.post('/submission',async (req, res) => {
    const userId = req.body.userId;
    const code = req.body.code;
    const questionId = req.body.questionId;
    const language = req.body.language;

    const response = await prisma.submission.create({
        data: {
            language,
            code,
            status : "Processing"
        }
    })
    client.lPush("problems", JSON.stringify({submissionId : response.id , code, language}));

    res.json({
        'message' : 'processing',
    })
})

app.get('/submission/:submissionId', (req, res) => {

})



app.listen(3000);