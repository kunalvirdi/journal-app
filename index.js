const express=require('express');
const app=express();
const bodyParser=require('body-parser')
const authRoute=require('./routes/authentication')
const feedRoute=require('./routes/feedRoutes')
const multer=require('multer')
require('dotenv').config()
const cors=require('cors')

const port = process.env.PORT || 8000
app.use(cors())
app.use(bodyParser.json())

// Setting up multer for getting and storing files on AWS S3
const fileStorage=multer.memoryStorage();
app.use(multer({storage: fileStorage}).single('attachment'));


app.get('/',(req,res)=>{
    res.json({
        message:"Please follow the following routes.",
        registration:"/register",
        login:"/login",
        getFeeds:"/feed",
        createJournal:"/postJournal",
        updateJournal:"/updateJournal",
        deleteJournal:"/deleteJournal",
        documentationLink:"https://kunalvirdi.stoplight.io/docs/journals-api/branches/main/ytt54mjnpx2mq-journals-app-api"
    })
})

app.use(authRoute)
app.use('/feed',feedRoute)
app.listen(port)