import "dotenv/config";
import { hashPassword } from "../api/modules/auth/password.service";
import { prisma } from "../lib/prisma";

const seedUsers = [
  {
    email: "admin@michelin.local",
    password: "Admin1234!",
    firstName: "Ada",
    lastName: "Admin",
    role: "ADMIN" as const,
  },
  {
    email: "user@michelin.local",
    password: "User1234!",
    firstName: "Ulysse",
    lastName: "User",
    role: "USER" as const,
  },
];

async function main() {
  for (const u of seedUsers) {
    const passwordHash = await hashPassword(u.password);
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {
        firstName: u.firstName,
        lastName: u.lastName,
        role: u.role,
        passwordHash,
      },
      create: {
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        role: u.role,
        passwordHash,
        emailVerified: new Date(),
      },
    });
    console.log(`✓ ${user.role.padEnd(5)}  ${user.email}  (password: ${u.password})`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
