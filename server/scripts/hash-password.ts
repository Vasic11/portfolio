import bcrypt from "bcryptjs";

const password = process.argv[2];
if (!password) {
  console.error('Upotreba: npm run hash-password -- "tvoja-lozinka"');
  process.exit(1);
}

const hash = await bcrypt.hash(password, 12);
console.log(`ADMIN_PASSWORD_HASH='${hash}'`);