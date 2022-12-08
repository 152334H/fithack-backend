import express from 'express'
import catalogRouter from './catalog.js'
import queryRouter from './query.js'
import cors from 'cors'

const app = express()

app.use(express.json())
app.use(cors())
app.use((req, _, nxt) => {
	console.log(new Date().toUTCString())
	console.log(req.method)
	console.log(req.path)
	console.log(req.body)
	console.log('---')
	nxt()
})

app.use('/listing', catalogRouter)
app.use('/gpt', queryRouter)

app.get('/', (_, res) => {
  res.send('Hello World')
})

export default app;
