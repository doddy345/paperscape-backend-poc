import { AbstractPipelineStep } from "./steps/AbstractPipelineStep";

type Pipeline = (rawImagePath: string) => Promise<string[]>;

export class PipelineBuilder {
    private steps: AbstractPipelineStep[] = []

    constructor() {
        this.steps = []
    }

    public withStep(step: AbstractPipelineStep): PipelineBuilder {
        this.steps.push(step)
        return this;
    }

    public build(): Pipeline {
        return rawImagePath => {
            const initial = Promise.resolve([`${rawImagePath}`])
            return this.steps.reduce<Promise<string[]>>(async (acc, step) => {
                const a = await acc;
                return [...a, await step.execute(`${a[a.length-1]}`)]
            }, initial)
        }
    }
}