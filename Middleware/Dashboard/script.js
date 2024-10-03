// Simular datos del servidor (puedes reemplazar esto con una solicitud real a tu API)
const serverData = [
    {
        url: 'http://server1.url',
        connections: 45,
        logs: ['Iniciado', 'Conexión establecida', 'Error de base de datos']
    },
    {
        url: 'http://server2.url',
        connections: 30,
        logs: ['Iniciado', 'Conexión establecida', 'Conexión perdida']
    },
    {
        url: 'http://server3.url',
        connections: 67,
        logs: ['Iniciado', 'Error 500', 'Reiniciado']
    }
];

// Función para cargar los datos en la tabla desde la API del middleware
async function loadServerData() {
    try {
        const response = await fetch('/monitor'); // Hacer la solicitud a la ruta /monitor
        const data = await response.json(); // Convertir la respuesta a formato JSON

        const tableBody = document.querySelector("#serverTable tbody");

        // Limpiar la tabla antes de agregar nuevas filas
        tableBody.innerHTML = '';

        // Recorrer los datos obtenidos de la API y crear las filas de la tabla
        data.logs.forEach(server => {
            const row = document.createElement("tr");

            // Crear columna para la URL del servidor
            const urlCell = document.createElement("td");
            urlCell.textContent = server.url;
            row.appendChild(urlCell);

            // Crear columna para el número de conexiones
            const connectionsCell = document.createElement("td");
            connectionsCell.textContent = server.requests;
            row.appendChild(connectionsCell);

            // Crear columna para los logs (por ahora vacío, deberías cargar logs reales si los tienes)
            const logsCell = document.createElement("td");
            logsCell.textContent = 'No disponible'; // En este caso, aún no tenemos logs específicos
            row.appendChild(logsCell);

            // Agregar la fila al cuerpo de la tabla
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error al cargar los datos del servidor:', error);
    }
}

// Llamar a la función para cargar los datos cuando la página esté lista
document.addEventListener('DOMContentLoaded', loadServerData);
