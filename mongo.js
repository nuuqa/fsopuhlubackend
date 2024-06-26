const mongoose = require('mongoose')

if(process.argv.length < 3){
    console.log('Give password as a first argument')
    process.exit(1)
}

const password = process.argv[2]
const url = ``

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if(process.argv.length === 5){

    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
    })

    person.save().then(result => {
        console.log(`Added ${process.argv[3]} ${process.argv[4]} to phonebook.`)
        mongoose.connection.close()
    })
}

if(process.argv.length === 3){
    Person.find({}).then(result =>{
        result.forEach(p => {
            console.log(p)
        })
        mongoose.connection.close()
    })
}