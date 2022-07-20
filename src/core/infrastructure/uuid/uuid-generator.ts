import { IUUIDGenerator } from '../../../core/application/uuid/uuid-generator.interface';
import { v4 as uuidv4 } from 'uuid';

/**UUIDGenerator: Es una clase que genera UUIDs.*/
export class UUIDGenerator implements IUUIDGenerator {
    /** Genera un UUID. */
    generate(): string {
        return uuidv4();
    }
}
