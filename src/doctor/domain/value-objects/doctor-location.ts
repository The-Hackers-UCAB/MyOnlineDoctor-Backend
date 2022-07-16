import { IValueObject } from "../../../core/domain/value-objects/value-object.interface";
import { InvalidDoctorLocationException } from "../exceptions/invalid-doctor-location.exception";

export class DoctorLocation implements IValueObject<DoctorLocation>{
    private readonly latitude: number;
    private readonly longitude: number;

    get Latitude() { return this.latitude; }
    get Longitude() { return this.longitude; }

    private constructor(latitude: number, longitude: number) {
        let error: boolean = false;

        if (latitude < -90 || latitude > 90) {
            error = true;
        }

        if (longitude < -180 || longitude > 180) {
            error = true;
        }

        if (error) {
            throw new InvalidDoctorLocationException();
        }
        else {
            this.latitude = latitude;
            this.longitude = longitude;
        }
    }

    equals(other: DoctorLocation): boolean {
        return this.latitude == other.latitude && this.longitude == other.longitude;
    }

    static create(latitude: number, longitude: number): DoctorLocation {
        return new DoctorLocation(latitude, longitude)
    }
}