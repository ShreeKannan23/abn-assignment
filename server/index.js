/* eslint-disable no-undef */
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(path.join(import.meta.url, '..')))
console.log(__dirname)
const port = process.env.PORT || 3000
const app = express()

app.use(cors())

app.get('/api/graphData', (_req, res) => {
  res.json({
    data: [
      {
        name: 'A',
        description: 'This is a description of A',
        parent: ''
      },
      {
        name: 'B',
        description: 'This is a description of B',
        parent: 'A'
      },
      {
        name: 'C',
        description: 'This is a description of C',
        parent: 'A'
      },
      {
        name: 'D',
        description: 'This is a description of D',
        parent: 'A'
      },
      {
        name: 'B-1',
        description: 'This is a description of B-1',
        parent: 'B'
      },
      {
        name: 'B-2',
        description: 'This is a description of B-2',
        parent: 'B'
      },
      {
        name: 'B-3',
        description: 'This is a description of B-3',
        parent: 'B'
      }
    ]
  })
})

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log('Server listening on port', port)
})
