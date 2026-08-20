function buscarCita() {
  const entrada = document.getElementById('inputBusqueda').value.trim();
  const patron = /^(\d+)\s*,\s*(\d+)\s*-\s*(\d+)$/;
  const coincidencia = entrada.match(patron);

  if (!coincidencia) {
    alert("Formato no válido. Usa el formato: Capítulo, VersículoInicio-VersículoFin (Ej: 15, 03-08)");
    return;
  }

  const capBuscado = parseInt(coincidencia[1], 10);
  const vInicio = parseInt(coincidencia[2], 10);
  const vFin = parseInt(coincidencia[3], 10);

  // Ocultar todo para mostrar solo el resultado
  document.querySelectorAll('h2, p').forEach(el => el.style.display = 'none');
  document.querySelectorAll('sup').forEach(sup => {
    sup.style.backgroundColor = 'transparent';
    sup.style.fontWeight = 'normal';
  });

  // Buscar el título del capítulo objetivo
  const encabezados = Array.from(document.querySelectorAll('h2'));
  const h2Objetivo = encabezados.find(h2 => {
    const numCap = h2.textContent.match(/\d+/);
    return numCap && parseInt(numCap[0], 10) === capBuscado;
  });

  if (!h2Objetivo) {
    alert("El capítulo especificado no se encuentra.");
    return;
  }

  h2Objetivo.style.display = 'block';

  // Mostrar el párrafo correspondiente e iluminar los versículos
  let parrafoActual = h2Objetivo.nextElementSibling;
  while (parrafoActual && parrafoActual.tagName === 'P') {
    parrafoActual.style.display = 'block';
    const etiquetasSup = parrafoActual.querySelectorAll('sup');
    
    etiquetasSup.forEach(sup => {
      const numVersiculo = parseInt(sup.textContent, 10);
      if (numVersiculo >= vInicio && numVersiculo <= vFin) {
        sup.style.backgroundColor = '#ffe066';
        sup.style.fontWeight = 'bold';
      }
    });

    parrafoActual = parrafoActual.nextElementSibling;
  }
}

function limpiarBusqueda() {
  document.querySelectorAll('h2, p').forEach(el => el.style.display = 'block');
  document.querySelectorAll('sup').forEach(sup => {
    sup.style.backgroundColor = 'transparent';
    sup.style.fontWeight = 'normal';
  });
  const input = document.getElementById('inputBusqueda');
  if (input) input.value = '';
}

function buscarCita() {
  const input = document.getElementById('inputBusqueda').value.trim();
  const modal = document.getElementById('modalPasaje');
  const contenedorModal = document.getElementById('contenidoPasaje');

  if (!input) return;

  // Expresión regular para aceptar formatos como: "1", "1:3", "1, 3", "1, 03-08"
  const regex = /^(\d+)(?:[:,\s]+(\d+)(?:\s*-\s*(\d+))?)?$/;
  const match = input.match(regex);

  if (!match) {
    alert("Formato no válido. Ejemplo: '1' (capítulo), '1, 3' (versículo) o '1, 03-08' (rango).");
    return;
  }

  const capituloNum = parseInt(match[1], 10);
  const versiculoInicio = match[2] ? parseInt(match[2], 10) : null;
  const versiculoFin = match[3] ? parseInt(match[3], 10) : (versiculoInicio ? versiculoInicio : null);

  // Buscar el título del capítulo correspondiente
  const titulos = Array.from(document.querySelectorAll('h2'));
  const h2Capitulo = titulos.find(h2 => {
    const num = h2.textContent.replace(/\D/g, '');
    return parseInt(num, 10) === capituloNum;
  });

  if (!h2Capitulo) {
    alert(`No se encontró el Capítulo ${capituloNum}.`);
    return;
  }

  const pCapitulo = h2Capitulo.nextElementSibling;
  if (!pCapitulo || pCapitulo.tagName !== 'P') {
    alert("No se encontró el texto del capítulo.");
    return;
  }

  let htmlResultado = `<h2>${h2Capitulo.textContent}</h2>`;

  // Si solo se ingresó el capítulo
  if (versiculoInicio === null) {
    htmlResultado += `<p>${pCapitulo.innerHTML}</p>`;
  } else {
    // Si se especificaron versículos
    const etiquetasSup = Array.from(pCapitulo.querySelectorAll('sup'));
    let textoExtraido = '';
    let encontrado = false;

    etiquetasSup.forEach(sup => {
      const numVersiculo = parseInt(sup.textContent.trim(), 10);
      if (numVersiculo >= versiculoInicio && numVersiculo <= versiculoFin) {
        encontrado = true;
        textoExtraido += sup.outerHTML;
        
        let nodoSiguiente = sup.nextSibling;
        while (nodoSiguiente && nodoSiguiente.nodeName !== 'SUP') {
          textoExtraido += (nodoSiguiente.nodeType === 3 ? nodoSiguiente.textContent : nodoSiguiente.outerHTML);
          nodoSiguiente = nodoSiguiente.nextSibling;
        }
      }
    });

    if (!encontrado) {
      alert(`No se encontraron los versículos en el rango ${versiculoInicio}-${versiculoFin}.`);
      return;
    }

    htmlResultado += `<p>${textoExtraido}</p>`;
  }

  // Insertar en el modal y desplegar
  contenedorModal.innerHTML = htmlResultado;
  modal.style.display = 'block';
}

function cerrarModal() {
  document.getElementById('modalPasaje').style.display = 'none';
}

function limpiarBusqueda() {
  document.getElementById('inputBusqueda').value = '';
  cerrarModal();
}

// Cerrar modal haciendo clic fuera de la ventana blanca
window.onclick = function(event) {
  const modal = document.getElementById('modalPasaje');
  if (event.target === modal) {
    cerrarModal();
  }
};