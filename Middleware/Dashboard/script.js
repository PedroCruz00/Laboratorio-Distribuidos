document.addEventListener('DOMContentLoaded', () => {
    const serverTable = document.getElementById('serverTable').querySelector('tbody');
    const serverStatusTable = document.getElementById('serverStatusTable').querySelector('tbody');
    const serverSelect = document.getElementById('serverFilter');

    // Función para cargar los logs del servidor
    const loadLogs = async (server = '') => {
        try {
            const response = await fetch(`/logs?server=${server}`);
            const logs = await response.json();

            // Limpiar tabla
            serverTable.innerHTML = '';

            // Rellenar la tabla con logs
            logs.forEach(log => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td style="color:white">${log.instanceName}</td>
                    <td style="color:white">${log.requestType}</td>
                    <td style="color:white">${JSON.stringify(log.payload)}</td>  <!-- Asegúrate de convertir el payload a string -->
                    <td style="color:white">${log.date}</td>
                    <td style="color:white">${JSON.stringify(log.response)}</td> <!-- Convertir la respuesta a string -->
                    <td style="color:white">${log.url}</td>
                `;
                serverTable.appendChild(row);
            });
        } catch (error) {
            console.error('Error cargando logs:', error);
        }
    };

    // Cargar logs al inicio
    loadLogs();

    // Filtro por servidor
    serverSelect.addEventListener('change', () => {
        loadLogs(serverSelect.value);
    });

    // Función para cargar los estados de los servidores
    const loadServerStatus = async () => {
        try {
            const response = await fetch('/monitor');
            const data = await response.json();

            // Limpiar la tabla de estado de servidores
            serverStatusTable.innerHTML = '';

            // Rellenar la tabla con el estado de los servidores
            data.logs.forEach(log => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td style="color:white";>${log.url}</td>
                    <td style="color:white">${log.requests > 0 ? 'Activo' : 'Inactivo'}</td>
                `;
                serverStatusTable.appendChild(row);
            });
        } catch (error) {
            console.error('Error cargando estados de servidores:', error);
        }
    };

    // Cargar los nombres de los servidores en el filtro y el estado de los servidores
    const loadServerOptions = async () => {
        try {
            const response = await fetch('/monitor');
            const data = await response.json();

            serverSelect.innerHTML = '<option value="" style="color:white">Todos los servidores</option>'; // Opción por defecto
            data.logs.forEach(log => {
                const option = document.createElement('option');
                option.value = log.url;
                option.textContent = log.url;
                serverSelect.appendChild(option);
            });

            // Cargar los estados de los servidores
            loadServerStatus();
        } catch (error) {
            console.error('Error cargando servidores:', error);
        }
    };

    // Cargar opciones de servidores al inicio
    loadServerOptions();
});

const updateServerStatusTable = async () => {
    try {
        const response = await fetch('/monitor');
        const data = await response.json();

        const tableBody = document.querySelector('#serverStatusTable tbody');
        tableBody.innerHTML = ''; // Limpiar la tabla

        data.logs.forEach(server => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td style="color:white">${server.url}</td>
                <td style="color:white">${server.status || 'Inactivo'}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error al actualizar la tabla de servidores:', error);
    }
};

document.getElementById('reloadButton').addEventListener('click', function() {
    location.reload();
});
// Llamar a la función cada 5 segundos para mantener la tabla actualizada
setInterval(updateServerStatusTable, 5000);
updateServerStatusTable();