import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import { v1Router } from './api/v1'
import config from '../../../config'

const origin = {
  // origin: config.isProd ? 'https://example.com' : '*',
  origin: '*',
}

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors(origin))
app.use(compression())
app.use(helmet())
app.use(morgan('combined'))

app.use('/api/v1', v1Router)

app.listen(config.apiPort, () => {
  console.info(`[App]: Listening on port ${config.apiPort}`)
})
