import { INotifierHandler } from "../../../application/notification-service/notifier-handler.interface";
import * as admin from 'firebase-admin';

export class FirebaseMovilPayloadDto {
    token: string;
    notifications : {
        title: string;
        body: string;
        payload: any;
    }[];
}

export class FirebaseMovilNotifierService implements INotifierHandler<FirebaseMovilPayloadDto> {
    
    constructor(){}

    async sendNotification(payload: FirebaseMovilPayloadDto): Promise<void> {
        const registrationToken = payload.token;
        for await (const notification of payload.notifications) {
            const message = {
                notification: {
                  title: notification.title,
                  body: notification.body,
          
                },data: {
                  id : registrationToken,
                  payload: notification.payload
                },
                token: registrationToken,
              }
          
              try {
                await admin.messaging().send(message).then(response => {
                  console.log('Successfully sent message:', response);
          
                })
              }
                catch(error) {
                  console.log('Error sending message:', error);
                }
        }
    }
        
}