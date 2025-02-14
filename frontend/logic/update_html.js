// Lógica para incluir el script header.js en los archivos HTML
const fs = require('fs');
const path = require('path');

const files = [
    'frontend/index.html',
    'frontend/login.html',
    'frontend/profesor_dashboard.html'
];

// Itera sobre cada archivo HTML para agregar el script
files.forEach(file => {
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error leyendo el archivo ${file}:`, err);
            return;
        }

        // Agrega el script antes de cerrar la etiqueta </body>
        const updatedData = data.replace(
            '</body>',
            '    <script src="logic/header.js"></script>\n</body>'
        );

        fs.writeFile(file, updatedData, 'utf8', (err) => {
            if (err) {
                console.error(`Error escribiendo el archivo ${file}:`, err);
            } else {
                console.log(`Archivo ${file} actualizado con éxito.`);
            }
        });
    });
});