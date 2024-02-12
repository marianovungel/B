// require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')

const { initializeApp } = require("firebase/app");
const { getStorage, ref, getDownloadURL, uploadBytesResumable } = require("firebase/storage");
const multer = require("multer");
// const config = require("../config/firebase.config")
const { v4: uuidv4 } = require('uuid');


app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use((req, res, next)=>{
    res.header("Access-Control-Allow-Origin", "/*");
    res.header("Access-Control-Allow-Methods", 'GET,POST','PUT','DELETE');
    app.use(cors())
    next();
})
app.use(cors())

app.get("/", (req, res)=>{
    res.json({data: process.env.PORT})

})

//Initialize a firebase application
const firebaseConfig =  {
    apiKey: "AIzaSyC5RgtPVCYK5N7rvu_hTAgUkB2zBJkG16Y",
    authDomain: "observatorio-e2ba4.firebaseapp.com",
    projectId: "observatorio-e2ba4",
    storageBucket: "observatorio-e2ba4.appspot.com",
    messagingSenderId: "406207783313",
    appId: "1:406207783313:web:2175a42149338faae6ba30",
    measurementId: "G-L7FP1FBCW6"
  }
const config = {
    firebaseConfig
}

initializeApp(config.firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage();

// Setting up multer as a middleware to grab photo uploads
const upload = multer({ storage: multer.memoryStorage() });

app.post("/upload", upload.single("filename"), async (req, res) => {
    try {
        const dateTime = uuidv4();

        const storageRef = ref(storage, `files/${req.file.originalname + " " + dateTime}`);

        // Create file metadata including the content type
        const metadata = {
            contentType: req.file.mimetype,
        };

        // Upload the file in the bucket storage
        const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
        //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

        // Grab the public url
        const downloadURL = await getDownloadURL(snapshot.ref);

        res.status(200).json(downloadURL)
    } catch (error) {
        res.status(400).send(error.message)
    }
});



// const port = process.env.PORT
app.listen("8000", console.log("Servidor funcionando!"))