const courses = [];
const rows = document.querySelectorAll('tr');

// Obtener el nombre del periodo académico
const periodElement = document.querySelector('#bper_aca_chosen > a span');
const academicPeriod = periodElement ? periodElement.textContent.trim() : 'Periodo desconocido'; // Verificación del periodo

rows.forEach(row => {
  const cells = row.querySelectorAll('td font'); // Seleccionamos los elementos <font> dentro de las celdas

  // Verificar si la fila tiene suficientes celdas para contener los datos necesarios
  if (cells.length > 6) {
    const courseId = cells[0].textContent.trim(); // ID del curso (1ª columna)
    const courseName = cells[1].textContent.trim(); // Nombre del curso (2ª columna)
    const sendDate = cells[5].textContent.trim(); // Fecha de envío (6ª columna)

    // Buscar el texto "Acreditar" específicamente en la columna adecuada (columna 8)
    const actionCell = row.querySelectorAll('td')[7]; // Seleccionar la celda de la columna 8
    if (actionCell && actionCell.textContent.trim() === 'Acreditar') {
      courses.push({
        courseId,
        courseName,
        sendDate,
        academicPeriod
      });
    }
  }
});

// Obtener los cursos previamente almacenados
chrome.storage.local.get('accreditationCourses', (data) => {
  let existingCourses = data.accreditationCourses || {};

  // Si ya hay cursos para este periodo, actualizarlos, de lo contrario, añadirlos
  existingCourses[academicPeriod] = existingCourses[academicPeriod] || [];

  // Combinar los cursos nuevos con los existentes (evitar duplicados)
  const updatedCourses = existingCourses[academicPeriod].concat(courses.filter(course => 
    !existingCourses[academicPeriod].some(existingCourse => existingCourse.courseId === course.courseId)
  ));

  // Actualizar la lista de cursos en el almacenamiento
  existingCourses[academicPeriod] = updatedCourses;

  chrome.storage.local.set({ 'accreditationCourses': existingCourses }, () => {
    console.log(`Cursos del periodo ${academicPeriod} actualizados:`, updatedCourses);
  });
});
