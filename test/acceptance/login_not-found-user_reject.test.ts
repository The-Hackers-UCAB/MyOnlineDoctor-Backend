import { INestApplication } from "@nestjs/common";
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AuthModule } from "../../src/core/infrastructure/security/auth/auth.module";

describe('Loguearse en la aplicación con un correo no existente.', () => {
    let app: INestApplication;

    beforeAll(async () => {
        // Creamos la aplicacion o modulo de testing de Nest.js para poder realizar la prueba e2e
        let moduleRef = await Test.createTestingModule({
            imports: [AuthModule]
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();
    })

    it('Debe ser rechazada', async () => {
        const data = { email: "e@e.e", password: "12345678" };

        //Act
        return request(app.getHttpServer())
            .post('/api/auth/login')
            .send(data)

            //Assert
            .expect(404)
    })

    //Cerramos la aplicación y eliminamos de la BD lo persitido.
    afterAll(async () => {
        await app.close();
    })
});
