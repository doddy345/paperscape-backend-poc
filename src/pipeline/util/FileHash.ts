import crypto from 'crypto'
import fs from 'fs'

export const fileHash = async (path: string) => {
    const fileContent = fs.readFileSync(path);
    const hashSum = crypto.createHash('sha1');
    hashSum.update(fileContent);
    const encoded = hashSum.digest('base64');
    return encoded
}