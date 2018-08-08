const express = require('express')
const app = express()
const bodyParser = require('body-parser')
var morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

// MIDDLEWARE
app.use(cors());
app.use(bodyParser.json())
app.use(express.static('build'));
morgan.token('body', function getBody(req) { 
  return JSON.stringify( req.body ) 
})
app.use(
  morgan(':method :url :body :status :res[content-length] - :response-time ms')
)

const formatPerson = (person) => {
  console.log('formatPerson', person)
  return {
    name: person.name,
    number: person.number,
    id: person._id
  }
}

app.get('/', (req, res) => {
  res.send('REST API: /api/persons');
})

// GET ALL
app.get('/api/persons', (req, res) => {
  Person
  .find({})
  .then(persons => {
    res.json(persons.map(formatPerson))
  })
})

// GET ONE
app.get('/api/persons/:id', (req, res) => {
  Person
  .findById(req.params.id)
  .then(person => {
    if (person) {
      res.json(formatPerson(person))
    } else {
      res.status(404).end()
    }
  })
  .catch(error => {
    console.log(error)
    res.status(400).send({ error: 'malformatted id' })
  })
})

// POST
app.post('/api/persons', (req, res) => {
  const body = req.body
  console.log(req)

  const person = new Person({
    name: body.name,
    number: body.number
  })

  if (!person.name) {
    return res.status( 400 ).json( { error: 'Name missing' } ) ;
  };
  if (!person.number) {
    return res.status( 400 ).json( { error: 'Number missing' } ); 
  };
/*   exists = persons.find(person => person.name === newPerson.name);
  if (exists) {
    return res.status( 400 ).json( { error: 'Name must be unique' } ); 
  }
 */
  person
  .save()
  .then(formatPerson)
  .then(savedAndFormattedPerson => {
    res.json(savedAndFormattedPerson)
  })
})
      
// DELETE
app.delete('/api/persons/:id', (req, res) => {
  Person
  .findByIdAndRemove(req.params.id)
  .then(result => {
    res.status(204).end()
  })
  .catch(error => {
    res.status(400).send({ error: 'malformatted id' })
  })
})

// GET INFO
app.get('/info', (req, res) => {
  res.send(info());
})

  // NOT HANDLED ROUTE
  /* const error = (req, res) => {
    res.status(404).send({error: 'unknown endpoint'})
  }

  app.use(error)
 */

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})