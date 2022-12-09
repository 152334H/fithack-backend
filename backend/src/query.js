import express from 'express'
import predict from './gpt.js'
import searchHelp from './qna.js'
import {mostCommon} from './catalog.js'

const queryRouter = express.Router()

queryRouter.post('/classify', async (req, res) => {
    const limit = req.body.limit ?? 5;
    const query = req.body.query
    if (typeof query !== 'string')
        return res.status(400).send({
            error: 'query not provided'
        })
    if (typeof limit !== 'number')
        return res.status(400).send({
            error: 'limit was not a number'
        })
   
    const ls = await predict(query)
    if (ls[0] === 0) {
        res.status(200).send({
            variant: 'help',
            qna: searchHelp(ls[1])
        })
    } else if (ls[0] === 1) {
        res.status(200).send({
            variant: 'item',
            focus: ls[1],
            relatedItems: mostCommon(ls[1], limit)
        })
    } else {
        res.status(400).send({
            error: `Received garbage: ${ls[1]}`
        })
    }
})

export default queryRouter
