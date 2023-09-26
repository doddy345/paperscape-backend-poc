// @ts-ignore
import removeBackground from "@imgly/background-removal-node"
import path from 'path';
import fs from 'fs'

const relativePath = 'public/out'
const outDir = path.join(process.cwd(), relativePath);

const config: any = {
    progress: (key: string, current: string, total: string) => {
      console.log(`Downloading ${key}: ${current} of ${total}`);
    }
};

export const removeBg = async (imagePath: string, rawImagePath: string): Promise<string> => {
    const inPath = path.join(process.cwd(), imagePath)
    const relativeFilename = `bgimg${Date.now()}.png`
    const outPath = `${outDir}/${relativeFilename}`
    
    console.log('removing bg')
    const blob: Blob = await removeBackground(inPath, config)
    const buffer = await blob.arrayBuffer();
    console.log('finished removing bg')
    await fs.promises.writeFile(outPath, Buffer.from(buffer));
    return `${relativePath}/${relativeFilename}`;
}