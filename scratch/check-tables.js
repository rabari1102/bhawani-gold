const { createClient } = require('@libsql/client');

const db = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function main() {
  const result = await db.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
  console.log('Tables in Turso:', result.rows.map(r => r.name));
}

main().catch(console.error);
