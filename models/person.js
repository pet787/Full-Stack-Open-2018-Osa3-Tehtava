const mongoose = require('mongoose')

if ( process.env.NODE_ENV !== 'production' ) {
  require('dotenv').config()
}

const url = process.env.MONGODB_URI_1

mongoose.connect(url, { useNewUrlParser: true } )

const Person = mongoose.model('Person', {
  name: String,
  number: String,
})

module.exports = Person