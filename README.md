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
- GET / API / Peliculas
- POST / API / Peliculas
- DELETE / API / Peliculas / {ID}
- PUT - PATCH / API / Peliculas / {ID}
