import express from 'express'
import predict from './gpt.js'

const queryRouter = express.Router()

queryRouter.post('/classify', async (req, res) => {
    const query = req.body.query
    if (typeof query !== 'string')
        return res.status(400).send({
            error: 'query not provided'
        })
   
    const ls = await predict(query)
    if (ls[0] === 0) {
        res.status(200).send({
            variant: 'help'
        })
    } else if (ls[0] === 1) {
        res.status(200).send({
            variant: 'item',
            item: ls[1]
        })
    } else {
        res.status(400).send({
            error: `Received garbage: ${ls[1]}`
        })
    }
})

export default queryRouter
