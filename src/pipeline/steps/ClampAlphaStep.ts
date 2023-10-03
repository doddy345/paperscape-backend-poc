import gm from 'gm'
import path from 'path';
import { AbstractPipelineStep } from './AbstractPipelineStep';
import { fileHash } from '../util/FileHash';

type ClampAlphaConfig = {
    alphaThreshold: number
}

export class ClampAlphaStep extends AbstractPipelineStep<ClampAlphaConfig> {
    protected getDefaultConfig(): ClampAlphaConfig {
        return {
            alphaThreshold: 60000
        }
    }

    protected async executeImpl(rawImagePath: string): Promise<string> {
        const filename = `clamped_${await fileHash(rawImagePath)}.png`;
        const alphaPath = `${this.getOutputDirectory()}/alpha_${await fileHash(rawImagePath)}.png`;
        const bgMaskPath = `${this.getOutputDirectory()}/bg_mask${await fileHash(rawImagePath)}.png`;
        const outPath = `${this.getOutputDirectory()}/${filename}`;
        
        await new Promise((resolve, reject) => {
            gm(rawImagePath)
                .channel('opacity')
                .threshold(this.getConfig().alphaThreshold)
                .negative()
                .setFormat("jpg")
                .write(bgMaskPath, err => {
                    if (err) {
                        console.log(err)
                        reject(err)
                    }
                    resolve(bgMaskPath)
                });
        })
    
        await new Promise((resolve, reject) => {
            gm(rawImagePath)
                .compose("CopyOpacity")
                .composite(bgMaskPath)
                .write(alphaPath, err => {
                    if (err) {
                        console.log(err)
                        reject(err)
                    }
                    resolve(alphaPath)
                });
        })
    
        return new Promise((resolve, reject) => {
            gm(alphaPath)
                .flatten()
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