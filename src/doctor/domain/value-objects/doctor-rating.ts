import { IValueObject } from "../../../core/domain/value-objects/value-object.interface";
import { InvalidDoctorRatingException } from "../exceptions/invalid-doctor-rating.exception";

export class DoctorRating implements IValueObject<DoctorRating>{
    private readonly rating: number;

    get Rating() { return this.rating; }

    private constructor(rating: number) {
        if (rating < 0) {
            throw new InvalidDoctorRatingException();
        }

        this.rating = rating;
    }

    equals(other: DoctorRating): boolean {
        return this.rating == other.rating;
    }

    static create(rating: number): DoctorRating {
        return new DoctorRating(rating);
    }
}