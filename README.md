# Arquitectura-Web-UP
Sistema de Gestión de un Servicio de Peliculas:

Entidades: 
- Tabla Películas: id, título, género, año, director, actores, sinopsis, duración, calidad.
- Tabla Usuarios: id, nombre, email, contraseña, historial_visualizacion.
- Tabla Listas_Reproducción: id, usuario_id, nombre, contenido (relación muchos a muchos con películas y series)

Operaciones:
- Permitir a los usuarios buscar contenido por título, género, actor, director.
- Recomendar contenido al usuario.
- Generar estadísticas de visualización.

Manejo de los objetos con protocolo HTTP:
 - GET: Solicitar una representación de un recurso específico.
Ejemplo: /API/Peliculas devolvería una lista de todas las películas disponibles.

- POST: Crear un nuevo recurso.
Ejemplo: Enviar un objeto JSON con los datos de una nueva película a /API/Peliculas para agregarla a la base de datos.

- DELETE: Eliminar un recurso existente.
Ejemplo: Eliminar la película con el ID 123: /API/Peliculas/123.

- PUT: Reemplazar completamente un recurso existente.
Ejemplo: Enviar un objeto JSON con los datos actualizados de la película con ID 123 a /API/Peliculas/123.

- PATCH: Modificar parcialmente un recurso existente.
Ejemplo: Enviar solo los campos que se desean actualizar de la película con ID 123 a /API/Peliculas/123
