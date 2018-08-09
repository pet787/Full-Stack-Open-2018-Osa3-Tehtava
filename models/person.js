const mongoose = require('mongoose')

if ( process.env.NODE_ENV !== 'production' ) {
  require('dotenv').config()
}

const url = process.env.MONGODB_URI_1

mongoose.connect(url, { useNewUrlParser: true } )

const personSchema = new mongoose.Schema({
    name: { type: String, unique : true } ,
    number: String,
})

// 3.14 Pyydetty vastaus
personSchema.statics.format = function(person) {
    return { 
        name: person.name, 
        number : person.number,
        id : person._id
    }
}

// 3.14 Vaihtoehto ratkaisu
personSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
}); 

const Person = mongoose.model('Person', personSchema )

module.exports = Person