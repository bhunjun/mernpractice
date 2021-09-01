import app from "./server.js"
import mongodb from "mongodb"
import dotenv from "dotenv"
import RestaurantsDAO from "./dao/restaurantsDAO.js"

dotenv.config()
const MongoClient = mongodb.MongoClient

const port = process.env.PORT || 8000

// Connect to Mongo batabase 
MongoClient.connect(
    process.env.RESTREVIEWS_DB_URI,
    {
        maxPoolSize: 50,
        wtimeoutMS: 2500, 
        useNewUrlParser: true, }
    )   
    .catch(err => {
        console.error(err.stack)
        process.exit(1)
    })
    .then(async client => {
        // Get initial refernce to the restaurants collection in database
        await RestaurantsDAO.injectDB(client)
        app.listen(port, () => {
            console.log(`listening on port ${port}`)
        })
    })