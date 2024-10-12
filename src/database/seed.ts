import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from './schema';
import 'dotenv/config';
import { faker } from "@faker-js/faker";
import * as bcrypt from 'bcrypt/.';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false, //default "true"
});
const db = drizzle(pool, { schema }) as NodePgDatabase<typeof schema>;

  async function main() {
    const userIds = await Promise.all(
        Array(50)
        .fill("")
        .map(async () => {
            const user = await db
            .insert(schema.users)
            .values({
                name: faker.person.firstName()+" "+faker.person.lastName(),
                email: faker.internet.email(),
                password: await bcrypt.hash('asdqwe123', 10),
            }).returning();
            return user[0].id
        }),
    );
}
  
main()
.then()
.catch(err => {
    console.error(err)
    process.exit(0)
});