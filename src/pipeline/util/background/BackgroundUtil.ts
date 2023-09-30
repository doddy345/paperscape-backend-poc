type BackgroundUtilConfig = {
    threshold: number
}

class BackgroundUtil
{
    private static _instances: Map<BackgroundUtilConfig, BackgroundUtil>;
    private backgroundUtilConfig: BackgroundUtilConfig

    private constructor(backgroundUtilConfig: BackgroundUtilConfig)
    {
        this.backgroundUtilConfig = backgroundUtilConfig;
    }

    public getBackgroundOnly(imagePath: string) {

    }

    public getForegroundOnly(imagePath: string) {
        
    }

    public static getInstance(backgroundUtilConfig: BackgroundUtilConfig)
    {
        if (!this._instances.has(backgroundUtilConfig)){
            BackgroundUtil._instances.set(backgroundUtilConfig, new this(backgroundUtilConfig));
        }

        return BackgroundUtil._instances.get(backgroundUtilConfig);
    }
}