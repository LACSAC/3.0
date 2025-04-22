const form = document.getElementById('tareoForm');
const mensaje = document.getElementById('mensaje');

form.addEventListener('submit', async function (e) {
    e.preventDefault();
    mensaje.textContent = "⏳ Enviando datos...";

    const formData = new FormData(form);
    const data = {};

    formData.forEach((value, key) => {
        data[key] = value.trim();
    });

    const horaInicio = data.hora_inicio;
    const horaFinal = data.hora_final;

    // Validación de tiempo
    if (!horaInicio || !horaFinal) {
        mensaje.textContent = "⚠️ Por favor ingrese las horas de inicio y fin.";
        return;
    }

    if (horaFinal <= horaInicio) {
        mensaje.textContent = "⚠️ La hora final debe ser mayor que la hora de inicio.";
        return;
    }

    const inicio = new Date(`1970-01-01T${horaInicio}:00`);
    const fin = new Date(`1970-01-01T${horaFinal}:00`);
    const horasTrabajadas = (fin - inicio) / (1000 * 60 * 60);
    data.horas_trabajadas = horasTrabajadas.toFixed(2);

    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbzLk77YFLRfAf7fIByA857VVcfH81qAN25wIwrYTbAtXdvyq2XVxQtJAqXJzyomacjL3Q/exec', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.text();

        if (result === "OK") {
            mensaje.textContent = `✅ Registro guardado con éxito. Horas trabajadas: ${data.horas_trabajadas}`;
            form.reset();
        } else {
            mensaje.textContent = `❌ Error del servidor: ${result}`;
        }

    } catch (error) {
        console.error("Error al enviar:", error);
        mensaje.textContent = "❌ Error de red o conexión.";
    }
});

// Mostrar información del código (botón i)
function mostrarPopup() {
    document.getElementById("popup").style.display = "block";
}

function cerrarPopup() {
    document.getElementById("popup").style.display = "none";
}
