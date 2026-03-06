# NestJS Tasks Management API (Senior Backend Test)

Esta es una API RESTful para la gestión de tareas construida con NestJS y PostgreSQL mediante Prisma v5, cumpliendo con todos los requisitos técnicos en la evaluación de Backend Senior.

---

## Requisitos Previos

Antes de comenzar, asegúrate de tener instaladas las siguientes herramientas en tu sistema:

| Herramienta | Versión mínima recomendada | Notas |
|-------------|---------------------------|-------|
| Node.js     | v18.x o superior          | Probado con v22.12.0. Descargar desde https://nodejs.org |
| npm         | v9.x o superior           | Incluido con Node.js. Probado con 10.9.0 |
| PostgreSQL  | v13 o superior            | Debe correr localmente en el puerto 5432 por defecto |

Para verificar tus versiones instaladas ejecuta:
```bash
node --version
npm --version
```

---

## Instalación Paso a Paso

### 1. Clonar el repositorio

```bash
git clone https://github.com/estebanlizama/nestjs-backend-test.git
cd nestjs-backend-test
```

### 2. Instalar dependencias del proyecto

El proyecto utiliza NestJS como framework principal. Todas las dependencias incluyendo el CLI de Prisma y el cliente `@prisma/client` se instalan automáticamente con:

```bash
npm install
```

Esto instalará entre otras dependencias clave:
- `@nestjs/core`, `@nestjs/common`, `@nestjs/platform-express` — Framework NestJS
- `prisma@5.10.2` — CLI de Prisma para migraciones y generación de cliente
- `@prisma/client@5.10.2` — Cliente Prisma para interactuar con PostgreSQL
- `class-validator` y `class-transformer` — Validación de DTOs

> Nota: Este proyecto usa Prisma v5 intencionalmente por compatibilidad con la configuración de TypeScript del test. Evita actualizar a v6 o v7 sin revisar la compatibilidad.

### 3. Configurar variables de entorno

Copia el archivo de ejemplo `.env.example` a `.env`:

```bash
# En Windows (PowerShell)
Copy-Item .env.example .env

# En Linux / macOS
cp .env.example .env
```

Luego edita el archivo `.env` con tus credenciales reales de PostgreSQL:

```env
# URL de conexión a tu base de datos PostgreSQL local
# Formato: postgresql://USUARIO:CONTRASENA@HOST:PUERTO/NOMBRE_DB?schema=public
DATABASE_URL="postgresql://postgres:TU_CONTRASENA@localhost:5432/test_tasks?schema=public"

# Puerto en el que correrá la aplicación NestJS
PORT=3001

# Orígenes permitidos para CORS (separados por coma)
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:5173"
```

> Asegúrate de que la base de datos `test_tasks` exista en tu PostgreSQL local. Puedes crearla ejecutando en psql: `CREATE DATABASE test_tasks;`

### 4. Generar el cliente Prisma

Cada vez que se instalen las dependencias o se modifique el schema, regenera el cliente de Prisma:

```bash
npx prisma generate
```

### 5. Sincronizar el schema con la base de datos

Ejecuta el siguiente comando para que Prisma cree automáticamente todas las tablas definidas en `prisma/schema.prisma`:

```bash
npx prisma db push
```

Este comando crea la tabla `Task` con todos sus campos y enums (`TaskStatus`, `TaskPriority`) en tu base de datos. No requiere archivos de migración.

Para verificar que las tablas se crearon correctamente, puedes usar el explorador visual de Prisma:

```bash
npx prisma studio
```

---

## Ejecución del Proyecto

Una vez que la base de datos y las variables de entorno estén configuradas, levanta la aplicación.

```bash
# Modo desarrollo con hot-reload (recomendado durante desarrollo)
npm run start:dev

# Modo producción
npm run build
npm run start:prod
```

La aplicación estará disponible en: `http://localhost:3001` (según el `PORT` configurado).

---

## Pruebas Unitarias

El proyecto incluye tests unitarios para `TasksService` y `TasksController` usando Jest con mocks de PrismaService:

```bash
# Correr todos los tests unitarios
npm run test

# Correr en modo watch (re-ejecuta al guardar)
npm run test:watch

# Ver cobertura de código
npm run test:cov
```

---

## Documentación de Endpoints

Base URL: `http://localhost:3001`

| Method   | Endpoint              | Descripción                                                                 |
|----------|-----------------------|-----------------------------------------------------------------------------|
| POST     | `/tasks`              | Crea una nueva tarea. Requiere `title` en el body.                          |
| GET      | `/tasks`              | Obtiene todas las tareas. Acepta `?status=` y `?priority=` como filtros.    |
| GET      | `/tasks/:id`          | Obtiene una tarea específica por su ID.                                     |
| PATCH    | `/tasks/:id`          | Actualiza cualquier campo permitido de la tarea (UpdateTaskDto).            |
| PATCH    | `/tasks/:id/status`   | Actualiza únicamente el campo `status` de la tarea (UpdateTaskStatusDto).   |
| DELETE   | `/tasks/:id`          | Elimina una tarea por su ID.                                                |

### Valores válidos para enums

**TaskStatus:** `PENDING`, `IN_PROGRESS`, `DONE`

**TaskPriority:** `LOW`, `MEDIUM`, `HIGH`

### Ejemplo de body para POST `/tasks`

```json
{
  "title": "Implementar autenticación JWT",
  "description": "Agregar guards y estrategia passport-jwt",
  "status": "PENDING",
  "priority": "HIGH"
}
```

---

## Estructura del Proyecto

```
src/
├── common/
│   └── filters/
│       └── http-exception.filter.ts   # Filtro global de errores HTTP
├── prisma/
│   ├── prisma.module.ts               # Módulo global de Prisma
│   └── prisma.service.ts              # Servicio que extiende PrismaClient
├── tasks/
│   ├── controllers/
│   │   └── tasks.controller.ts        # Endpoints REST de Tasks
│   ├── dto/
│   │   ├── create-task.dto.ts
│   │   ├── update-task.dto.ts
│   │   ├── get-tasks-filter.dto.ts
│   │   └── update-task-status.dto.ts
│   ├── services/
│   │   └── tasks.service.ts           # Lógica de negocio e interacción con Prisma
│   └── tasks.module.ts
├── app.module.ts
└── main.ts                            # Punto de entrada, configuración global
prisma/
└── schema.prisma                      # Definición del modelo Task y enums
```

---

## Documentación Técnica

Las respuestas a las preguntas teóricas y el análisis de código del test se encuentran en:
- `answers.md` — Preguntas teóricas sobre NestJS y backend
- `architecture.md` — Análisis de código y preguntas de arquitectura
