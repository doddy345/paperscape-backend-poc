import gm from 'gm'
import { AbstractPipelineStep } from './AbstractPipelineStep';
import { fileHash } from '../util/FileHash';

type MedianConfig = {
    radius: number
}

export class MedianFilterStep extends AbstractPipelineStep<MedianConfig> {
    protected getDefaultConfig(): MedianConfig {
        return {
            radius: 4
        }
    }

    protected async executeImpl(rawImagePath: string): Promise<string> {
        const filename = `median_${await fileHash(rawImagePath)}.png`
        const outPath = `${this.getOutputDirectory()}/${filename}`
        
        return new Promise((resolve, reject) => {
            gm(rawImagePath)
                .median(this.getConfig().radius)
                .write(outPath, err => {
                    if (err) {
                        console.log(err)
                        reject(err)
                    }
                    resolve(outPath)
                });
        })
    }
}