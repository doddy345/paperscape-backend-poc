// @ts-ignore
import removeBackground from "@imgly/background-removal-node"
import path from 'path';
import fs from 'fs'
import { fileHash } from "../util/FileHash";

const relativePath = 'public/out'
const outDir = path.join(process.cwd(), relativePath);

const cache = new Map<string, string>()

const config: any = {
    progress: (key: string, current: string, total: string) => {
      console.log(`Downloading ${key}: ${current} of ${total}`);
    }
};

export const removeBg = async (imagePath: string, rawImagePath: string): Promise<string> => {
    const inPath = path.join(process.cwd(), imagePath)
    const imageHash = await fileHash(inPath);

    if (cache.has(imageHash) && fs.existsSync(cache.get(imageHash)!!)) {
      console.log('We have already removed the background for this image! Using cached result...')
      return cache.get(imageHash)!!
    }

    const relativeFilename = `bgimg${Date.now()}.png`
    const outPath = `${outDir}/${relativeFilename}`
    const blob: Blob = await removeBackground(inPath, config)
    const buffer = await blob.arrayBuffer();
    const result = `${relativePath}/${relativeFilename}`
    await fs.promises.writeFile(outPath, Buffer.from(buffer));

    cache.set(imageHash, result)

    return result;
}