import express, { Application, Request, Response } from 'express';
import multer from 'multer'
import path from 'path';
import mime from 'mime-types'

const app: Application = express();
const PORT: number = 3002;

const imagesDirectory = path.join(process.cwd(), `tmp/raw`);

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'tmp/raw/')
    },
    filename: function (req, file, cb) {
        const ext = mime.extension(file.mimetype);
        cb(null, `${Date.now()}.${ext}`) //Appending .jpg
    }
})

const upload = multer({
    storage: storage
});

app.post('/upload', 
    upload.single('file'),
    (req, res) => {
        console.log("Recieved Upload")
        console.log(req)
        res.send(`Thank you for publishing this image. It is being saved in ${imagesDirectory}`)
    }
);

app.listen(PORT, (): void => {
    console.log('SERVER IS UP ON PORT:', PORT);
});
