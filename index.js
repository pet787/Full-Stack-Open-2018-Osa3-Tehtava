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

// ROOT
app.get('/', (req, res) => {
  res.send('REST API: /api/persons');
})

// GET ALL
app.get('/api/persons', (req, res) => {
  console.log( 'app.get all' )
  Person
  .find({})
  .then(persons => {
    res.json(persons.map(person => person))
    //res.json(persons.map(Person.format)) <-- TÄSSÄ 3.14
  })
  .catch(error => {
    console.log(error)
    res.status(400).send({ error: 'app.get all' })
  })
})

// GET ONE
app.get('/api/persons/:id', (req, res) => {
  console.log( 'app.get', req.params.id )
  Person
  .findById(req.params.id)
  .then(person => {
    if (person) {
      res.json(person)
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

  const person = new Person({
    name: body.name,
    number: body.number
  })
  console.log( 'app.post', person )
  if (!person.name) {
    return res.status( 400 ).json( { error: 'Name missing' } ) ;
  };
  if (!person.number) {
    return res.status( 400 ).json( { error: 'Number missing' } ); 
  };
  Person
  .findOne( {name : person.name } )
  .then(personExists => {
    if (personExists) {     
      // Name already exists 
      return res.status( 400 ).json( { error: 'Name exists, name must be unique' } ); 
    }
    else {
      // Add new person
      person
      .save()
      .then(newPerson => {
        res.json(newPerson)
      })
    }
  })
  .catch(error => {
    console.log(error)
    res.status(400).send({ error: 'app.post' })
  })
})
      
// PUT
app.put('/api/persons/:id', (req, res) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number
  }
  console.log('app.put', req.params.id, person)
  Person
  .findByIdAndUpdate(req.params.id, person, { new: true } )
  .then(person => {
    res.json(person)
  })
  .catch(error => {
    res.status(400).send({ error: 'malformatted id' })
  })
})

// DELETE
app.delete('/api/persons/:id', (req, res) => {
  console.log( 'app.delete', req.params.id )
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
  Person
  .find({})
  .then(persons => {
    res.status(200).send(
      'Puhelinluettelossa ' + persons.length + ' henkilön tiedot'
    );
  })
  .catch(error => {
    res.status(400).send({ error: 'app.get info find' })
  })
})

// NOT HANDLED ROUTE
const error = (req, res) => {
    res.status(404).send({error: 'unknown endpoint'})
}

app.use(error)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})