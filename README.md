# Arquitectura-Web-UP
Sistema de Gestión de un Servicio de Streaming:

Entidades: 
- Tabla Películas: id, título, género, año, director, actores, sinopsis, duración, calidad.
- Tabla Series: id, título, género, año, número_temporadas, episodios_por_temporada.
- Tabla Usuarios: id, nombre, email, contraseña, historial_visualizacion.
- Tabla Listas_Reproducción: id, usuario_id, nombre, contenido (relación muchos a muchos con películas y series)
Operaciones:
- Permitir a los usuarios buscar contenido por título, género, actor, director.
- Recomendar contenido al usuario.
- Generar estadísticas de visualización.
- Gestionar los derechos de autor.
