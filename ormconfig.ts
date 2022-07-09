import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

const config: PostgresConnectionOptions = {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    ssl: ((JSON.parse(process.env.SSL)) ? { rejectUnauthorized: false } : false),
    entities: [
        'dist/src/**/*.entity.js',
        'dist/src/**/*.entity.enum.js'
    ],
    synchronize: true,
}

export default config;