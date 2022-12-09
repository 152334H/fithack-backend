import express from 'express'
import catalogRouter from './catalog.js'
import queryRouter from './query.js'
import cors from 'cors'
import whisperRouter from './whisper.js'

const app = express()

app.use(express.json({limit: '50mb'}))
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
app.use('/whisper', whisperRouter)

app.get('/', (_, res) => {
  res.send('Hello World')
})

export default app;
