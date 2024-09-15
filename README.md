# Sistema de Gestión de Peliculas 🍿
## Descripción del Sistema
Se trata de un sistema diseñado para ofrecer a los usuarios una experiencia completa y personalizada en la búsqueda y descubrimiento de películas, combinando información detallada sobre películas con funcionalidades de recomendación y búsqueda avanzada. Además, el sistema permite a los usuarios conocer la disponibilidad de las películas, indicando dónde y cuándo pueden disfrutarlas, ya sea desde la comodidad de su casa o bien en la gran pantalla.

## Cuales son sus funciones clave
- Búsqueda Avanzada: Cada usuario podrá buscar películas por título, género, actores, directores y otros criterios.
- Recomendaciones Personalizadas: El sistema sugerirá películas basadas en el historial de visualización del usuario, géneros preferidos y otros factores.
- Información Detallada: Se proporcionará información completa sobre cada película, incluyendo sinopsis, reparto, críticas y calificaciones.
- Disponibilidad: Los usuarios podrán conocer dónde y cuándo pueden ver una película específica, tanto en salas de cine como en plataformas de streaming.
- Listas Personalizadas: Los usuarios podrán crear listas de películas favoritas, pendientes de ver, etc.
- Perfiles de Usuario: Cada usuario tendrá un perfil personalizado donde podrá gestionar sus listas, ver su historial y ajustar sus preferencias.

## Entidades y Relaciones
Entidades 
- Película: Contiene información que es fundamental para la búsqueda y recomendación.
  - Atributos: id_pelicula, título, género, año, director, actores, sinopsis, duración, calidad.
- Usuario: Contiene información del usuario, incluyendo su historial de visualización que será clave para las recomendaciones personalizadas.
  - Atributos: id_usuario, nombre, email, contraseña, historial_visualizacion.
- Horario: Contiene los horarios de proyección en las salas de cine.
  - Atributos: id_horario, inicio, fin, duracion.
- Sala_De_Cine: Contiene la información geográfica de las salas.
  - Atributos: id_sala_de_cine, direccion.
- Plataforma_Online: Contiene el nombre de cada plataforma de streaming.
  - Atributos: id_plataforma_online, nombre.
- Proyección: Representa una instancia específica de una película en un lugar y horario determinado.
  - Atributos: id, película_id, sala_de_cine_id, horario_id, plataforma_online_id (puede ser nulo si es una proyección en cine).

Relaciones
- Listado_Disponible_Por_*: Estas tres tablas intermediarias están intentando modelar una relación muchos a muchos entre Película y las otras entidades (Sala_De_Cine, Horario, Plataforma_Online). 
- Película - Proyección: Una película puede tener muchas proyecciones (relación uno a muchos).
- Sala_De_Cine - Proyección: Una sala de cine puede tener muchas proyecciones (relación uno a muchos).
- Horario - Proyección: Un horario puede asociarse a muchas proyecciones (relación uno a muchos).
- Plataforma_Online - Proyección: Una plataforma puede tener muchas proyecciones (relación uno a muchos).

## Manejo de los objetos con protocolo HTTP
- GET: Obtener un recurso específico.
  - Ejemplo: /API/Peliculas devolvería una lista de todas las películas disponibles.
  - Ejemplo: /API/Horarios devolvería una lista de todos los horarios disponibles.
  - Ejemplo: /API/Salas_De_Cine devolvería una lista de todas las salas de cines disponibles.
  - Ejemplo: /API/Plataformas_Online devolvería una lista de todas las plataformas disponibles.

- POST: Crear un nuevo recurso.
  - Ejemplo: Enviar un objeto JSON con los datos de una nueva película a /API/Peliculas para agregarla a la base de datos.

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

## Consideraciones Adicionales
- Integración con APIs de terceros: Para obtener información de películas de bases de datos externas (e.g., TMDB) y actualizar automáticamente la información.
- Sistema de calificaciones y reseñas: Permitir a los usuarios calificar y comentar las películas.
- Notificaciones: Avisar a los usuarios sobre nuevas películas, estrenos y recomendaciones personalizadas.
- Integración con redes sociales: Permitir a los usuarios compartir sus listas y descubrimientos con sus amigos.
