import gm from 'gm'
import path from 'path';

const COLORS = 3

const relativePath = 'public/out'
const outDir = path.join(process.cwd(), relativePath);

export const colorReduce = async (imagePath: string, rawImagePath: string): Promise<string> => {
    const inPath = path.join(process.cwd(), imagePath)
    const relativeFilename = `img${Date.now()}.png`
    const outPath = `${outDir}/${relativeFilename}`
    
    return new Promise((resolve, reject) => {
        gm(inPath)
            .colors(COLORS)

            .write(outPath, err => {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                resolve(`${relativePath}/${relativeFilename}`)
            });
    })
}