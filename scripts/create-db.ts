import pg from 'pg'

const { Client } = pg

async function createDatabase() {
  // Connect to postgres default database
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'postgres',
  })

  try {
    await client.connect()
    console.log('Connected to PostgreSQL')

    // Check if database exists
    const checkDb = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = 'elite_store'"
    )

    if (checkDb.rows.length === 0) {
      await client.query('CREATE DATABASE elite_store')
      console.log('Database "elite_store" created successfully')
    } else {
      console.log('Database "elite_store" already exists')
    }

    await client.end()
  } catch (error) {
    console.error('Error creating database:', error)
    process.exit(1)
  }
}

createDatabase()
