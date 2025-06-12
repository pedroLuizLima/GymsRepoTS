import 'dotenv/config'
import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import type { Environment } from 'vitest/environments'
import { prisma } from '../../src/lib/prisma'

function generateDatabaseUrl(schema: string) {
    if (!process.env.DATABASE_URL) {
        throw new Error('Please provide a DATABASE_URL env variable')
    }

    const url = new URL(process.env.DATABASE_URL)

    url.searchParams.set('schema', schema)

    return url.toString()
}



export default <Environment> {
    name: 'Prisma',
    transformMode: 'ssr',
    
    async setup() {
        //Criar o banco de testes
        const schema = randomUUID()
        const databaseURL = generateDatabaseUrl(schema)

        process.env.DATABASE_URL = databaseURL

        execSync('npx prisma migrate deploy')

        return {
            async teardown() {
                //Apagar o banco de testes
                await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`)

                await prisma.$disconnect()
            }
        }
    }
}