import express from 'express'
import mongoose from 'mongoose'
import userRouter from './routes/userRouter.js'
import authenticateUser from './middlewares/authenticate.js'
import productRouter from './routes/productRouter.js'

const mongoUri = "mongodb://admin:1234@ac-ouwlhib-shard-00-00.e7jglri.mongodb.net:27017,ac-ouwlhib-shard-00-01.e7jglri.mongodb.net:27017,ac-ouwlhib-shard-00-02.e7jglri.mongodb.net:27017/?ssl=true&replicaSet=atlas-cg7ro3-shard-0&authSource=admin&appName=Cluster0"

mongoose.connect(mongoUri).then(
    ()=>{
        console.log("Connected to MongoDB")
    }
)


const app = express()

app.use( express.json() )



app.use(authenticateUser)

app.use("/users", userRouter)

app.use("/products", productRouter)

 
app.listen( 3000 ,
    ()=>{
      console.log("Server is running!")  
    }
)