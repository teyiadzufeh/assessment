import { prisma } from '../src/db/prisma'
import { v4 as uuidv4 } from 'uuid';
import {hash} from 'bcrypt';

async function main() {
    let password = await hash('fre3Ed#n',10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin1@atticassess.com'},
        update: {},
        create: {
            email: 'admin1@atticassess.com',
            uuid: uuidv4(),
            email_verified: true,
            password: password,
            user_type: 'admin'
        },
    })
    console.log({ admin })
}

main()
.then(async () => {
    await prisma.$disconnect()
})
.catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
})