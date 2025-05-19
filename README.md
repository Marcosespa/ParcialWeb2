
## Endpoints

### Actividad

#### Crear Actividad
```http
POST /actividad
```

**Request Body:**
```json
{
    "titulo": "Taller de Programación",
    "fecha": "2024-03-20",
    "cupomax": 30,
    "estado": 1
}
```

**Respuesta Exitosa (201 Created):**
```json
{
    "id": 1,
    "titulo": "Taller de Programación",
    "fecha": "2024-03-20",
    "cupomax": 30,
    "estado": 1
}
```

**Respuesta Error (400 Bad Request):**
```json
{
    "message": "No cumple requetimientos",
    "error": "Bad Request",
    "statusCode": 400
}
```

#### Cambiar Estado de Actividad
```http
PUT /actividad/:id/estado/:estado
```

**Parámetros:**
- `id`: ID de la actividad
- `estado`: Nuevo estado (0: abierta, 1: cerrada, 2: finalizada)

**Respuesta Exitosa (200 OK):**
```json
{
    "id": 1,
    "titulo": "Taller de Programación",
    "fecha": "2024-03-20",
    "cupomax": 30,
    "estado": 2
}
```

**Respuesta Error (400 Bad Request):**
```json
{
    "message": "no se puede cerrar la actividad",
    "error": "Bad Request",
    "statusCode": 400
}
```

#### Obtener Actividades por Fecha
```http
GET /actividad/fecha/:fecha
```

**Parámetros:**
- `fecha`: Fecha en formato YYYY-MM-DD

**Respuesta Exitosa (200 OK):**
```json
[
    {
        "id": 1,
        "titulo": "Taller de Programación",
        "fecha": "2024-03-20",
        "cupomax": 30,
        "estado": 1
    }
]
```

### Estudiante

#### Crear Estudiante
```http
POST /estudiante
```

**Request Body:**
```json
{
    "cedula": 1234567890,
    "nombre": "Juan Pérez",
    "correo": "juan.perez@example.com",
    "programa": "Ingeniería de Sistemas",
    "semestre": 5
}
```

**Respuesta Exitosa (201 Created):**
```json
{
    "id": 1,
    "cedula": 1234567890,
    "nombre": "Juan Pérez",
    "correo": "juan.perez@example.com",
    "programa": "Ingeniería de Sistemas",
    "semestre": 5
}
```

#### Obtener Estudiante por ID
```http
GET /estudiante/:id
```

**Respuesta Exitosa (200 OK):**
```json
{
    "id": 1,
    "cedula": 1234567890,
    "nombre": "Juan Pérez",
    "correo": "juan.perez@example.com",
    "programa": "Ingeniería de Sistemas",
    "semestre": 5
}
```

#### Inscribirse en Actividad
```http
POST /estudiante/:estudianteId/actividad/:actividadId
```

**Respuesta Exitosa (201 Created):**
```json
{}
```

### Reseña

#### Agregar Reseña
```http
POST /resena/:estudianteId/actividad/:actividadId
```

**Request Body:**
```json
{
    "comentario": "Excelente actividad, muy bien organizada",
    "calificacion": 5,
    "fecha": "2024-03-20"
}
```

**Respuesta Exitosa (201 Created):**
```json
{}
```

**Respuesta Error (400 Bad Request):**
```json
{
    "message": "actividad no finalizada",
    "error": "Bad Request",
    "statusCode": 400
}
```

## Códigos de Estado

- `200 OK`: La petición se ha completado con éxito
- `201 Created`: El recurso se ha creado con éxito
- `400 Bad Request`: La petición es inválida
- `404 Not Found`: El recurso no se encuentra

## Ejemplos de Uso

### Flujo Completo

1. Crear una actividad:
```http
POST /actividad
{
    "titulo": "Taller de Programación",
    "fecha": "2024-03-20",
    "cupomax": 30,
    "estado": 0
}
```

2. Crear un estudiante:
```http
POST /estudiante
{
    "cedula": 1234567890,
    "nombre": "Juan Pérez",
    "correo": "juan.perez@example.com",
    "programa": "Ingeniería de Sistemas",
    "semestre": 5
}
```

3. Inscribir estudiante en la actividad:
```http
POST /estudiante/1/actividad/1
```

4. Cambiar estado de la actividad a finalizada:
```http
PUT /actividad/1/estado/2
```

5. Agregar reseña:
```http
POST /resena/1/actividad/1
{
    "comentario": "Excelente actividad",
    "calificacion": 5,
    "fecha": "2024-03-20"
}
```
