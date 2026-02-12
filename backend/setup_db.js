const { Client } = require('pg');

const config = {
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'Indigen@18',
  database: 'postgres', // Connect to default DB first
};

async function setupDatabase() {
  const client = new Client(config);

  try {
    await client.connect();
    console.log('Connected to PostgreSQL server.');

    // Check if database exists
    const checkRes = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = 'amazon_fdc_tool'"
    );

    if (checkRes.rowCount === 0) {
      console.log('Database amazon_fdc_tool does not exist. Creating...');
      await client.query('CREATE DATABASE amazon_fdc_tool');
      console.log('Database amazon_fdc_tool created successfully!');
    } else {
      console.log('Database amazon_fdc_tool already exists.');
    }
  } catch (err) {
    console.error('Error verifying/creating database:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

setupDatabase();
