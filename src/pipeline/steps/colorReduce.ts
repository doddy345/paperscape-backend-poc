import gm from 'gm'
import path from 'path';

const relativePath = 'public/out'
const outDir = path.join(process.cwd(), relativePath);

export const colorReduce = (imagePath: string): string => {
    const inPath = path.join(process.cwd(), imagePath)
    const relativeFilename = `img${Date.now()}.png`
    const outPath = `${outDir}/${relativeFilename}`
    
    gm(inPath)
        .colors(4)
        .write(outPath, err => {
            if (err) {
                console.log(err)
            }        
        });
    return `${relativePath}/${relativeFilename}`
}