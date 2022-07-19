import { PassportSerializer } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";

Injectable()
export class SessionSerializer extends PassportSerializer {
    serializeUser(user: any, done: (err: Error, user: any) => void): any {
        done(null, { id: user.userId, role: user.userRole, ipAddress: user.userIpAddress, doctorId: user.doctorId, patientId: user.patientId, firebaseToken: user.firebaseToken });
    }

    deserializeUser(payload: any, done: (err: Error, payload: string) => void) {
        done(null, payload);
    }
}