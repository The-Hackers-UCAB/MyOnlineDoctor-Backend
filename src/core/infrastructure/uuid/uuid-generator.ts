import { v4 as uuidv4 } from 'uuid';

/**UUIDGenerator: Es una clase que genera UUIDs.*/
export class UUIDGenerator {
    /** Genera un UUID. */
    static generate(): string {
        return uuidv4();
    }
}
