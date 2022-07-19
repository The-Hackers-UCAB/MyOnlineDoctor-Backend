import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { ISession } from "connect-typeorm";
import { UserEntity } from "../../../users/entities/user.entity";

@Entity({ name: 'sessions' })
export class SessionEntity implements ISession {

    @PrimaryColumn({ length: 255 }) id: string = "";

    @Column({ name: 'payload', type: 'text' }) json: string = "";

    @Index() @Column({ name: 'expired_at', type: 'bigint' }) expiredAt: number = Date.now();


    @Index() @Column({ name: 'user_id', nullable: true }) userId: number;

    @ManyToOne(() => UserEntity) @JoinColumn({ name: 'user_id' }) user: Promise<UserEntity>;


    @Column({ name: 'firebase_token', nullable: true }) firebaseToken: string;
}