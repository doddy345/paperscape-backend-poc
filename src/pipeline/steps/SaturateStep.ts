import gm from 'gm'
import { AbstractPipelineStep } from './AbstractPipelineStep';
import { fileHash } from '../util/FileHash';

type SaturateConfig = {
    percentage: number
}

export class SaturateStep extends AbstractPipelineStep<SaturateConfig> {
    protected getDefaultConfig(): SaturateConfig {
        return {
            percentage: 200
        }
    }

    protected async executeImpl(rawImagePath: string): Promise<string> {
        const filename = `saturated_${await fileHash(rawImagePath)}.png`
        const outPath = `${this.getOutputDirectory()}/${filename}`
        
        return new Promise((resolve, reject) => {
            gm(rawImagePath)
                .despeckle()
                .modulate(100, this.getConfig().percentage, 100)
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