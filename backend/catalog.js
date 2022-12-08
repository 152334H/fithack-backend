import {readFileSync} from 'fs'
import express from 'express'

const ITEMS = JSON.parse(readFileSync('./data.parsed.json'))

const CATEGORIES = {}
ITEMS.forEach(d => {
    const ls = CATEGORIES[d.category] ?? [];
    ls.push(d)
    CATEGORIES[d.category] = ls
})

const catalogRouter = express.Router();

catalogRouter.get('/unsorted', (_,res) => {
    res.status(200).send(ITEMS)
})
catalogRouter.get('/categorised', (_,res) => {
    res.status(200).send(CATEGORIES)
})

export default catalogRouter
