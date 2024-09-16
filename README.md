![cine](https://www.cronista.com/files/image/703/703805/6548e81537f93.jpg)

# Sistema de Gestión de Peliculas 🍿
## Descripción de la página web
Se trata de un sistema diseñado para ofrecer a los usuarios una experiencia completa y personalizada en la búsqueda y descubrimiento de películas, combinando información detallada sobre películas con funcionalidades de recomendación y búsqueda avanzada. Además, el sistema permite a los usuarios conocer la disponibilidad de las películas, indicando dónde y cuándo pueden disfrutarlas, ya sea desde la comodidad de su casa o bien en la gran pantalla.

## Funcionalidades de la página web 
- **Gestión de usuarios**: Registro, inicio de sesión, actualización de perfil, recuperación de contraseña, etc.
- **Gestión de películas**: Búsqueda, filtrado, detalles de películas, recomendaciones, listas de favoritos, calificaciones, comentarios, etc.
- **Gestión de horarios y salas**: Consulta de horarios, salas cercanas, etc.
- **Administración**: Gestión de contenidos, obtener reportes, crear una nueva pelicula, eliminar un usuario, agregar una nueva plataforma, etc.
- **Social**: Compartir listas y descubrimientos en redes sociales.
- **Notificaciones**: Aviso sobre nuevas películas, estrenos y recomendaciones personalizadas.

## Entidades y Relaciones
### Entidades 
- **Película**: Contiene información que es fundamental para la búsqueda y recomendación.
  - Atributos: id_pelicula, título, genero, año, director, actores, sinopsis, duración.
- **Usuario**: Contiene información del usuario, incluyendo su historial de visualización que será clave para las recomendaciones personalizadas.
  - Atributos: id_usuario, nombre, email, contraseña, historial_visualizacion.
- **Horario**: Contiene los horarios de proyección en las salas de cine.
  - Atributos: id_horario, inicio, fin, duracion.
- **Sala_De_Cine**: Contiene la información geográfica de las salas.
  - Atributos: id_sala_de_cine, direccion.
- **Plataforma_Online**: Contiene el nombre de cada plataforma de streaming.
  - Atributos: id_plataforma_online, nombre.
- **Proyección**: Representa una instancia específica de una película en un lugar y horario determinado.
  - Atributos: id, película_id, sala_de_cine_id, horario_id, plataforma_online_id (puede ser nulo si es una proyección en cine).

### Relaciones
- Listado_Disponible_Por_*: Estas tres tablas intermediarias están intentando modelar una relación muchos a muchos entre Película y las otras entidades (Sala_De_Cine, Horario, Plataforma_Online). 
- Película - Proyección: Una película puede tener muchas proyecciones (relación uno a muchos).
- Sala_De_Cine - Proyección: Una sala de cine puede tener muchas proyecciones (relación uno a muchos).
- Horario - Proyección: Un horario puede asociarse a muchas proyecciones (relación uno a muchos).
- Plataforma_Online - Proyección: Una plataforma puede tener muchas proyecciones (relación uno a muchos).

## Manejo de los objetos con protocolo HTTP
1. Obtener una pelicula específica:
   - Endpoint: /API/Peliculas/{id_pelicula}
   - Método: GET
   - Código de estado: 
2. Buscar una pelicula por genero:
   - Endpoint: /API/Peliculas?genero={genero}
   - Método: GET
   - Código de estado: 
3. Crear un nuevo usuario:
   - Endpoint: /API/Usuarios
   - Método: POST
   - Cuerpo: nombre,email, contraseña.
   - Código de estado: 
4. Agregar una pelicula:
   - Endpoint: /API/Peliculas
   - Método: POST
   - Cuerpo: título, genero, año, director, actores, sinopsis, duración.
   - Código de estado: 
5. Actualizar la información de un usuario:
   - Endpoint: /API/Usuarios/{id_usuario}
   - Método: PUT
   - Código de estado: 
6. Eliminar una pelicula:
   - Endpoint:/API/Peliculas/{id_peliculas}
   - Método: DELETE
   - Código de estado: 
7. Agregar una pelicula a la lista de favoritos de un usuario:
   - Endpoint: /API/Usuarios/{id}/favoritos
   - Método: POST
   - Cuerpo: id_pelicula
   - Código de estado: 
8. Obtener las salas de cine cercanas a una ubicación:
   - Endpoint:/API/Salas_De_Cine?latitud={lat}&longitud={lon}
   - Método: GET
   - Código de estado: 
9. Calificar una pelicula:
    -Endpoint:/API/Peliculas/{id}/calificar
   - Método: POST
   - Código de estado: Si la calificación se crea correctamente, el servidor debería devolver un código de estado 201 (Created).
10. Obtener el historial de visualizaciones de un usuario:
    - Endpoint: /API/Usuarios/{id}/historial
    - Método: GET
    - Código de estado:
     
## Diseño de la Página Web 🚀
La página web podría tener las siguientes secciones:
- **Página de inicio**: Con un buscador destacado, recomendaciones personalizadas y una sección de últimas novedades.
- **Perfil de usuario**: Donde el usuario puede gestionar sus listas, ver su historial y ajustar sus preferencias.
- **Detalle de película**: Una página dedicada a cada película con toda la información relevante, trailers, críticas y opciones para verla.
- **Explorar**: Secciones para explorar películas por género, director, actor, etc.
- **Listados**: Donde los usuarios pueden ver sus listas personalizadas y crear nuevas.

## Consideraciones Adicionales 
- Integración con APIs de terceros: Para obtener información de películas de bases de datos externas (e.g., TMDB) y actualizar automáticamente la información.
  
