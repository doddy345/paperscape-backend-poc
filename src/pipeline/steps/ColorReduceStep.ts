import gm from 'gm'
import { fileHash } from '../util/FileHash';
import { AbstractPipelineStep } from './AbstractPipelineStep';

type ColorRecudeConfig = {
    colourCount: number
}

export class ColorReduceStep  extends AbstractPipelineStep<ColorRecudeConfig> {
    protected getDefaultConfig(): ColorRecudeConfig {
        return {
            colourCount: 4
        }
    }

    protected async executeImpl(rawImagePath: string): Promise<string> {
        const filename = `colorReduced_${await fileHash(rawImagePath)}.png`
        const outPath = `${this.getOutputDirectory()}/${filename}`
        
        return new Promise((resolve, reject) => {
            gm(rawImagePath)
                .colors(this.getConfig().colourCount)
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