import gm from 'gm'
import path from 'path';

const relativePath = 'public/out'
const outDir = path.join(process.cwd(), relativePath);

export const clampAlpha = async (imagePath: string, rawImagePath: string): Promise<string> => {
    const inPath = path.join(process.cwd(), imagePath)
    const relativeFilename = `clampedimg${Date.now()}.png`
    const bgMaskPath = path.join(process.cwd(), `${relativePath}/clampedmaskimg${Date.now()}.jpg`)
    const outPath = `${outDir}/${relativeFilename}`
    
    await new Promise((resolve, reject) => {
        gm(inPath)
            .channel('opacity')
            .threshold(32000)
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

    return new Promise((resolve, reject) => {
        gm(rawImagePath)
            .out("+matte")
            .compose("CopyOpacity")
            .composite(bgMaskPath)
            .write(outPath, err => {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                resolve(`${relativePath}/${relativeFilename}`)
            });
    })
}