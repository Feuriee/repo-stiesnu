"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    const adminEmail = 'admin@stiesnu.ac.id';
    const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (!existingAdmin) {
        const hashedPassword = await bcryptjs_1.default.hash('admin', 10);
        await prisma.user.create({
            data: {
                name: 'Administrator',
                email: adminEmail,
                password: hashedPassword,
                role: 'ADMIN',
                isApproved: true,
            },
        });
        console.log('✅ Admin user account securely seeded. Email: admin@stiesnu.ac.id | Password: admin');
    }
    else {
        console.log('✅ Admin user account already exists in MySQL.');
    }
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map