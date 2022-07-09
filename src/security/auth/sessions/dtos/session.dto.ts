/** SessionDto is a Data Transfer Object for the session cookie.
 *  @var {number} userId: Corresponds to the user's ID.
 *  @var {string} userIpAddress: Corresponds to the user's IP address.*/
export class SessionDto {
    readonly userId: number;
    readonly userIpAddress: string;
}