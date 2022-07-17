import { Role } from "src/security/users/roles/role.entity.enum";

/** SessionDto is a Data Transfer Object for the session cookie.
 *  @var {number} userId: Corresponds to the user's ID.
 *  @var {Role} userRole: Corresponds to the user's role.
 *  @var {string} userIpAddress: Corresponds to the user's IP address.
 *  @var {string} doctorId: Corresponds to the doctor's UUID.
 *  @var {string} patient: Corresponds to the patient's UUID.*/
export class SessionDto {
    readonly userId: number;
    readonly userRole: Role;
    readonly userIpAddress: string;
    readonly doctorId?: string;
    readonly patientId?: string;
}
