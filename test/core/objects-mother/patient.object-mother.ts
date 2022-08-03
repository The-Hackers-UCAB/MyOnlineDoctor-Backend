import { UUIDGenerator } from "../../../src/core/infrastructure/uuid/uuid-generator";
import { Patient } from "../../../src/patient/domain/patient";
import { PatientAllergies } from "../../../src/patient/domain/value-objects/patient-allergies";
import { PatientBackground } from "../../../src/patient/domain/value-objects/patient-background";
import { PatientBirthdate } from "../../../src/patient/domain/value-objects/patient-birthdate";
import { PatientGender } from "../../../src/patient/domain/value-objects/patient-gender";
import { PatientGenderEnum } from "../../../src/patient/domain/value-objects/patient-gender.enum";
import { PatientHeight } from "../../../src/patient/domain/value-objects/patient-height";
import { PatientId } from "../../../src/patient/domain/value-objects/patient-id";
import { PatientNames } from "../../../src/patient/domain/value-objects/patient-names";
import { PatientPhoneNumber } from "../../../src/patient/domain/value-objects/patient-phone-number";
import { PatientStatus } from "../../../src/patient/domain/value-objects/patient-status";
import { PatientStatusEnum } from "../../../src/patient/domain/value-objects/patient-status.enum";
import { PatientSurgeries } from "../../../src/patient/domain/value-objects/patient-surgeries";
import { PatientSurnames } from "../../../src/patient/domain/value-objects/patient-surnames";
import { PatientWeight } from "../../../src/patient/domain/value-objects/patient-weight";

export class PatientObjectMother {
    static createActivePatient() {
        const uuid = new UUIDGenerator();

        const patient = Patient.create(
            PatientId.create(uuid.generate()),
            PatientNames.create("First Name", "Middle Name"),
            PatientSurnames.create("First Surname", "Second Surname"),
            PatientBirthdate.create(new Date("2000-01-01")),
            PatientAllergies.create("Alergias"),
            PatientBackground.create("Background"),
            PatientHeight.create(1.8),
            PatientPhoneNumber.create("123456789"),
            PatientStatus.create(PatientStatusEnum.ACTIVE),
            PatientWeight.create(65),
            PatientSurgeries.create("Cirugías"),
            PatientGender.create(PatientGenderEnum.MALE)
        );

        return patient;
    }

    static createSuspendedPatient() {
        const uuid = new UUIDGenerator();

        const patient = Patient.create(
            PatientId.create(uuid.generate()),
            PatientNames.create("First Name", "Middle Name"),
            PatientSurnames.create("First Surname", "Second Surname"),
            PatientBirthdate.create(new Date("2000-01-01")),
            PatientAllergies.create("Alergias"),
            PatientBackground.create("Background"),
            PatientHeight.create(1.8),
            PatientPhoneNumber.create("123456789"),
            PatientStatus.create(PatientStatusEnum.SUSPENDED),
            PatientWeight.create(65),
            PatientSurgeries.create("Cirugías"),
            PatientGender.create(PatientGenderEnum.MALE)
        );

        return patient;
    }

    static createBlockedPatient() {
        const uuid = new UUIDGenerator();

        const patient = Patient.create(
            PatientId.create(uuid.generate()),
            PatientNames.create("First Name", "Middle Name"),
            PatientSurnames.create("First Surname", "Second Surname"),
            PatientBirthdate.create(new Date("2000-01-01")),
            PatientAllergies.create("Alergias"),
            PatientBackground.create("Background"),
            PatientHeight.create(1.8),
            PatientPhoneNumber.create("123456789"),
            PatientStatus.create(PatientStatusEnum.BLOCKED),
            PatientWeight.create(65),
            PatientSurgeries.create("Cirugías"),
            PatientGender.create(PatientGenderEnum.MALE)
        );

        return patient;
    }
}