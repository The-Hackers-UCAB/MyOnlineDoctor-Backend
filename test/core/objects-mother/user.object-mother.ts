import { CreateUserDto } from "../../../src/core/infrastructure/security/users/dtos/create-user.dto";
import { Role } from "../../../src/core/infrastructure/security/users/roles/role.entity.enum";
import { PatientId } from "../../../src/patient/domain/value-objects/patient-id";

export class UserObjectMother {
    static createPatientUser(patientId: PatientId) {
        const user: CreateUserDto = {
            email: "test@test.com",
            password: "12345678.test",
            role: Role.PATIENT,
            patientId: patientId.Value,
        };
        return user;
    }
}