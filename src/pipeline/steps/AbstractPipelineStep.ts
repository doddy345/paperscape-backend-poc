import path from "path";

const PUBLIC_DIR = 'public'

export abstract class AbstractPipelineStep<ConfigType = {}> {
    private config: ConfigType
    
    public constructor(config?: ConfigType) {
        this.config = config || this.getDefaultConfig()
    }

    protected abstract getDefaultConfig(): ConfigType

    protected getConfig(): ConfigType {
        return this.config
    }

    /*
    @parameter {string} full Input path, absolute path in filesystem
    @returns {string} full Output path, absolute path in filesystem
    */
    protected abstract executeImpl(rawImagePath: string): Promise<string>;

    private getPublicDirectory(): string {
        return path.join(process.cwd(), PUBLIC_DIR)
    }

    protected getOutputDirectory(): string {
        return path.join(this.getPublicDirectory(), 'out')
    }

    /*
    @parameter {string} Input path, relative to `public` directory
    @returns {string} Output path, relative to `public` directory
    */
    public async execute(rawImagePath: string): Promise<string> {
        const absoluteInputPath = path.join(this.getPublicDirectory(), rawImagePath);
        const absoluteOutputPath = await this.executeImpl(absoluteInputPath);
        const relativeOutputPath = absoluteOutputPath.split(`/${PUBLIC_DIR}/`)[1];

        return relativeOutputPath;
    }
}