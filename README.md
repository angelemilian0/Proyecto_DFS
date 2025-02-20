# Proyecto Escuela Técnica Superior

## 🚀 Inicio Rápido con GitHub Codespaces

1. Abre el repositorio en GitHub
2. Haz clic en el botón verde "Code"
3. Selecciona la pestaña "Codespaces"
4. Haz clic en "Create codespace on main"
5. Espera a que el contenedor se construya (esto puede tomar unos minutos)
6. Una vez dentro del Codespace, ejecuta:
```bash
cd Proyecto_DFS
npm install
```

## 🛠️ Configuración Local

### Prerrequisitos
- Node.js v18 o superior
- MongoDB
- Git

### Pasos de instalación
1. Clona el repositorio:
```bash
git clone https://github.com/angelemilian0/Proyecto_DFS.git
```

2. Instala dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
```bash
cp .env.example .env
# Edita .env con tus valores
```

4. Inicia el servidor:
```bash
npm run dev
```

## 🔧 Scripts Disponibles
- `npm start`: Inicia el servidor en modo producción
- `npm run dev`: Inicia el servidor en modo desarrollo
- `npm test`: Ejecuta las pruebas
- `npm run lint`: Verifica el estilo del código
- `npm run format`: Formatea el código

## 📚 Estructura del Proyecto
```
proyecto/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── index.js
├── frontend/
│   ├── images/
│   ├── logic/
│   └── *.html
├── .devcontainer/
├── .env
└── package.json
```

## 🤝 Contribuir
1. Crea un fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request