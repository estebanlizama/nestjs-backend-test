# 🚀 NestJS Tasks Management API (Senior Backend Test)

Esta es una API RESTful para la gestión de tareas construida con **NestJS** y **PostgreSQL** mediante **Prisma v5**, cumpliendo con todos los requisitos técnicos en la evaluación de Backend Senior.

## 🛠 Requisitos Previos
- [Node.js](https://nodejs.org/en) (v18 o superior recomendado).
- [PostgreSQL](https://www.postgresql.org/) corriendo localmente (o disponer de una URL alojada).
- npm, yarn o pnpm.

## ⚙️ Configuración del Entorno y Base de Datos

1. Clona el repositorio y abre la carpeta del proyecto en tu terminal.
2. Instala las dependencias:
```bash
npm install
```

3. Modifica tus variables de entorno para apuntar a la base de datos real. Renombra (o copia) el archivo `.env.example` a `.env` y asegúrate de actualizar `DATABASE_URL` con tus credenciales locales de postgres y la base de datos (por defecto llamada `test_tasks`):

```bash
DATABASE_URL="postgresql://postgres:TU_CONTRASENA@localhost:5432/test_tasks?schema=public"
PORT=3000
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:5173"
```

4. Ejecuta el comando para que Prisma sincronice los esquemas y cree las tablas en tu base de datos:
```bash
npx prisma db push
```

## 🚀 Ejecución del Proyecto

Una vez que la base de datos y las variables estén listas, puedes levantar la aplicación.

```bash
# Desarrollo (Modo Watch)
$ npm run start:dev

# Producción
$ npm run build
$ npm run start:prod
```
La aplicación correrá en `http://localhost:3000` (o el puerto configurado).

## 🧪 Pruebas (Instrucciones)

Este proyecto incluye tests unitarios para los Servicios y Controladores utilizando **Jest**, simulando e inyectando `PrismaService`.

```bash
# Correr tests unitarios
$ npm run test
```

## 📝 Documentación de Endpoints

Endpoints activos para la entidad `Task` (`/tasks`):

| Method | Endpoint | Description |
|--------|----------|-------------|
| **POST** | `/tasks` | Crea una nueva tarea. |
| **GET** | `/tasks` | Obtiene TODAS las tareas. Soporta query parameters `?status=` y `?priority=`. |
| **GET** | `/tasks/:id` | Obtiene una sola tarea según su id. |
| **PATCH** | `/tasks/:id` | Modifica cualquier valor permitido de una tarea (UpdateTaskDto). |
| **PATCH**| `/tasks/:id/status`| Modifica *únicamente* el status (UpdateTaskStatusDto). |
| **DELETE**| `/tasks/:id` | Elimina una tarea mediante su id. |
