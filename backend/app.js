import express from 'express'
import predict from './gpt.js'
import catalogRouter from './catalog.js'
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


app.post('/_test', async (req, res) => {
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

app.use('/listing', catalogRouter)

app.get('/', (_, res) => {
  res.send('Hello World')
})

export default app;
