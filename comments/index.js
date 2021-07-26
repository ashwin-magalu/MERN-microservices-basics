const express = require('express')
const cors = require('cors')
const { randomBytes } = require('crypto')
const bodyParser = require('body-parser')
const axios = require('axios')

const app = express()

app.use(cors({
    origin: "*"
}))
app.use(bodyParser.json())

const commentsByPostId = {}

app.get('/posts/:id/comments', (req, res) => {
    res.status(200).send(commentsByPostId[req.params.id] || [])
})

app.post('/posts/:id/comments', async (req, res) => {
    const commentId = randomBytes(4).toString('hex')
    const { content } = req.body

    const comments = commentsByPostId[req.params.id] || []

    comments.push({ id: commentId, content, status: "pending" })

    commentsByPostId[req.params.id] = comments

    await axios.post("http://localhost:4005/events", {
        type: "CommentCreated",
        data: { id: commentId, content, postId: req.params.id, status: "pending" }
    })

    res.status(201).send(comments)
})

app.post("/events", async (req, res) => {
    /* events coming from event bus */
    const { type, data } = req.body
    if (type === "CommentModerated") {
        const { postId, status, id, content } = data
        const comments = commentsByPostId[postId]

        const comment = comments.find(comment => comment.id === id)
        comment.status = status

        await axios.post("http://localhost:4005/events", {
            type: "CommentUpdated",
            data: { id, content, status, postId }
        })
    }
    res.send({})
})

app.listen(4001, () => console.log("Listening on port 4001"))