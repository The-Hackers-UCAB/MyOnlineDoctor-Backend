/**IUuidGenerator: Es un puerto que permite generar UUIDs.*/
export interface IUUIDGenerator {
    /** Genera un UUID. */
    generate(): string;
}