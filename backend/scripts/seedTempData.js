const { seedAll } = require("./seeders");

const shouldReset = process.argv.includes("--reset");

const main = async () => {
  await seedAll({ reset: shouldReset });
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
