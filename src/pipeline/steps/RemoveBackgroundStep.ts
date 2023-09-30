// @ts-ignore
import removeBackground from "@imgly/background-removal-node"
import fs from 'fs'
import { AbstractPipelineStep } from "./AbstractPipelineStep";
import { fileHash } from "../util/FileHash";

export class RemoveBackgroundStep extends AbstractPipelineStep {
  
  protected getDefaultConfig(): {} {
    return {}
  }

  private bgConfig: any = {
    progress: (key: string, current: string, total: string) => {
      console.log(`Downloading ${key}: ${current} of ${total}`);
    }
  };

  protected async executeImpl(rawImagePath: string): Promise<string> {
    const fileName = `bgremoved_${await fileHash(rawImagePath)}.png`
    const outPath = `${this.getOutputDirectory()}/${fileName}`

    const blob: Blob = await removeBackground(rawImagePath, this.bgConfig)

    const buffer = await blob.arrayBuffer();
    await fs.promises.writeFile(outPath, Buffer.from(buffer));

    return outPath
  }
}