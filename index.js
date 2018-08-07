const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())

let persons = [
    {
      id: 1,
      name: 'Arto Hellas',
      number: '040-123456',
    },
    {
      id: 2,
      name: 'Martti Tienari',
      number: '040-123456',
    },
    {
      id: 3,
      name: 'Arto Järvinen',
      number: '040-123456',
    },
    {
        id: 4,
        name: 'Lea Kutvonen',
        number: '040-123456',
    }
]
  
info = () => {
  let r = 'puhelinluettelossa '
    .concat(  persons.length )
    .concat( ' henkilön tiedot' )
    .concat( '<br>' )
    .concat(new Date())
  return(r);
} 

help = () => {
  let r = '/api/persons'
  .concat('<br>')
  .concat('/info');
  return (r);
}

randomBetween = ( min, max ) => {
  return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
}

app.get('/', (req, res) => {
  res.send(help());
})
      
app.get('/api/persons', (req, res) => {
  res.json(persons);
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id);
  if (person) {
    res.json(person);
  }
  else {
    res.status(404).end();
  }
})

app.post('/api/persons', (req, res) => {
  const body = req.body;
  console.log('post body', body);
  const randomId = randomBetween(100000000000, 999999999999);
  const newPerson = {
    id : randomId,
    name: body.name,
    number: body.number
  };
  if (!newPerson.name) {
    return res.status( 400 ).json( { error: 'name missing' } ) ;
  };
  if (!newPerson.number) {
    return res.status( 400 ).json( { error: 'number missing' } ); 
  };
  exists = persons.find(person => person.name === newPerson.name);
  if (exists) {
    return res.status( 400 ).json( { error: 'name must be unique' } ); 
  }
  console.log('person', newPerson);
  persons = persons.concat(newPerson);
  res.status(200).end();
})
      
app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id);
  res.status(204).end();
})

app.get('/info', (req, res) => {
  res.send(info());
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})