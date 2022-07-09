export interface ICommandService<T> {
    execute(dto: T): Promise<void>;
}