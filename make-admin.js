const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv').config({ path: '.env' });

async function main() {
  const email = process.argv[2];

  if (!email) {
    console.error("❌ Please provide an email address.");
    console.error("Usage: node make-admin.js <email>");
    process.exit(1);
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const user = await prisma.user.update({
      where: { email: email },
      data: { isAdmin: true }
    });
    
    console.log(`✅ Success! ${user.email} is now an Admin.`);
  } catch (error) {
    if (error.code === 'P2025') {
      console.error(`❌ User with email ${email} not found in the database.`);
    } else {
      console.error("❌ An error occurred:", error.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main();
