import { PNG } from 'pngjs'
import fs from 'fs'
import { AbstractPipelineStep } from './AbstractPipelineStep';
import { fileHash } from '../util/FileHash';

export class CleanIslandsStep extends AbstractPipelineStep<{}> {
    protected getDefaultConfig(): {} {
        return {
        }
    }

    protected async executeImpl(rawImagePath: string): Promise<string> {
        const filename = `cleanedislands_${await fileHash(rawImagePath)}.png`
        const outPath = `${this.getOutputDirectory()}/${filename}`
        
        return new Promise((resolve, reject) => {
            fs.createReadStream(rawImagePath)
                .pipe(
                    new PNG({
                        filterType: 4,
                    })
                )
                .on("parsed", function () {
                    for (var y = 0; y < this.height; y++) {
                        for (var x = 0; x < this.width; x++) {
                            var idx = (this.width * y + x) << 2;
                    
                            // invert color
                            this.data[idx] = 255 - this.data[idx];
                            this.data[idx + 1] = 255 - this.data[idx + 1];
                            this.data[idx + 2] = 255 - this.data[idx + 2];
                        }
                    }
                
                    this.pack().pipe(fs.createWriteStream(outPath).on('close', () => {
                        resolve(outPath)
                    }));
                });
        })
    }
}