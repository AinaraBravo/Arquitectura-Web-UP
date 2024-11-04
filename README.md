![cine](https://kinsta.com/es/wp-content/uploads/sites/8/2023/07/how-to-push-code-to-github.jpg)


# Sistema de Gestión de Peliculas
## Descripción de la página web 🍿
Se trata de un sistema diseñado para ofrecer a los usuarios una experiencia completa y personalizada en la búsqueda y descubrimiento de películas, combinando información detallada sobre películas con funcionalidades de recomendación y búsqueda avanzada. Además, el sistema permite a los usuarios conocer la disponibilidad de las películas, indicando dónde y cuándo pueden disfrutarlas, ya sea desde la comodidad de su casa o bien en la gran pantalla.


## Funcionalidades de la página web 📌
- *Gestión de usuarios*: Registro, inicio de sesión, actualización de perfil, recuperación de contraseña, etc.
- *Gestión de películas*: Búsqueda, filtrado, detalles de películas, recomendaciones, listas de favoritos, calificaciones, comentarios, etc.
- *Gestión de salas*: Consulta de salas cercanas.
- *Administración*: Gestión de contenidos, obtener reportes, crear una nueva pelicula, eliminar un usuario, agregar una nueva plataforma, etc.

## Entidades y Relaciones
### Entidades 🖱️
- *Película*: Contiene información que es fundamental para la búsqueda y recomendación.
 - Atributos: id_pelicula, título, genero, año, director, actores, sinopsis, duración.
- *Usuario*: Contiene información del usuario, incluyendo su historial de visualización que será clave para las recomendaciones personalizadas.
 - Atributos: id_usuario, nombre, email, contrasenia, historial_visualizacion.
- *Horario*: Contiene los horarios de proyección en las salas de cine.
 - Atributos: id_horario, inicio, fin, duracion.
- *Sala_De_Cine*: Contiene la información geográfica de las salas.
 - Atributos: id_sala_de_cine, direccion.
- *Plataforma_Online*: Contiene el nombre de cada plataforma de streaming.
 - Atributos: id_plataforma_online, nombre.
- *Proyección*: Representa una instancia específica de una película en un lugar y horario determinado.
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
  - Endpoint: /usuarios
  - Método: POST
  - Cuerpo: nombre,email, contrasenia
  - Código de estado:
     - 201 Created: Si el usuario se crea correctamente.
     - 400 Bad Request: Si faltan datos o hay algún error de validación (por ejemplo, email ya existe).
     - 500 Internal Server Error: Si ocurre un error interno en el servidor.
   - Respuesta:
     * Respuesta exitosa (201 Created) *
     {
       "id": 123,
       "nombre": "John Doe",
       "email": "johndoe@example.com"
     }
    
     * Respuesta de error (400 Bad Request) *
     {
       "error": "El campo 'contraseña' es obligatorio"
     }

2. Iniciar sesión:
  - Endpoint: /usuarios/login
  - Método: POST
  - Cuerpo: email, contrasenia
  - Código de estado:
     - 200 OK: Si las credenciales son válidas y se genera un token de autenticación.
     - 401 Unauthorized: Si las credenciales son incorrectas.
     - 400 Bad Request: Si faltan datos o hay algún error de validación.
     - 500 Internal Server Error: Si ocurre un error interno en el servidor.
  - Respuesta:
    * Respuesta exitosa (200 OK) *
       {
         "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTYiLCJuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE1MTYyMzkwMjJ9.4fg63hI0ATyT2LrgwIljN5v6uQBFOk"
       }


    * Respuesta de error (401 Unauthorized) *
       {
         "error": "Credenciales inválidas"
    
       }
      
4. Cambiar contraseña:
  - Endpoint: /usuarios/cambiar-contrasenia
  - Método: PUT
  - Cuerpo: nuevo contraseña
  - Código de estado:
     - 200 OK: Contraseña actualizada.
     - 404 Not Found: Si no se encuentra el usuario con el email especificado.
     - 400 Bad Request: Si el formato del email es inválido.
     - 500 Internal Server Error: Si ocurre un error interno en el servidor.

5. Eliminar un Usuario
* Endpoint: /usuarios/email/:email
* Método: DELETE
* Parámetros:
email (en la URL): El correo electrónico del usuario que se desea eliminar.
* Código de Estado:
  * 200 OK: Se devuelve cuando el usuario ha sido eliminado exitosamente.
  * Mensaje: Usuario con email [email] eliminado.
  * 404 Not Found: Se devuelve si no se encuentra un usuario con el correo electrónico proporcionado.Mensaje: Usuario no encontrado.
  * 500 Internal Server Error: Se devuelve si ocurre un error en el servidor al intentar eliminar el usuario. Mensaje: Error en el servidor.

6. Actualizar el Plan de un Usuario
* Endpoint: /usuarios/email/:email
* Método: PUT
* Parámetros:
email (en la URL): El correo electrónico del usuario cuyo plan se desea actualizar.
* Cuerpo de la Solicitud:
Un objeto JSON que debe incluir:
planNuevo: El nuevo plan que se asignará al usuario.
* Código de Estado:
  * 200 OK: Se devuelve cuando el plan del usuario ha sido actualizado exitosamente.
  * 404 Not Found: Se devuelve si no se encuentra un usuario con el correo electrónico proporcionado.* 500 Internal Server Error: Se devuelve si ocurre un error en el servidor al intentar actualizar el plan del usuario.

7. Agregar una Película a Favoritos
* Endpoint: /usuarios/:correo/favoritos
* Método: POST
* Parámetros:
correo (en la URL): El correo electrónico del usuario que quiere agregar una película a favoritos.
* Código de Estado:
  * 200 OK: Se devuelve cuando la película se ha agregado exitosamente a la lista de favoritos.
  * 400 Bad Request: Se devuelve si la película ya está en la lista de favoritos.
  404 Not Found: Se devuelve si no se encuentra el usuario o la película especificada.
  * 500 Internal Server Error: Se devuelve si ocurre un error en el servidor al intentar agregar la película.

8. Obtener las Películas Favoritas de un Usuario
* Endpoint: /usuarios/:email/favoritos
* Método: GET
* Parámetros:
email (en la URL): El correo electrónico del usuario cuyas películas favoritas se desean obtener.
* Código de Estado:
  * 200 OK: Se devuelve una lista de las películas favoritas del usuario.
  * 404 Not Found: Se devuelve si no se encuentra el usuario.
  * 500 Internal Server Error: Se devuelve si ocurre un error en el servidor al intentar obtener las películas favoritas.

### Gestión de peliculas
1. Obtener detalles de una película:
   - Endpoint: /peliculas
   - Método: GET
   - Códigos de estado:
       - 200 OK: La película se encontró y se devolvieron sus detalles.
       - 500 Internal Server Error: Ocurrió un error interno en el servidor al intentar obtener los datos.
   - Respuesta:
     * Respuesta exitosa (200 OK) *
     {
       "id": 1,
       "titulo": "El Padrino",
       "genero": "Drama",
       "director": "Francis Ford Coppola",
       // ... otros campos
     }


2. Buscar una película por género:
   - Endpoint: /peliculas/genero/:genero
   - Método: GET
   - Códigos de estado:
       - 200 OK: Se encontró al menos una película del género especificado y se devolvió una lista.
       - 404 Not Found: No se encontraron películas del género especificado.
       - 500 Internal Server Error: Ocurrió un error interno en el servidor al realizar la búsqueda.
   - Respuesta:
     * Respuesta exitosa (200 OK) *
     [
       {
         "id": 1,
         "titulo": "El Padrino",
         "genero": "Drama"
       },
       {
         "id": 2,
         "titulo": "El bueno, el feo y el malo",
         "genero": "Western"
       }
     ]

2. Buscar una película por nombre:
   - Endpoint: /peliculas/genero/:nombre
   - Método: GET
   - Códigos de estado:
       - 200 OK: Se encontró la pelicula. 
       - 404 Not Found: No se encontró la pelicula.
       - 500 Internal Server Error: Ocurrió un error interno en el servidor al realizar la búsqueda.
   - Respuesta:
     * Respuesta exitosa (200 OK) *
       {
         "id": 1,
         "titulo": "El Padrino",
         "genero": "Drama"
       },
       
3. Actualizar una película por nombre:
* Endpoint: /peliculas/nombre/:nombre_pelicula
* Método: PUT
* Códigos de estado:
  * 200 OK: La película se actualizó exitosamente.
  * 404 Not Found: No se encontró la película con el nombre especificado.
  * 400 Bad Request: El género proporcionado no es válido.
  *500 Internal Server Error: Ocurrió un error interno en el servidor al intentar actualizar la película.
* Respuesta:
  * Respuesta exitosa (200 OK)
  * Respuesta de error (404 Not Found)
  * Respuesta de error (400 Bad Request)
  * Respuesta de error (500 Internal Server Error)

4. Agregar una película a la lista de favoritos de un usuario:
   - Endpoint: /API/Usuarios/{id}/favoritos
   - Método: POST
   - Cuerpo: id_pelicula
   - Códigos de estado:
       - 201 Created: La película se agregó correctamente a la lista de favoritos.
       - 404 Not Found: El usuario o la película no existen.
       - 400 Bad Request: La película ya está en la lista de favoritos.
       - 500 Internal Server Error: Ocurrió un error interno al agregar la película a la lista de favoritos.
   - Respuesta:
     * Respuesta exitosa (201 Created) *
     {
       "message": "Película agregada a favoritos"
     }

5. Calificar una película:
   - Endpoint: peliculas/{id}/calificar
   - Método: POST
   - Cuerpo: calificacion
   - Códigos de estado:
       - 200 OK: La calificación se registró correctamente.
       - 404 Not Found: La película no existe.
       - 400 Bad Request: La calificación no es válida (por ejemplo, fuera de rango).
       - 409 Conflict: El usuario ya ha calificado esta película.
       - 500 Internal Server Error: Ocurrió un error interno al registrar la calificación.
   - Respuesta:
     * Respuesta exitosa (200 OK) *
     {
       "message": "Calificación registrada"
     }

6. Registrar un comentario para una película:
* Endpoint: /peliculas/:id/comentarios
* Método: POST
* Códigos de estado:
  * 200 OK: El comentario se registró exitosamente.
  * 404 Not Found: La película con el ID especificado no existe.
  * 400 Bad Request: El comentario proporcionado está vacío.
  * 500 Internal Server Error: Ocurrió un error interno en el servidor al intentar registrar el comentario.
* Respuesta:
  * Respuesta exitosa (200 OK)
  * Respuesta de error (404 Not Found)
  * Respuesta de error (400 Bad Request)
  * Respuesta de error (500 Internal Server Error)

7. Obtener comentarios de una película por ID:
* Endpoint: /peliculas/:id/comentarios
* Método: GET
* Códigos de estado:
  * 200 OK: Se encontraron los comentarios para la película especificada.
  * 404 Not Found: No se encontraron comentarios para la película especificada.
  * 500 Internal Server Error: Ocurrió un error interno en el servidor al realizar la consulta.
* Respuesta:
  * Respuesta exitosa (200 OK)
  * Respuesta de error (404 Not Found)
  * Respuesta de error (400 Bad Request)
  * Respuesta de error (500 Internal Server Error)

8. Obtener recomendaciones de una película:
   - Endpoint: /API/Peliculas/recomendaciones
   - Método: GET
   - Códigos de estado:
       - 200 OK: Se devolvió una lista de películas recomendadas.
       - 404 Not Found: No se encontraron recomendaciones.
       - 500 Internal Server Error: Ocurrió un error interno al generar las recomendaciones.
   - Respuesta:
     * Respuesta exitosa (200 OK) *
     [
       {
         "id": 3,
         "titulo": "Pulp Fiction",
         "genero": "Crimen"
       },
       // ... otras recomendaciones
     ]
    
9. Agregar una nueva Película:
* Endpoint: /peliculas
* Método: POST
* Autenticación: authenticateJWT (requiere que el usuario esté autenticado)
* Codigo de estado:
  *200 OK: Pelicula agregada.
  *500: Ocurrio un error en el servidor.

10. Eliminar una nueva Película:
* Endpoint: /peliculas/nombre/:nombre_pelicula
* Método: DELETE
* Autenticación: authenticateJWT (requiere que el usuario esté autenticado)
* Codigo de estado:
  *200 OK: Pelicula agregada.
  *500: Ocurrio un error en el servidor.
* Respuesta:
  * Respuesta exitosa (200 OK)
  * Respuesta de error (500 Internal Server Error)

11. Obtener Disponibilidad de una Película:
* Endpoint: /peliculas/:id/disponibilidad
* Método: GET
* Códigos de estado:
  * 200 OK: Se encontraron los disponibilidades para la película especificada.
  * 404 Not Found: No se encontraron peliculas.
  * 500 Internal Server Error: Ocurrió un error interno en el servidor al realizar la consulta.
* Respuesta:
  * Respuesta exitosa (200 OK)
  * Respuesta de error (404 Not Found)
  * Respuesta de error (400 Bad Request)
  * Respuesta de error (500 Internal Server Error)

### Gestión de plataformas online
1. Obtener la Lista de Plataformas
* Endpoint: /plataformas
* Método: GET
* Código de Estado:
  * 200 OK: Se devuelve exitosamente la lista de plataformas.
  * 500 Internal Server Error: Se devuelve si ocurre un error en el servidor al intentar obtener la lista de plataformas.

2. Agregar una Nueva Plataforma
* Endpoint: /plataformas
* Método: POST
* Código de Estado:
  * 201 Created: Se devuelve cuando la plataforma ha sido agregada exitosamente.
  * 400 Bad Request: Se devuelve si el nombre de la plataforma no ha sido proporcionado.
  * 500 Internal Server Error: Se devuelve si ocurre un error en el servidor al intentar agregar la plataforma.

3. Eliminar una Plataforma Online
* Endpoint: /plataformas
* Método: DELETE
* Códigos de Estado:
  * 200 OK: Plataforma eliminada exitosamente.
  * 400 Bad Request: Falta el nombre de la plataforma en la solicitud.
  * 404 Not Found: No se encontró la plataforma especificada en la base de datos.
  * 500 Internal Server Error: Error en el servidor durante la operación de eliminación.


4. Obtener la Lista de Plataformas Online
* Endpoint: /plataformas
* Método: GET
* Código de Estado:
  * 200 OK: Se devuelve cuando se obtiene exitosamente la lista de plataformas online.
  * 500 Internal Server Error: Se devuelve si ocurre un error en el servidor al intentar obtener las plataformas.

### Gestión de salas de cine 
1. Obtener Salas de Cine:
* Endpoint: /salas
* Método: GET
* Códigos de estado:
  * 200 OK: Se encontraron los salas de cine.
  * 500 Internal Server Error: Ocurrió un error interno en el servidor al realizar la consulta.
* Respuesta:
  * Respuesta exitosa (200 OK)
  * Respuesta de error (500 Internal Server Error)

2. Agregar una sala de cine:
* Endpoint: /salas
* Método: POST
* Codigo de estado:
  *200 OK: Sala de cine agregada.
  *500: Ocurrio un error en el servidor.
* Respuesta:
  * Respuesta exitosa (200 OK)
  * Respuesta de error (500 Internal Server Error)

3. Eliminar una sala de cine:
* Endpoint: /salas
* Método: DELETE
* Codigo de estado:
  *200 OK: Sala de cine eliminada.
  *500: Ocurrio un error en el servidor.
* Respuesta:
  * Respuesta exitosa (200 OK)
  * Respuesta de error (500 Internal Server Error)

4. Obtener salas de cine cercanas
* Endpoint: /salasCercanas
* Método: POST
* Codigo de estado:
  *200 OK: Sala de cine encontrada.
  *500: Ocurrio un error en el servidor.
* Respuesta:
  * 200 OK: Devuelve un array de objetos que representan las salas de cine cercanas.
  * 500 Internal Server Error: Si ocurre un error al procesar la solicitud.
          
## Diseño de la Página Web 🚀
La página web podría tener las siguientes secciones:
- *Página de inicio*: Con un buscador destacado, recomendaciones personalizadas y una sección de peliculas destacadas del año.
- *Perfil de usuario*: Donde el usuario puede gestionar su lista de favoritos.
- *Detalle de película*: Una página dedicada a cada película con toda la información relevante, comentarios y opciones para verla.
- *Explorar*: Secciones para explorar películas por género, actor, disponibilidad en plataformas  o salas de cine.
- *Listados*: Donde los usuarios pueden ver sus listas personalizadas y crear nuevas.


## Consideraciones Adicionales
- Integración con APIs de terceros: Para obtener información de latitudes y longitudes de la ubicación de las salas de cine y del usuario. 