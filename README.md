# NestJS Tasks Management API

API RESTful de gestión de tareas construida con NestJS, Prisma v5 y PostgreSQL.

---

## Requisitos del Sistema

| Herramienta | Versión mínima | Obligatorio para |
|-------------|----------------|-----------------|
| Node.js     | v18.x          | Inicio manual    |
| npm         | v9.x           | Inicio manual    |
| PostgreSQL  | v13.x          | Inicio manual    |
| Docker      | v24.x          | Inicio con Docker |
| Docker Compose | v2.x        | Inicio con Docker |

---

## Formas de Iniciar el Proyecto

Este proyecto soporta tres modalidades de inicio según el entorno disponible:

- **Opción A:** Docker (Windows / macOS / Linux — sin instalar Node ni Postgres localmente)
- **Opción B:** Manual en Windows
- **Opción C:** Manual en Linux / macOS

---

## Opción A: Docker (Recomendado)

Levanta PostgreSQL y la API automáticamente, sin configuración adicional.

### 1. Instalar Docker

**Windows y macOS — Docker Desktop:**

Descarga el instalador desde:
- Windows: https://docs.docker.com/desktop/setup/install/windows-install/
- macOS: https://docs.docker.com/desktop/setup/install/mac-install/

Ejecuta el instalador, acepta los términos y espera a que el motor inicie (ícono de ballena activo en la barra de tareas).

**Linux — Docker Engine + Compose Plugin (sin interfaz gráfica):**

```bash
# Instala Docker Engine
curl -fsSL https://get.docker.com | sh

# Agrega tu usuario al grupo docker
sudo usermod -aG docker $USER && newgrp docker

# Instala el plugin Compose
sudo apt install docker-compose-plugin    # Ubuntu/Debian
sudo dnf install docker-compose-plugin   # Fedora/RHEL
```

**Verificar instalación:**

```bash
docker --version
docker compose version
```

### 2. Clonar el repositorio

```bash
git clone https://github.com/estebanlizama/nestjs-backend-test.git
cd nestjs-backend-test
```

### 3. Levantar el entorno

```bash
docker compose up --build
```

Esto ejecuta automáticamente:
- Descarga PostgreSQL 15
- Construye la imagen de la API desde el `Dockerfile`
- Espera a que Postgres esté listo (healthcheck)
- Ejecuta `npx prisma db push` para crear las tablas
- Inicia NestJS en modo watch en el puerto `3001`

La API queda disponible en: `http://localhost:3001`

> Las credenciales de la base de datos vienen preconfiguradas en `docker-compose.yml`. No se requiere archivo `.env`.

### 4. Comandos útiles con Docker

```bash
# Ver logs de la API en tiempo real
docker compose logs -f app

# Detener los servicios
docker compose down

# Detener y eliminar datos de la base de datos
docker compose down -v

# Reconstruir la imagen desde cero
docker compose build --no-cache && docker compose up
```

---

## Opción B: Manual en Windows

### 1. Instalar Node.js

Descarga el instalador LTS desde https://nodejs.org/ (v18 o superior).

Verifica la instalación en PowerShell o CMD:
```cmd
node --version
npm --version
```

### 2. Instalar PostgreSQL

Descarga el instalador desde https://www.postgresql.org/download/windows/

Durante la instalación:
- Puerto por defecto: `5432`
- Usuario por defecto: `postgres`
- Elige y guarda la contraseña que configures

Crea la base de datos desde pgAdmin o CMD:
```cmd
psql -U postgres -c "CREATE DATABASE test_tasks;"
```

### 3. Clonar e instalar dependencias

```cmd
git clone https://github.com/estebanlizama/nestjs-backend-test.git
cd nestjs-backend-test
npm install
```

### 4. Configurar variables de entorno

Copia el archivo de ejemplo:
```cmd
Copy-Item .env.example .env
```

Edita `.env` con tus datos:
```env
DATABASE_URL="postgresql://postgres:TU_CONTRASENA@localhost:5432/test_tasks?schema=public"
PORT=3001
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:5173"
```

### 5. Sincronizar la base de datos y levantar

```cmd
npx prisma generate
npx prisma db push
npm run start:dev
```

---

## Opción C: Manual en Linux / macOS

### 1. Instalar Node.js (via nvm — recomendado)

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc   # o source ~/.zshrc en macOS
nvm install 22
nvm use 22
node --version
```

### 2. Instalar PostgreSQL

**Ubuntu/Debian:**
```bash
sudo apt update && sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**macOS (Homebrew):**
```bash
brew install postgresql@15
brew services start postgresql@15
```

Crea la base de datos:
```bash
sudo -u postgres psql -c "CREATE DATABASE test_tasks;"
```

### 3. Clonar e instalar dependencias

```bash
git clone https://github.com/estebanlizama/nestjs-backend-test.git
cd nestjs-backend-test
npm install
```

### 4. Configurar variables de entorno

```bash
cp .env.example .env
nano .env   # o el editor de tu preferencia
```

Actualiza con tus credenciales:
```env
DATABASE_URL="postgresql://postgres:TU_CONTRASENA@localhost:5432/test_tasks?schema=public"
PORT=3001
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:5173"
```

### 5. Sincronizar la base de datos y levantar

```bash
npx prisma generate
npx prisma db push
npm run start:dev
```

---

## Scripts Disponibles

```bash
npm run start:dev    # Desarrollo con hot-reload
npm run build        # Compilar para producción
npm run start:prod   # Ejecutar build de producción
npm run test         # Correr tests unitarios (Jest)
npm run test:cov     # Tests con reporte de cobertura
```

---

## Probando la API

Este proyecto ofrece dos formas de probar los endpoints.

### Opción 1 — Swagger UI (Recomendado)

Se integró Swagger (`@nestjs/swagger`) para ofrecer documentación interactiva auto-generada desde el código. Permite explorar y ejecutar todos los endpoints directamente desde el navegador sin instalar ninguna herramienta adicional.

**En local** (con `npm run start:dev` o Docker):
```
http://localhost:3001/api/docs
```

**En producción** (desplegado en Render):
```
https://nestjs-backend-test-q07s.onrender.com/api/docs
```

> El despliegue en Render se realizó para facilitar la evaluación del sistema sin requerir configuración local. La base de datos PostgreSQL también está en Render.

### Opción 2 — Postman / Insomnia

Apunta las peticiones a cualquiera de las dos bases:
- Local: `http://localhost:3001`
- Producción: `https://nestjs-backend-test-q07s.onrender.com`

---

## Referencia de Endpoints

Base URL local: `http://localhost:3001`

Base URL producción: `https://nestjs-backend-test-q07s.onrender.com`

### POST `/tasks` — Crear tarea

| Campo       | Tipo   | Requerido | Descripción                     |
|-------------|--------|-----------|----------------------------------|
| title       | string | Sí        | Mínimo 3, máximo 150 caracteres |
| description | string | Sí        | Máximo 500 caracteres           |
| status      | enum   | No        | Default: `PENDING`              |
| priority    | enum   | No        | Default: `MEDIUM`               |

```json
{
  "title": "Implementar autenticación JWT",
  "description": "Agregar guards y estrategia passport-jwt",
  "status": "PENDING",
  "priority": "HIGH"
}
```

Respuestas: `201 Created` | `400 Bad Request`

### GET `/tasks` — Listar tareas

| Query param | Ejemplo                              |
|-------------|--------------------------------------|
| status      | `?status=PENDING`                    |
| priority    | `?priority=HIGH`                     |
| Ambos       | `?status=IN_PROGRESS&priority=LOW`   |

Respuestas: `200 OK`

### GET `/tasks/:id` — Obtener tarea

Respuestas: `200 OK` | `404 Not Found`

### PATCH `/tasks/:id` — Actualizar tarea (parcial)

Todos los campos opcionales: `title`, `description`, `status`, `priority`.

Respuestas: `200 OK` | `404 Not Found`

### PATCH `/tasks/:id/status` — Cambiar estado

```json
{ "status": "IN_PROGRESS" }
```

Respuestas: `200 OK` | `404 Not Found` | `400 Bad Request`

### DELETE `/tasks/:id` — Eliminar tarea

Respuestas: `200 OK` | `404 Not Found`

---

## Estructura del Proyecto

```
src/
├── common/
│   └── filters/
│       └── http-exception.filter.ts    # Filtro global: mapea errores Prisma a HTTP
├── prisma/
│   ├── prisma.module.ts
│   └── prisma.service.ts               # Extiende PrismaClient, inyectable globalmente
├── tasks/
│   ├── controllers/
│   │   └── tasks.controller.ts         # HTTP: recibe params/body, delega al service
│   ├── services/
│   │   └── tasks.service.ts            # Business logic: validaciones y reglas de negocio
│   ├── repositories/
│   │   └── tasks.repository.ts         # Data layer: todas las operaciones Prisma
│   ├── dto/
│   │   ├── create-task.dto.ts
│   │   ├── update-task.dto.ts
│   │   ├── update-task-status.dto.ts
│   │   └── get-tasks-filter.dto.ts
│   └── tasks.module.ts
└── main.ts                             # Bootstrap, ValidationPipe global, CORS
prisma/
└── schema.prisma                       # Modelo Task, enums TaskStatus y TaskPriority
```

**Responsabilidades por capa:**

| Capa | Responsabilidad |
|------|----------------|
| `Controller` | Recibe la request HTTP, extrae body/params y retorna la respuesta |
| `Service` | Contiene la lógica de negocio y lanza excepciones NestJS (`NotFoundException`) |
| `Repository` | Ejecuta las queries Prisma. Retorna `Task | null`, sin lanzar excepciones |

---

## Documentación Técnica

- `answers.md` — Respuestas a preguntas teóricas de NestJS y backend
- `architecture.md` — Análisis de código y decisiones arquitectónicas
