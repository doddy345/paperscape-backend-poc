import path from "path";

const PUBLIC_DIR = 'public'

export abstract class AbstractPipelineStep {
    /*
    @parameter {string} full Input path, absolute path in filesystem
    @returns {string} full Output path, absolute path in filesystem
    */
    protected abstract executeImpl: (rawImagePath: string) => string;

    /*
    @parameter {string} Input path, relative to `public` directory
    @returns {string} Output path, relative to `public` directory
    */
    public execute(rawImagePath: string): string {
        const absoluteInputPath = path.join(process.cwd(), PUBLIC_DIR, rawImagePath);
        const absoluteOutputPath = this.executeImpl(absoluteInputPath);
        const relativeOutputPath = absoluteOutputPath.split(`/${PUBLIC_DIR}/`)[1];

        return relativeOutputPath;
    }
}