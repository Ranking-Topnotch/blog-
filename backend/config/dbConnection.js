const mongoose = require('mongoose')

const connectToDb = async () => {
    try{
        const db = await mongoose.connect('mongodb+srv://blog:blog@devblog.bbvzcvg.mongodb.net/devblog?retryWrites=true&w=majority')
        console.log('database connection', db.connection.host, db.connection.name)
    }catch(err){
        console.log(err)
        process.exit(1)
    }
}

module.exports = connectToDb