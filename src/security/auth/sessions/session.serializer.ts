import { PassportSerializer } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";

Injectable()
export class SessionSerializer extends PassportSerializer {
    serializeUser(user: any, done: (err: Error, user: any) => void): any {
        done(null, { id: user.userId, ipAddress: user.userIpAddress });
    }

    deserializeUser(payload: any, done: (err: Error, payload: string) => void) {
        done(null, payload);
    }
}