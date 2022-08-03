<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## _MyOnlineDoctor-Backend_

Backend de la applicación _MyOnlineDoctor_ desarrollada por The Hackers, utilizando NestJs.

## Instalación


Instalar dependencias de node a través del manejador de paquetes _npm_.

```bash
#npm dependencies
$ npm install
```

Copiar y crear el archivo .env para el manejo de las variables de entorno.

```bash
#.env.example configuration
$ cp .env.example .env
```

## Run de la APP

Ejecutar los siguientes comando para correr la aplicación.

```bash
# development
$ npm run start
```

```bash
# watch mode
$ npm run start:dev
```

```bash
# production mode
$ npm run start:prod
```
## Screenshots

Grafo de dependencias.

![App Screenshot](./dependencygraph.svg)


## Desarrolladores

Tabla con las actividades mas significativas por integrante: 

### Manuel Da Pena


| Actividades                                                                                                            | Pull Request                                                |
|----------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------|
| Configuración básica del proyecto en NestJs. Sistema de autenticación, login, logout, permisos y roles de usuarios del sistema (Paciente, Doctores y Admins), se implementa haciendo uso de Passport-Local, Express Sessions y Cookies. Se aplicó el principio SoC de forma tal que el módulo de Auth de infraestructura solo se encargue de verificar, autenticar y autorizar a los usuarios del sistema. | https://github.com/The-Hackers-UCAB/MyOnlineDoctor-Backend/pull/1 |
| Implementación de la arquitectura principal del backend, basada en DDD. Se implementaron todas las clases del Core del sistema, entre las cuales se encuentran los eventos de dominio, los agregados, las entidades, los servicios de aplicación y dominio, los puertos, entre otros. Se utilizaron diversos principios y patrones para implementar arquitectura principal basada en la arquitectura hexagonal  y DDD, en donde todo momento se respeta la regla de dependencia. Entre los patrones aplicados se encuentra el decorador, singleton, publisher, adapter, repository, dtos, entre otros. También se aplicó la programación orientada a aspectos (AOP) para la implementación de las funcionalidades Cross-Cutting-Concerns (Logging, Error Handler y Notificaciones). Se aplicaron los principios como SRP, LSP DIP, ISP y OCP junto con la programación genérica e inyección de dependencia. | https://github.com/The-Hackers-UCAB/MyOnlineDoctor-Backend/pull/4 |
| Configuración básica del proyecto en NestJs. Sistema de autenticación, login, logout, permisos y roles de usuarios del sistema (Paciente, Doctores y Admins), se implementa haciendo uso de Passport-Local, Express Sessions y Cookies. Se aplicó el principio SoC de forma tal que el módulo de Auth de infraestructura solo se encargue de verificar, autenticar y autorizar a los usuarios del sistema. | https://github.com/The-Hackers-UCAB/MyOnlineDoctor-Backend/pull/1 |
| Implementación del agregado de doctor y casos de uso asociados. | https://github.com/The-Hackers-UCAB/MyOnlineDoctor-Backend/pull/5 , https://github.com/The-Hackers-UCAB/MyOnlineDoctor-Backend/pull/8, https://github.com/The-Hackers-UCAB/MyOnlineDoctor-Backend/pull/13 |
| Implementación del Bus de Eventos para el manejo de los eventos de dominio. | https://github.com/The-Hackers-UCAB/MyOnlineDoctor-Backend/pull/9 |
| Implementación de Notifier con patrones. Se implementó un decorador para el manejo de notificación junto con su puerto y adaptador de firebase. Se utilizó DI con funciones de orden superior y variables parametrizadas para la conversión de la data recibida y la necesaria según la implementación para enviar una notificación. | https://github.com/The-Hackers-UCAB/MyOnlineDoctor-Backend/pull/19, https://github.com/The-Hackers-UCAB/MyOnlineDoctor-Backend/pull/25 |
| Implementaciones relacionadas con citas. | https://github.com/The-Hackers-UCAB/MyOnlineDoctor-Backend/pull/14, https://github.com/The-Hackers-UCAB/MyOnlineDoctor-Backend/pull/19, https://github.com/The-Hackers-UCAB/MyOnlineDoctor-Backend/pull/23 |


### Antonio Badillo


| Actividades                                                                                                            | Pull Request                                                |
|----------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------|
| Continuous integration/continuous delivery (CI/CD) pipeline. Desplegado continuo (Continous Deployment) del servicio web ( NEST API ) a producción en Heroku usando un contenedor docker construido al momento de subir código al repositorio ( on push to master branch ). Automatización desarrollada con Github Actions | https://github.com/The-Hackers-UCAB/MyOnlineDoctor-Backend/pull/2 |
| Implementación del agregado cita con value objects y excepciones| https://github.com/The-Hackers-UCAB/MyOnlineDoctor-Backend/pull/12 |

### Santiago Figueroa
| Actividades                                                                                                            | Pull Request                                                |
|----------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------|
| Implementación del controlador de paciente con su repositorio y mapeadores| https://github.com/The-Hackers-UCAB/MyOnlineDoctor-Backend/pull/10 |
|Implementación de la conexión de Nest con el servicio de Firebase |https://github.com/The-Hackers-UCAB/MyOnlineDoctor-Backend/pull/15
| Implementación del servicio de dominio para calcular el rating de un doctor | https://github.com/The-Hackers-UCAB/MyOnlineDoctor-Backend/pull/18
| Casos de uso relacionados con las citas | https://github.com/The-Hackers-UCAB/MyOnlineDoctor-Backend/pull/20, https://github.com/The-Hackers-UCAB/MyOnlineDoctor-Backend/pull/22, https://github.com/The-Hackers-UCAB/MyOnlineDoctor-Backend/pull/24

### Gabriel Ojeda
| Actividades                                                                                                            | Commit                                              |
|----------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------|
| Implementación del agregado medical record con sus value objects, excepciones, repositorios, mapeadores y el caso de uso para crear un registro medico |[+ 2b00a49](https://github.com/The-Hackers-UCAB/MyOnlineDoctor-Backend/commit/2b00a49354615f14f08f0708d7242ef5b2a81144) |

## License

MyOnlineDoctor-Backend & Nest are [MIT licensed](LICENSE)


## Libraries, guides and code used

### Libraries

- [Jest](https://jestjs.io/)

### Guides

- [Deploy NestJS with Docker, Heroku, and GitHub Actions by Shariq Hirani](https://www.bundleapps.io/blog/nestjs-docker-heroku-github-actions-guide)
- [Unit testing TypeScript with Jest by Duncan Lew](https://duncanlew.medium.com/unit-testing-typescript-with-jest-part-one-f39d2392d0f4)