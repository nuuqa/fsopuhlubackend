require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()
const PORT = process.env.PORT

morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
app.use(express.static('dist'))


//.../api/info
app.get('/api/info', (request, response) => {
  const time = new Date()
  Person.countDocuments({})
    .then(count => {
      response.send(
        `<div><p>Phonebook has info for ${count} people</p> <br><p>${time}</p></div>`
      )
    })
})

// .../api/persons
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

// .../api/persons/id
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if(person){
        response.json(person)
      }
      else{
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// .../api/persons/id -> delete
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// .../api/persons/ -> add
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if(!body.name){
    return response.status(400).json({
      error: 'Name is missing'
    })
  }
  if(!body.number){
    return response.status(400).json({
      error: 'Number is missing'
    })
  }
  // if(checkName(body.name) === true){
  //     return response.status(400).json({
  //         error:'Name must be unique'
  //     })
  // }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
    .catch(error => next(error))
})

// .../api/persons/ --> update
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  // HUOM, tässä pitää tehdä ns. "normaali" olio, koska findByIdAndUpdate tarvitsee sellaisen.
  // Eikä konstruktiofunktiolla luota oliota, niinkuin esim. ylemmässä POST:ssa!
  const person = {
    name: body.name,
    number: body.number
  }


  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

// const generateNewId = (max) => {
//   const min = 5
//   return (Math.floor(Math.random() * (max - min + 1)) + min).toString()
// }

// const checkName = (name) => {
//   if(persons.find(p => p.name === name)){
//     return true
//   }
//   return false
// }

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'Unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if(error.name === 'CastError'){
    return response.status(400).send({ error: 'Malformatted id' })
  }
  else if(error.name === 'ValidationError'){
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`)
})