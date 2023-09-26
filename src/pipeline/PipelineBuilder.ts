type PipelineStep = (prevImagePath: string, rawImagePath: string) => Promise<string>;
type Pipeline = (rawImagePath: string) => Promise<string[]>;

export class PipelineBuilder {
    private steps: PipelineStep[] = []

    constructor() {
        this.steps = []
    }

    public withStep(step: PipelineStep): PipelineBuilder {
        this.steps.push(step)
        return this;
    }

    public build(): Pipeline {
        return rawImagePath => {
            const initial = Promise.resolve([rawImagePath])
            return this.steps.reduce<Promise<string[]>>(async (acc, step) => {
                const a = await acc;
                return [...a, await step(a[a.length-1], rawImagePath)]
            }, initial)
        }
    }
}