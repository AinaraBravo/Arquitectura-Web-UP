![cine](https://kinsta.com/es/wp-content/uploads/sites/8/2023/07/how-to-push-code-to-github.jpg)

# Sistema de Gestión de Peliculas 
## Descripción de la página web 🍿
Se trata de un sistema diseñado para ofrecer a los usuarios una experiencia completa y personalizada en la búsqueda y descubrimiento de películas, combinando información detallada sobre películas con funcionalidades de recomendación y búsqueda avanzada. Además, el sistema permite a los usuarios conocer la disponibilidad de las películas, indicando dónde y cuándo pueden disfrutarlas, ya sea desde la comodidad de su casa o bien en la gran pantalla.

## Funcionalidades de la página web 📌
- **Gestión de usuarios**: Registro, inicio de sesión, actualización de perfil, recuperación de contraseña, etc.
- **Gestión de películas**: Búsqueda, filtrado, detalles de películas, recomendaciones, listas de favoritos, calificaciones, comentarios, etc.
- **Gestión de horarios y salas**: Consulta de horarios, salas cercanas, etc.
- **Administración**: Gestión de contenidos, obtener reportes, crear una nueva pelicula, eliminar un usuario, agregar una nueva plataforma, etc.
- **Social**: Compartir listas y descubrimientos en redes sociales.
- **Notificaciones**: Aviso sobre nuevas películas, estrenos y recomendaciones personalizadas.

## Entidades y Relaciones
### Entidades 🖱️
- **Película**: Contiene información que es fundamental para la búsqueda y recomendación.
  - Atributos: id_pelicula, título, genero, año, director, actores, sinopsis, duración.
- **Usuario**: Contiene información del usuario, incluyendo su historial de visualización que será clave para las recomendaciones personalizadas.
  - Atributos: id_usuario, nombre, email, contrasenia, historial_visualizacion.
- **Horario**: Contiene los horarios de proyección en las salas de cine.
  - Atributos: id_horario, inicio, fin, duracion.
- **Sala_De_Cine**: Contiene la información geográfica de las salas.
  - Atributos: id_sala_de_cine, direccion.
- **Plataforma_Online**: Contiene el nombre de cada plataforma de streaming.
  - Atributos: id_plataforma_online, nombre.
- **Proyección**: Representa una instancia específica de una película en un lugar y horario determinado.
  - Atributos: id, película_id, sala_de_cine_id, horario_id, plataforma_online_id (puede ser nulo si es una proyección en cine).

### Relaciones 💖
- Listado_Disponible_Por_*: Estas tres tablas intermediarias están intentando modelar una relación muchos a muchos entre Película y las otras entidades (Sala_De_Cine, Horario, Plataforma_Online). 
- Película - Proyección: Una película puede tener muchas proyecciones (relación uno a muchos).
- Sala_De_Cine - Proyección: Una sala de cine puede tener muchas proyecciones (relación uno a muchos).
- Horario - Proyección: Un horario puede asociarse a muchas proyecciones (relación uno a muchos).
- Plataforma_Online - Proyección: Una plataforma puede tener muchas proyecciones (relación uno a muchos).

## Manejo de los objetos con protocolo HTTP 🌐
### Gestión de usuarios

1. Crear un nuevo usuario:
   - Endpoint: /API/Usuarios
   - Método: POST
   - Cuerpo: nombre,email, contrasenia
   - Código de estado:
      - 201 Created: Si el usuario se crea correctamente.
      - 400 Bad Request: Si faltan datos o hay algún error de validación (por ejemplo, email ya existe).
      - 500 Internal Server Error: Si ocurre un error interno en el servidor.
        
2. Actualizar la información de un usuario:
   - Endpoint: /API/Usuarios/{id_usuario}
   - Método: PUT
   - Código de estado:
      - 200 OK: Si la información del usuario se actualiza correctamente.
      - 404 Not Found: Si no se encuentra el usuario con el ID especificado.
400 Bad Request: Si hay algún error de validación.
      - 500 Internal Server Error: Si ocurre un error interno en el servidor.
        
3. Iniciar sesión:
   - Endpoint: /API/Usuarios/login
   - Método: POST
   - Cuerpo: email, contrasenia
   - Código de estado:
      - 200 OK: Si las credenciales son válidas y se genera un token de autenticación.
      - 401 Unauthorized: Si las credenciales son incorrectas.
      - 400 Bad Request: Si faltan datos o hay algún error de validación.
      - 500 Internal Server Error: Si ocurre un error interno en el servidor.

4. Recuperar contraseña:
   - Endpoint: /API/Usuarios/recuperar_contrasena
   - Método: POST
   - Cuerpo: email
   - Código de estado:
      - 200 OK: Si se envía un correo electrónico con las instrucciones para restablecer la contraseña.
      - 404 Not Found: Si no se encuentra el usuario con el email especificado.
      - 400 Bad Request: Si el formato del email es inválido.
      - 500 Internal Server Error: Si ocurre un error interno en el servidor.
        
### Gestión de peliculas
1. Obtener detalles de una película:
  - Endpoint: /API/Peliculas/{id_pelicula}
  - Método: GET
  - Códigos de estado:
      - 200 OK: La película se encontró y se devolvieron sus detalles.
      - 404 Not Found: La película con el ID especificado no existe.
      - 500 Internal Server Error: Ocurrió un error interno en el servidor al intentar obtener los datos.
2. Buscar una película por género:
  - Endpoint: /API/Peliculas?genero={genero}
  - Método: GET
  - Códigos de estado:
      - 200 OK: Se encontró al menos una película del género especificado y se devolvió una lista.
      - 404 Not Found: No se encontraron películas del género especificado.
      - 500 Internal Server Error: Ocurrió un error interno en el servidor al realizar la búsqueda.
3. Agregar una película a la lista de favoritos de un usuario:
  - Endpoint: /API/Usuarios/{id}/favoritos
  - Método: POST
  - Cuerpo: id_pelicula
  - Códigos de estado:
      - 201 Created: La película se agregó correctamente a la lista de favoritos.
      - 404 Not Found: El usuario o la película no existen.
      - 400 Bad Request: La película ya está en la lista de favoritos.
      - 500 Internal Server Error: Ocurrió un error interno al agregar la película a la lista de favoritos.
4. Calificar una película:
  - Endpoint: /API/Peliculas/{id}/calificar
  - Método: POST
  - Cuerpo: calificacion
  - Códigos de estado:
      - 200 OK: La calificación se registró correctamente.
      - 404 Not Found: La película no existe.
      - 400 Bad Request: La calificación no es válida (por ejemplo, fuera de rango).
      - 409 Conflict: El usuario ya ha calificado esta película.
      - 500 Internal Server Error: Ocurrió un error interno al registrar la calificación.
5. Obtener recomendaciones de una película:
  - Endpoint: /API/Peliculas/recomendaciones
  - Método: GET
  - Códigos de estado:
      - 200 OK: Se devolvió una lista de películas recomendadas.
      - 404 Not Found: No se encontraron recomendaciones.
      - 500 Internal Server Error: Ocurrió un error interno al generar las recomendaciones.
     
### Gestión de horarios y salas
1. Obtener las salas de cine cercanas a una ubicación:
  - Endpoint: /API/Salas_De_Cine?latitud={lat}&longitud={lon}
  - Método: GET
  - Códigos de estado:
      - 200 OK: Se encontró al menos una sala de cine cerca de la ubicación especificada y se devolvió una lista.
      - 404 Not Found: No se encontraron salas de cine cerca de la ubicación especificada.
      - 500 Internal Server Error: Ocurrió un error interno en el servidor al realizar la búsqueda.
2. Obtener horarios de una película en una sala de cine:
  - Endpoint: /API/Peliculas/{id_pelicula}/Horarios
  - Método: GET
  - Códigos de estado:
      - 200 OK: Se encontraron horarios disponibles para la película en la sala de cine especificada.
      - 404 Not Found: La película o la sala de cine no existen, o no hay horarios disponibles para esa película en esa sala.
      - 500 Internal Server Error: Ocurrió un error interno en el servidor al obtener los horarios.
     
### Administración
1. Agregar una película:
  - Endpoint: /API/Peliculas
  - Método: POST
  - Cuerpo: título, género, año, director, actores, sinopsis, duración.
  - Códigos de estado:
      - 201 Created: La película se creó correctamente.
      - 400 Bad Request: Faltan datos obligatorios o hay un formato incorrecto.
      - 409 Conflict: Ya existe una película con el mismo título.
      - 500 Internal Server Error: Ocurrió un error interno en el servidor.
2. Eliminar una película:
  - Endpoint: /API/Peliculas/{id_peliculas}
  - Método: DELETE
  - Códigos de estado:
      - 204 No Content: La película se eliminó correctamente (no se devuelve cuerpo en la respuesta).
      - 404 Not Found: La película con el ID especificado no existe.
      - 403 Forbidden: El usuario no tiene permisos para eliminar la película.
      - 500 Internal Server Error: Ocurrió un error interno en el servidor.
3. Obtener el historial de visualizaciones de un usuario:
  - Endpoint: /API/Usuarios/{id}/historial
  - Método: GET
  - Códigos de estado:
      - 200 OK: Se devolvió el historial de visualizaciones del usuario.
      - 404 Not Found: El usuario con el ID especificado no existe.
      - 500 Internal Server Error: Ocurrió un error interno al obtener el historial.
      
### Social
1. Compartir en redes sociales:
    - Endpoint: /API/Peliculas/{id_pelicula}/compartir
    - Método: POST
    - Código de estado:
      - 200 OK: Si la solicitud se procesó correctamente y se envió la solicitud a la red social.
      - 400 Bad Request: Si falta algún dato en la solicitud o si el formato es incorrecto.
      - 500 Internal Server Error: Si ocurre un error interno al procesar la solicitud.

### Notificaciones
1. Subscribirse a un tipo de notificación:
    - Endpoint: /API/Usuarios/{id_usuario}/suscripciones
    - Método: POST
    - Código de estado:
        - 201 Created: La suscripción se creó correctamente.
        - 400 Bad Request: Si falta algún dato en la solicitud o si el formato es incorrecto.
        - 404 Not Found: El usuario no existe.
        - 409 Conflict: Ya existe una suscripción con las mismas características.
        - 500 Internal Server Error: Si ocurre un error interno al crear la suscripción.
2. Eliminar una suscripcion:
    - Endpoint: /API/Usuarios/{id_usuario}/suscripciones/{id_suscripcion}
    - Método: DELETE
    - Código de estado:
        - 204 No Content: La suscripción se eliminó correctamente.
        - 404 Not Found: La suscripción o el usuario no existen.
        - 403 Forbidden: El usuario no tiene permisos para eliminar la suscripción.
        - 500 Internal Server Error: Si ocurre un error interno al eliminar la suscripción.
3. Enviar una notificación a un usuario:
    - Endpoint: /API/notificaciones
    - Método: POST
    - Código de estado:
        - 202 Accepted: La notificación ha sido aceptada para su envío (no garantiza que se haya enviado con éxito).
        - 400 Bad Request: Si falta algún dato en la solicitud o si el formato es incorrecto.
        - 404 Not Found: El usuario no existe.
        - 500 Internal Server Error: Si ocurre un error interno al enviar la notificación.
            
## Diseño de la Página Web 🚀
La página web podría tener las siguientes secciones:
- **Página de inicio**: Con un buscador destacado, recomendaciones personalizadas y una sección de últimas novedades.
- **Perfil de usuario**: Donde el usuario puede gestionar sus listas, ver su historial y ajustar sus preferencias.
- **Detalle de película**: Una página dedicada a cada película con toda la información relevante, trailers, críticas y opciones para verla.
- **Explorar**: Secciones para explorar películas por género, director, actor, etc.
- **Listados**: Donde los usuarios pueden ver sus listas personalizadas y crear nuevas.

## Consideraciones Adicionales 
- Integración con APIs de terceros: Para obtener información de películas de bases de datos externas (e.g., TMDB) y actualizar automáticamente la información.
  
