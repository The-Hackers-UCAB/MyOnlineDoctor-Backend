import { IValueObject } from "../../../core/domain/value-objects/value-object.interface";
import { InvalidDoctorRatingException } from "../exceptions/invalid-doctor-rating.exception";

export class DoctorRating implements IValueObject<DoctorRating>{
    private readonly count: number;
    private readonly total: number;
    private readonly score: number;

    get Count() { return this.count; }
    get Total() { return this.total; }
    get Score() { return this.score; }

    private constructor(count: number, total: number, score: number) {
        if (count < 0 || total < 0 || score < 0) {
            throw new InvalidDoctorRatingException();
        }

        this.count = count;
        this.total = total;
        this.score = score;
    }

    equals(other: DoctorRating): boolean {
        return this.score == other.score;
    }

    static create(count: number, total: number, score: number): DoctorRating {
        return new DoctorRating(count, total, score);
    }
}