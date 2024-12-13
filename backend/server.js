const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');  
const dbConfig = require('./db.config');  

const app = express();
const port = 3000;


app.use(bodyParser.json());

app.use(cors({
origin: 'http://localhost:4200',  
methods: ['GET', 'POST'],  
allowedHeaders: ['Content-Type', 'Authorization']  
}));


mongoose.connect(dbConfig.url, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log("Conectado a MongoDB");
})
.catch((err) => {
    console.error("No se pudo conectar a MongoDB", err);
    process.exit();
});

// Modelo para la apuesta
const Bet = mongoose.model('Bet', new mongoose.Schema({
    evento: { type: String, required: true },
    resultado: { type: String, required: true },
    monto: { type: Number, required: true },
    cuota: { type: Number, required: true },
    fecha: { type: Date, default: Date.now }
}));

// Ruta para obtener los eventos
app.get('/get-events', async (req, res) => {
try {
    const apiUrl = 'https://betapi.zgameslatam.com/v1/api/sport-events/prematch-highlights?sportId=sr:sport:1&statusSportEvent=NotStarted&marketId=1&limit=10';
    const params = {
    sportId: 'sr:sport:1',
    statusSportEvent: 'NotStarted',
    marketId: 1,
    limit: 10
    };

    const response = await axios.get(apiUrl, { params });
    res.json(response.data);
    } catch (error) {
    console.error('Error al obtener los eventos:', error);
    res.status(500).json({ message: 'Error al obtener los eventos' });
    }
});

app.post('/api/guardar-apuesta', (req, res) => {
    const { evento, resultado, monto, cuota } = req.body;

    // Verificar que los datos están siendo recibidos
    console.log('Datos recibidos:', req.body);
    const nuevaApuesta = new Bet({
    evento,
    resultado,
    monto,
    cuota
    });

    nuevaApuesta.save()
    .then((data) => {
        res.status(200).json({ message: 'Apuesta guardada correctamente', apuesta: data });
    })
    .catch((err) => {
        console.error('Error al guardar la apuesta:', err);
        res.status(500).json({ message: 'Hubo un error al guardar la apuesta', error: err });
    });
});

app.get('/api/get-apuestas', (req, res) => {
    Bet.find()  // Recupera todas las apuestas almacenadas en la base de datos
    .then((apuestas) => {
        res.status(200).json(apuestas);  // Devuelve las apuestas como respuesta
    })
    .catch((err) => {
        console.error('Error al obtener las apuestas:', err);
        res.status(500).json({ message: 'Error al obtener las apuestas' });
    });
});

app.listen(port, () => {
console.log(`Servidor escuchando en http://localhost:${port}`);
});
// Ruta para eliminar una apuesta
app.delete('/api/eliminar-apuesta/:id', (req, res) => {
    const { id } = req.params;

    Bet.findByIdAndDelete(id)
    .then((data) => {
        if (!data) {
        return res.status(404).json({ message: 'Apuesta no encontrada' });
        }
        res.status(200).json({ message: 'Apuesta eliminada correctamente' });
    })
    .catch((err) => {
        console.error('Error al eliminar la apuesta:', err);
        res.status(500).json({ message: 'Hubo un error al eliminar la apuesta', error: err });
    });
});