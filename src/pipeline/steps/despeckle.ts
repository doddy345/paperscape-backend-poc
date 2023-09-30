import gm from 'gm'
import path from 'path';

const RADIUS = 4

const relativePath = 'public/out'
const outDir = path.join(process.cwd(), relativePath);

export const despeckle = async (imagePath: string, rawImagePath: string): Promise<string> => {
    const inPath = path.join(process.cwd(), imagePath)
    const relativeFilename = `despeckled_img${Date.now()}.png`
    const outPath = `${outDir}/${relativeFilename}`
    
    return new Promise((resolve, reject) => {
        gm(inPath)
            .median(RADIUS)
            .write(outPath, err => {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                resolve(`${relativePath}/${relativeFilename}`)
            });
    })
}