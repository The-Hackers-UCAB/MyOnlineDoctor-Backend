import * as admin from 'firebase-admin';
import { getManager, IsNull, Not } from "typeorm";
import { SessionsRepository } from "../../../../security/auth/sessions/repositories/session.repository";
import { UsersRepository } from "../../../../security/users/repositories/users.repository";
import { PatientId } from "../../../../patient/domain/value-objects/patient-id";
import { DoctorId } from "../../../../doctor/domain/value-objects/doctor-id";
import { UserEntity } from "../../../../security/users/entities/user.entity";
import { NotificationHandler } from '../../../application/notification-handlers/notification-handler';
import { Logger } from '@nestjs/common';

//#region DTOs.
export class FirebaseMovilNotifierDto {
  doctorId?: DoctorId;
  patientId?: PatientId;
  message: {
    title: string;
    body: string;
    payload: string;
  }
}
//#endregion

export class FirebaseMovilNotifier<D> extends NotificationHandler<D, FirebaseMovilNotifierDto> {
  async send(data: D): Promise<void> {
    //Mapeamos la data tipo D a M.
    const payload: FirebaseMovilNotifierDto = await this.messageMapper(data);

    let user: UserEntity = null;

    //Buscamos el usuario segun el Id del paciente o doctor.
    if (payload.patientId) {
      user = await getManager().getCustomRepository(UsersRepository).findOne({ patientId: payload.patientId.Value });
    }
    else if (payload.doctorId) {
      user = await getManager().getCustomRepository(UsersRepository).findOne({ doctorId: payload.doctorId.Value });
    }

    if (!user) { return; }

    //Buscamos las sesiones activas del ususario.
    const sessions = await getManager().getCustomRepository(SessionsRepository).find({ where: { userId: user.id, firebaseToken: Not(IsNull()) } });

    //Por cada session le mandamos una notificación push.
    for await (const session of sessions) {
      //Creamos el mensaje.
      const message = {
        notification: {
          title: payload.message.title,
          body: payload.message.body,

        }, data: {
          //Token del ususario.
          id: session.firebaseToken,
          payload: payload.message.payload
        },

        //Token del usuario.
        token: session.firebaseToken,
      }

      try {
        await admin.messaging().send(message).then(response => {
          Logger.debug(
            "\x1b[33m[" + this.constructor.name + "] " +
            "\x1b[35m" + response
          );
        })
      }
      catch (error) {
        Logger.debug(
          "\x1b[33m[" + this.constructor.name + "] " +
          "\x1b[35m" + error.message
        );
      }
    }
  }
}