# Sistema de Gestión de Peliculas 🍿
## Descripción del Sistema
Se trata de un sistema diseñado para ofrecer a los usuarios una experiencia completa y personalizada en la búsqueda y descubrimiento de películas. Combinando información detallada sobre películas con funcionalidades de recomendación y búsqueda avanzada.

## Cuales son sus funciones clave
- Búsqueda Avanzada: Los usuarios podrán buscar películas por título, género, actores, directores y otros criterios.
- Recomendaciones Personalizadas: El sistema sugerirá películas basadas en el historial de visualización del usuario, géneros preferidos y otros factores.
- Información Detallada: Se proporcionará información completa sobre cada película, incluyendo sinopsis, reparto, críticas y calificaciones.
- Disponibilidad: Los usuarios podrán conocer dónde y cuándo pueden ver una película específica, tanto en salas de cine como en plataformas de streaming.
- Listas Personalizadas: Los usuarios podrán crear listas de películas favoritas, pendientes de ver, etc.
- Perfiles de Usuario: Cada usuario tendrá un perfil personalizado donde podrá gestionar sus listas, ver su historial y ajustar sus preferencias.

## Entidades  
- Tabla Película: id, título, género, año, director, actores, sinopsis, duración, calidad.
- Tabla Usuario: id, nombre, email, contraseña, historial_visualizacion.
- Tabla Horario: id, inicio, fin, duracion.
- Tabla Localizacion: id, direccion.
- Tabla Plataforma_Online: id, nombre.
- Tabla Listado_Disponible_Por_Zona: id, usuario_id, nombre, contenido (relación muchos a muchos con películas y localización).
- Tabla Listado_Disponible_Por_Horario: id, usuario_id, nombre, contenido (relación muchos a muchos con películas y horario).
- Tabla Listado_Disponible_Por_Plataforma: id, usuario_id, nombre, contenido (relación muchos a muchos con películas y plataforma).


## Manejo de los objetos con protocolo HTTP
 - GET: Obtener un recurso específico.
Ejemplo: /API/Peliculas devolvería una lista de todas las películas disponibles.

- POST: Crear un nuevo recurso.
Ejemplo: Enviar un objeto JSON con los datos de una nueva película a /API/Peliculas para agregarla a la base de datos.

- DELETE: Eliminar un recurso existente.
Ejemplo: Eliminar la película con el ID 123: /API/Peliculas/123.

- PUT: Reemplazar completamente un recurso existente.
Ejemplo: Enviar un objeto JSON con los datos actualizados de la película con ID 123 a /API/Peliculas/123.

- PATCH: Modificar parcialmente un recurso existente.
Ejemplo: Enviar solo los campos que se desean actualizar de la película con ID 123 a /API/Peliculas/123

## Diseño de la Página Web
La página web podría tener las siguientes secciones principales:
- Página de inicio: Con un buscador destacado, recomendaciones personalizadas y una sección de últimas novedades.
- Perfil de usuario: Donde el usuario puede gestionar sus listas, ver su historial y ajustar sus preferencias.
- Detalle de película: Una página dedicada a cada película con toda la información relevante, trailers, críticas y opciones para verla.
- Explorar: Secciones para explorar películas por género, director, actor, etc.
- Listados: Donde los usuarios pueden ver sus listas personalizadas y crear nuevas.
