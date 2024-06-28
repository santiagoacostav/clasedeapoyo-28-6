import express from 'express';
import pool from './config/db.js';
import 'dotenv/config';

// Import required modules

// Create an Express app
const app = express();

const puerto = process.env.PORT || 3000;

// Enable JSON parsing for request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Read all resources
app.get('/productos', async (req, res) => {
    const sql = `SELECT productos.id_producto, productos.nombre, productos.precio, productos.descripcion, productos.stock, 
                categorias.nombre AS categoria, promos.promos AS banco, promos.descuento, 
                cuotas.cuotas, cuotas.interes
                FROM productos 
                JOIN categorias ON productos.fk_categoria = categorias.id_categoria
                JOIN promos ON productos.fk_promos = promos.id_promos
                JOIN cuotas ON productos.fk_cuotas = cuotas.id_cuotas
                ORDER By productos.precio DESC`;

    try {
        const connection = await pool.getConnection()
        const [rows] = await connection.query(sql);
        connection.release();
        res.json(rows);

    } catch (error) {
        res.send(500).send('Internal server error')
    }

});

// Read a specific resource
app.get('/productos/:id', async (req, res) => {
    const id = req.params.id
    const sql = `SELECT productos.nombre, productos.precio, productos.descripcion, productos.stock, 
                categorias.nombre AS categoria, promos.promos AS banco, promos.descuento, 
                cuotas.cuotas, cuotas.interes
                FROM productos 
                JOIN categorias ON productos.fk_categoria = categorias.id_categoria
                JOIN promos ON productos.fk_promos = promos.id_promos
                JOIN cuotas ON productos.fk_cuotas = cuotas.id_cuotas
                WHERE productos.id_producto = ?
                ORDER By productos.precio DESC`

    try {
        const connection = await pool.getConnection()
        const [rows] = await connection.query(sql, [id]);
        connection.release();
        console.log("UN PRODUCTO --> ", rows)
        res.json(rows[0]);
    } catch (error) {
        res.send(500).send('Internal server error')
    }
});

// Create a new resource
app.post('/productos', async (req, res) => {

    const producto = req.body;

    const sql = `INSERT INTO productos SET ?`;

    try {
        const connection = await pool.getConnection()
        const [rows] = await connection.query(sql, [producto]);
        connection.release();
        res.send(`
            <h1>Producto creado con id: ${rows.insertId}</h1>
        `);
    } catch (error) {
        res.send(500).send('Internal server error')
    }
});

// Update a specific resource
app.put('/productos/:id', async (req, res) => {
    const id = req.params.id;
    const producto = req.body;

    const sql = `UPDATE productos SET ? WHERE id_producto = ?`;

    try {
        const connection = await pool.getConnection()
        const [rows] = await connection.query(sql, [producto, id]);
        connection.release();
        console.log(rows)
         res.send(`
            <h1>Producto actualizado id: ${id}</h1>
        `);
    } catch (error) {
        res.send(500).send('Internal server error')
    }

});

// Delete a specific resource
app.delete('/productos/:id', async (req, res) => {
    const id = req.params.id;
    const sql = `DELETE FROM productos WHERE id_producto = ?`;

     try {
        const connection = await pool.getConnection()
        const [rows] = await connection.query(sql, [id]);
        connection.release();
        console.log(rows)
         res.send(`
            <h1>Producto borrado id: ${id}</h1>
        `);
    } catch (error) {
        res.send(500).send('Internal server error')
    }
});

// Start the server
app.listen(puerto, () => {
    console.log('Server started on port 3000');
});