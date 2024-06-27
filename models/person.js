const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI
console.log('Connecting to', url)

mongoose.connect(url)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,

  },
  number: {
    type: String,
    validate: {
      validator: (v) => {
        return /\d{2,3}-\d{5,}/.test(v) // REGEX: /Ennen viivaa 2 tai 3 numeroa (\d{2,3}), viivan jälkeen(\d{5,}) vähintään 5 numeroa.
      },
      message: props => `${props.value} is not a valid number!`
    },
    required: [true, 'Number is required']
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)