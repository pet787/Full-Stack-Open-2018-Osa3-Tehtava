const express = require('express')
const app = express()

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
    .concat('<br>')
    .concat(new Date())
  return(r);
} 

help = () => {
  let r = '/api/persons'
  .concat('<br>')
  .concat('/info');
  return (r);
}

app.get('/', (req, res) => {
  res.send(help());
})
      
app.get('/api/persons', (req, res) => {
  res.json(persons);
})
      
app.get('/info', (req, res) => {
  res.send(info());
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})