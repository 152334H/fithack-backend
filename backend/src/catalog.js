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

export const mostCommon = (query, limit) => {
    const ls = ITEMS.map(d => {
        const dist = compareTwoStrings(d.name, query)
        return [dist, d]
    }).sort((a,b) => b[0]-a[0])

    return ls.slice(0,limit).map(ls => ({
        similarity: ls[0],
        item: ls[1]
    }))
}

export default catalogRouter
