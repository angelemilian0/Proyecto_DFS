/** @type {import('jest').Config} */
const config = {
    // Especifica el entorno de pruebas
    testEnvironment: 'node',

    // Archivos de configuración que se ejecutarán antes de las pruebas
    setupFilesAfterEnv: ['./jest.setup.js'],

    // Patrones de archivos a ignorar
    testPathIgnorePatterns: [
        '/node_modules/',
        '/dist/'
    ],

    // Soporte para variables de entorno
    setupFiles: ['dotenv/config'],

    // Patrón para encontrar archivos de prueba
    testMatch: [
        '**/__tests__/**/*.js',
        '**/?(*.)+(spec|test).js'
    ],

    // Tiempo máximo de ejecución para cada prueba
    testTimeout: 30000,

    // Recolectar información de cobertura
    collectCoverage: false,

    // Directorio donde se guardarán los reportes de cobertura
    coverageDirectory: 'coverage',

    // Archivos a ignorar en la cobertura
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '/dist/'
    ],

    // Umbral mínimo de cobertura
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70
        }
    },

    // Mostrar un resumen de la cobertura después de las pruebas
    verbose: true,

    // Transformaciones
    transform: {},

    // Patrones de archivos a ignorar en las transformaciones
    transformIgnorePatterns: ['/node_modules/']
};

module.exports = config;