import 'dotenv/config';
import { SessionsRepository } from '../src/security/auth/sessions/repositories/session.repository';
import { TypeormStore } from 'connect-typeorm/out';
import { ValidationPipe } from '@nestjs/common';
import { getCustomRepository } from 'typeorm';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { ExceptionInterceptor } from './core/infrastructure/interceptors/exception.interceptor';
import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PATCH,POST,DELETE',
    preflightContinue: false,
    credentials: true,
    allowedHeaders: 'Content-Type, Accept',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true
    })
  );

  app.use(
    session({
      name: 'session',
      store: new TypeormStore({ cleanupLimit: 2 }).connect(getCustomRepository(SessionsRepository)),
      secret: process.env.SESSION_SECRET,
      saveUninitialized: false,
      resave: false,
      cookie: {
        httpOnly: false,
        maxAge: Number.parseInt(process.env.SESSION_MAX_AGE),
        sameSite: (process.env.SESSION_SAME_SITE == 'none' ? 'none' : (process.env.SESSION_SAME_SITE == 'lax' ? 'lax' : 'strict')),
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.useGlobalInterceptors(new ExceptionInterceptor());

  //FirebaseInitialization
  const serviceAccount: ServiceAccount = {
    "projectId": "push-demo-eed6a",
    "privateKey": ("-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQD9M2OZaPiMCRzi\nMnsuKh4u6pnyAfLWKLzwh5J5yRbH/pTwuZ9xa2MXRa7yvA/cOfZn2tmAaEQY6yWF\n+NpO/0sheI6EPl2uWAspRzz77YqEp+mEyF2YYbqy+mvyv4GGAWfGKaTuVaDI8bDx\nQ+gFEN9eF707RyxbwFisAFu7gTSOd6ZTcdSzhAewl0L+mOLKqdK/+q24rQ3mSLQP\nADVY1Hss6exbUykX4xCSZEVoks0d/2pkoTleuhPQk/Db7B8YKqmaZobUxp6Frq+7\nSWsdxS8y6IRoq6lS8lSjF8vfIYZpjxCjM316nKP7MznGNPe3SW0T4JUAAxWSs+NR\nvmbmHlSFAgMBAAECggEAI/cRta/IZjPBK4waHSOUZ/ug5FRMhwkAVXYcYzoiB0Rt\nKYhkUnr7d0nJoOb/pbuB+ZyHeorU6Wk1SkNf1wrCRD3YmIY3TlVpOHLLAcnq/A7R\nx6+iQ8vV9ihF/xQetMcsU2SE7emxzfkutgZ8RYPxBm9+zJW+gkXfEod2gDrJGVcz\nL+vv0Uy+FVWHUwIdp43zWjmX3K7nXWpNbck+JxHiGtl5rlDVcKjzHyYMqskiIdwb\nFF711Oy595S5Km1l6ojpT9sHb4LgoamIidrDgbfiEMqDXDHvI7HUatUqUSyp7lyF\nE4LvJv7umVbwKrsHhOP/5B9knscMMjoE9egusdAloQKBgQD/da07Hh8oHwpHUELA\nasfYqMh+sie56Zw444j5h9CwRnhlCiBbpXQNATxG5eUHUV+uas6qM29VIDfHa/gY\nFXPKD9BXF2vw3E310ypdtDINBjbq1pZ/1koZ9LfYdeX/B8tbVBwiXe9PPoM0A0BB\n9TUhDuOqrQkLDq30PnEi4hGYjQKBgQD9vH0+cPDW0kT/L6+E+NmekJx4R1Fg9Vcf\n5NqmGK31nY1DAyN2zr3H3HmJnIHNTpx2onP68iGNbW7QYyZtCdd3GgvTGplY+TTi\nn7t2x7mVtlER3WXWsZ+eWfXgz8EKLCdwjrL2MB4Q1Nh2IwJJy1UmCcrtShpv5tNi\nHG2P3JdZ2QKBgQCDXFur3p1e4DdE3Hy2vTHuszwGCk5rRzlR947j4XbqbhJSwpZJ\nChdW6J+6RVU0Ih/1bG7BDpndSCfmoBp/J+jWqrMTVbPnsyFTmzZZ4OMr11o+AAJ7\n0hFgr3oqENYoAjYLzIB7G5qHQTnucQ2F3TVovmNLzJat3OqOgd1jdqRdsQKBgFJ/\nQklW9zchToWZv3uAXWEMq5L/vRnFKvqXse9m/sho3VD4aENsnI+qw2lWlW1nLb/0\nubjRmM8e0XS3h/rTxFZZBZcxgsJG5Eb6oDzSWyiuClXAoifXwIn/vc3GPoFMMdaK\nzuz0YBIg4fAnGctcbObdMDlOaqIPbpLro0Ou+RahAoGAQDEBrisgPE9ax16hTDyU\n0HzU2vCFdI6vVYq34nYOHiMD6Wt7bHTYuXnnfIzlO4+dp12SKoqVGsbQRinFKGYt\ni3BbhD5OEImE97o+b3+res1K6cS/HTNFUonNRAUOzAruDvZ4ROyP++5hKS/uFRhP\n5GKIa2ONNlc+e27JswlTrVA=\n-----END PRIVATE KEY-----\n").replace(/\\n/g, '\n'),
    "clientEmail": "firebase-adminsdk-f2pqr@push-demo-eed6a.iam.gserviceaccount.com"
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  await app.listen(Number.parseInt(process.env.PORT) || 3000);
}
bootstrap();
