import express, { Application, Request, Response } from 'express';
import multer from 'multer'
import path from 'path';
import mime from 'mime-types'
import { colorReduce } from './pipeline/steps/colorReduce';
import { PipelineBuilder } from './pipeline/PipelineBuilder';
import { removeBg } from './pipeline/steps/removeBackground';
import { despeckle } from './pipeline/steps/despeckle';
import { clampAlpha } from './pipeline/steps/clampAlpha';

import { fileHash } from './pipeline/util/FileHash';
import { saturate } from './pipeline/steps/saturate';

const app: Application = express();
const PORT: number = 3002;

const rawDirRelative = `public/raw`
const imagesDirectory = path.join(process.cwd(), rawDirRelative);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${imagesDirectory}/`)
    },
    filename: function (req, file, cb) {
        const ext = mime.extension(file.mimetype);
        cb(null, `${Date.now()}.${ext}`)
    }
})

app.use(express.static('public'))

const upload = multer({
    storage: storage
});

const getPipeline = () => {
    return new PipelineBuilder()
        .withStep(saturate)
        .withStep(removeBg)
        //.withStep(clampAlpha)
        .withStep(colorReduce)
        .withStep(despeckle)
        .build()
}

app.post('/upload', upload.single('file'), async (req, res) => {
    console.log("Recieved Upload")

    const pipeline = getPipeline();
    const results = {
        steps: (await pipeline(`${rawDirRelative}/${req.file?.filename}` || "")).map(
            fullUrl => fullUrl.replace('public/', '')
        )
    };
    res.send(results)
});

app.listen(PORT, (): void => {
    console.log('SERVER IS UP ON PORT:', PORT);
});
