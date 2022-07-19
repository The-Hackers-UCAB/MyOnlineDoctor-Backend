import { EntityRepository, Repository, SaveOptions } from "typeorm";
import { SessionEntity } from "../entities/session.entity";

@EntityRepository(SessionEntity)
export class SessionsRepository extends Repository<SessionEntity> {

    public async save<SessionEntity>(session: SessionEntity, options?: SaveOptions): Promise<SessionEntity> {
        session['userId'] = await JSON.parse(session['json']).passport.user.id;
        session['firebaseToken'] = await JSON.parse(session['json']).passport.user.firebaseToken;
        return await super.save(session);
    }
}