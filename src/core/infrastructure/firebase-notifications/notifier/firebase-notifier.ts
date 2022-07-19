import * as admin from 'firebase-admin';
import { SessionsRepository } from "../../../../security/auth/sessions/repositories/session.repository";
import { NotificationHandler } from '../../../application/notification-handlers/notification-handler';
import { UsersRepository } from "../../../../security/users/repositories/users.repository";
import { PatientId } from "../../../../patient/domain/value-objects/patient-id";
import { DoctorId } from "../../../../doctor/domain/value-objects/doctor-id";
import { UserEntity } from "../../../../security/users/entities/user.entity";
import { getManager, IsNull, Not } from "typeorm";
import { HttpService } from '@nestjs/axios';
import { Logger } from '@nestjs/common';
import { tap } from 'rxjs';

//#region DTOs.
export class FirebaseNotifierDto {
  doctorId?: DoctorId;
  patientId?: PatientId;
  message: {
    title: string;
    body: string;
    payload: string;
  }
}
//#endregion

/**FirebaseNotifier: Puerto de notificaciones push de Firebase.*/
export class FirebaseNotifier<D> extends NotificationHandler<D, FirebaseNotifierDto> {

  private readonly httpService: HttpService;

  constructor(protected messageMapper: (data: D) => Promise<FirebaseNotifierDto>) {
    super(messageMapper);
    this.httpService = new HttpService();
  }

  async send(data: D): Promise<void> {
    //Mapeamos la data tipo D a M.
    const payload: FirebaseNotifierDto = await this.messageMapper(data);

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
        //Intentamos mandar la notificación a movil.
        await admin.messaging().send(message).then(response => {
          Logger.debug(
            "\x1b[33m[" + this.constructor.name + "] " +
            "\x1b[35m" + "Notificación push movil enviada a - Token:" + session.firebaseToken
          );
        })
      }
      catch (error) {
        //De lo contrario se trata de mandar a web.
        await this.httpService.post(
          'https://fcm.googleapis.com/fcm/send',
          {
            "to": session.firebaseToken,
            "notification": message.notification,
            "data": message.data
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'key=AAAAe0C88b4:APA91bFkR8LYkO0vmIuNuZoykgt78X3TLnwMPZenVVjGbA0X64fTyBYKG3poTu36n66mmAmya_aTZcCQ2KtW5JPJ7ccJuWkFMOAz6elI-fZnpv1P5yD50vHR7Rf_jHeIQpppc_2W6NSK'
            }
          }
        ).pipe(
          tap({
            next: (response) => {
              Logger.debug(
                "\x1b[33m[" + this.constructor.name + "] " +
                "\x1b[35m" + "Notificación push web enviada a - Token:" + session.firebaseToken
              );
            },
            error: (error) => {
              Logger.debug(
                "\x1b[33m[" + this.constructor.name + "] " +
                "\x1b[35m" + "No se pudo enviar la notificación: " + error.message
              );
            }
          })
        ).toPromise();
      }
    }
  }
}