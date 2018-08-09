const mongoose = require('mongoose');
require('dotenv').config();

const url = process.env.MONGODB_URI_1;

mongoose.connect(url, { useNewUrlParser: true } );

const Person = mongoose.model('Person', {
  name: String,
  number: String
});

const person = new Person({
  name: '',
  number: ''
});

const main = () => {

  process.argv.forEach((val, index) => {
    if (index === 2) person.name = val;
    if (index === 3) person.number = val;
  });

  if (person.name && person.number) {
    person
      .save()
      .then(response => {
        console.log( 'lisätään henkilö ' + person.name + ' numero ' + person.number + ' luetteloon' );
        mongoose.connection.close();
      });
  }
  else if (!person.name && !person.number) {
    console.log('Puhelinluettelo:');
    Person
      .find({})
      .then(result => {
        result.forEach(person => {
          console.log(person.name, person.number);
        });
        mongoose.connection.close();
      });
  }
  else {
    mongoose.connection.close();
  }

};

main();