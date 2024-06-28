import { createPool } from 'mysql2/promise';

// Create a connection pool
const pool = createPool({
    host: process.env.MYSQL_ADDON_HOST,
    user: process.env.MYSQL_ADDON_USER,
    password: process.env.MYSQL_ADDON_PASSWORD,
    database: process.env.MYSQL_ADDON_DB,
    connectionLimit: 5 // Adjust the connection limit as per your requirements
});

// test connection
pool.getConnection()
    .then(connection => {
        console.log('Connected to the database');
        connection.release();
    })
    .catch(error => {
        console.log('Error connecting to the database', error);
    });


export default pool;

