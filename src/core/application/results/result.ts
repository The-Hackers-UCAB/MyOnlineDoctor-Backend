export class Result<T>{
    private result: T;
    private error: Error;

    constructor(result: T)
    constructor(error: Error)
    constructor(value: unknown) {
        if (value as T) {
            this.result = value as T;
            this.error = null;
        }
        else if (value as Error) {
            this.error = value as Error;
            this.result = null;
        }
    }

    get Result(): T {
        return this.result;
    }

    get Errro(): string {
        return this.error.message;
    }

    get IsSuccessful(): boolean {
        return this.result != null;
    }
}