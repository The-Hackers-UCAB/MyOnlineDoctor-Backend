export interface IQueryService<T, E> {
    execute(dto: T): Promise<E>;
}