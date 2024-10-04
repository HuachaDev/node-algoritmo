const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

// Ruta para filtrar URLs
app.get('/filtrar', (req, res) => {
    const archivoEntrada = path.join(__dirname, 'urls.txt'); // Ruta del archivo de URLs
    filtrarUrls(archivoEntrada, res);
});

// Función para filtrar URLs
function filtrarUrls(archivoEntrada, res) {
    const urlsValidas = new Set(); // Usamos un Set para eliminar duplicados automáticamente

    fs.readFile(archivoEntrada, 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            res.status(500).json({ error: 'Error al procesar el archivo' });
            return;
        }

        const lineas = data.split('\n'); 

        lineas.forEach(url => {
            const urlLimpiada = url.trim(); 
            const patron = /https?:\/\/([^/]+).*\.html$/; // Expresión regular para validar la URL

            const coincidencia = urlLimpiada.match(patron);
            if (coincidencia) {
                const dominio = coincidencia[1];
                if (dominio.includes('shop')) {
                    urlsValidas.add(urlLimpiada); 
                }
            }
        });

        const totalUrls = urlsValidas.size;
        const urlsArray = Array.from(urlsValidas);

        res.json({ total: totalUrls, urls: urlsArray });
    });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
