type PipelineStep = (rawImagePath: string) => string;
type Pipeline = (rawImagePath: string) => string[];

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
        return rawImagePath => this.steps.reduce<string[]>((acc, step) => [...acc, step(acc[acc.length-1])], [rawImagePath])
    }
}