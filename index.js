const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 3001 


morgan.token('body', (req) => {
    return JSON.stringify(req.body);
  });

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())


// Persons
let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": "1"
      },
      {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": "2"
      },
      {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": "3"
      },
      {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": "4"
      }
]


//.../api/info
app.get('/api/info', (request, response) => {

    const time = new Date()


    response.send(
        `<div><p>Phonebook has info for ${persons.length} people</p> <br><p>${time}</p></div>`
    )
})

// .../api/persons
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

// .../api/persons/id
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(p => p.id === id)

    if(person){
        response.json(person)
    }
    else{
        response.status(404).end()
    }
})

// .../api/persons/id -> delete
app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
})

// .../api/persons/ -> add
app.post('/api/persons', (request, response) => {
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
    if(checkName(body.name) === true){
        return response.status(400).json({
            error:'Name must be unique'
        })
    }


    const person ={
        name: body.name,
        number: body.number,
        id: generateNewId(200),
    }

    persons = persons.concat(person)
    response.json(person)
})

const generateNewId = (max) => {
    const min = 5
    return (Math.floor(Math.random() * (max - min + 1)) + min).toString()
}

const checkName = (name) => {
    if(persons.find(p => p.name === name)){
        return true
    }
    return false
}

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})