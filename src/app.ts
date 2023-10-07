import express, { Application, Request, Response } from 'express';
import multer from 'multer'
import path from 'path';
import mime from 'mime-types'
import { PipelineBuilder } from './pipeline/PipelineBuilder';
import { RemoveBackgroundStep } from './pipeline/steps/RemoveBackgroundStep';
import { MedianFilterStep } from './pipeline/steps/MedianFilterStep';

import { fileHash } from './pipeline/util/FileHash';
import { SaturateStep } from './pipeline/steps/SaturateStep';
import { ClampAlphaStep } from './pipeline/steps/ClampAlphaStep';
import { ColorReduceStep } from './pipeline/steps/ColorReduceStep';

const app: Application = express();
const PORT: number = 3002;

const rawDirRelative = `raw`

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${path.join(process.cwd(), 'public', 'raw')}`)
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

const getInitialPipeline = () => {
    return new PipelineBuilder()
        .withStep(new SaturateStep({percentage: 200}))
        .withStep(new MedianFilterStep({ radius: 4 }))
        .withStep(new RemoveBackgroundStep())
        .withStep(new ClampAlphaStep({alphaThreshold: 55000}))
        .withStep(new ColorReduceStep({colourCount: 5}))
        .withStep(new MedianFilterStep({ radius: 2 }))

        .build()
}

const getCleanPipeline = () => {
    return new PipelineBuilder()
        .build()
}


app.post('/upload', upload.single('file'), async (req, res) => {
    console.log("Recieved Upload")

    const pipeline = getInitialPipeline();
    const results = {
        steps: (await pipeline(`${rawDirRelative}/${req.file?.filename}` || "")).map(
            fullUrl => fullUrl.replace('public/', '')
        )
    };
    res.send(results)
});

app.post('/clean', upload.single('file'), async (req, res) => {
    console.log("Recieved Upload")

    const pipeline = getCleanPipeline();
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
