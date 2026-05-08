const { createClient } = require('@libsql/client');
const path = require('path');

const localDb = createClient({ url: `file:${path.join(__dirname, '..', 'dev.db')}` });

const remoteDb = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const tables = [
  'Admin', 'User', 'Category', 'Product', 'MetalRate',
  'Testimonial', 'Service', 'BlogPost', 'StoreSettings', 'ContactEnquiry'
];

async function main() {
  console.log('Migrating data from dev.db to Turso...\n');

  for (const table of tables) {
    try {
      const result = await localDb.execute(`SELECT * FROM "${table}"`);
      const rows = result.rows;

      if (rows.length === 0) {
        console.log(`  - ${table}: empty, skipping`);
        continue;
      }

      const columns = result.columns;
      const placeholders = columns.map(() => '?').join(', ');
      const colList = columns.map(c => `"${c}"`).join(', ');
      const insertSql = `INSERT OR IGNORE INTO "${table}" (${colList}) VALUES (${placeholders})`;

      let inserted = 0;
      for (const row of rows) {
        const values = columns.map(col => {
          const val = row[col];
          if (typeof val === 'bigint') return Number(val);
          return val ?? null;
        });
        try {
          await remoteDb.execute({ sql: insertSql, args: values });
          inserted++;
        } catch (err) {
          console.log(`    ! ${table} row error: ${err.message.substring(0, 80)}`);
        }
      }
      console.log(`  + ${table}: ${inserted}/${rows.length} rows migrated`);
    } catch (err) {
      console.log(`  X ${table}: ${err.message.substring(0, 100)}`);
    }
  }

  console.log('\nDone!');
}

main().catch(console.error);
