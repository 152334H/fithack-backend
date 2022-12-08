import {readFileSync} from 'fs'
import express from 'express'
import {compareTwoStrings} from 'string-similarity'

const ITEMS = JSON.parse(readFileSync('./data.parsed.json'))
/*
  {
    "name": "apple",
    "id": "ffa137",
    "category": "produce",
    "price": 0.72,
    "image": "ffa137.jpeg"
  }
*/

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
catalogRouter.post('/most_common', (req,res) => {
    const query = req.body.query;
    const limit = req.body.limit ?? 10;
    if (typeof query !== 'string') 
        return res.status(400).send({
            error: 'query was missing'
        })
    if (typeof limit !== 'number')
        return res.status(400).send({
            error: 'limit was not a number'
        })
    
    const ls = ITEMS.map(d => {
        const dist = compareTwoStrings(d.name, query)
        return [dist, d.id]
    }).sort((a,b) => b[0]-a[0])

    return res.status(200).send({
        items: ls.slice(0,limit).map(ls => ({
            similarity: ls[0],
            id: ls[1]
        }))
    })
})

export default catalogRouter
