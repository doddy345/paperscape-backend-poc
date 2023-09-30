import express, { Application, Request, Response } from 'express';
import multer from 'multer'
import path from 'path';
import mime from 'mime-types'
import { colorReduce } from './pipeline/steps/colorReduce';
import { PipelineBuilder } from './pipeline/PipelineBuilder';
import { RemoveBackgroundStep } from './pipeline/steps/RemoveBackgroundStep';
import { despeckle } from './pipeline/steps/despeckle';
import { clampAlpha } from './pipeline/steps/clampAlpha';

import { fileHash } from './pipeline/util/FileHash';
import { SaturateStep } from './pipeline/steps/SaturateStep';

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

const getPipeline = () => {
    return new PipelineBuilder()
        .withStep(new SaturateStep())
        .withStep(new RemoveBackgroundStep())
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
