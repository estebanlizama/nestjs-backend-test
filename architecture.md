# Arquitectura

## Parte 2 - Análisis y Debugging
Código a analizar:
```bash
@Injectable()
export class OrdersService {

private orders = [];
create(order) {
this.orders.push(order);
return order;
}
findAll() {
return this.orders;
}
updateStatus(id, status) {
const order = this.orders.find(o => o.id === id);
order.status = status;
return order;
}
}
```
### 1. Identifique al menos 5 problemas de arquitectura o diseño.

El primer problema arquitectónico evidente en el código es el incumplimiento del Principio de Responsabilidad Única (SRP). La clase `OrdersService` está intentando almacenar y manipular los datos temporalmente administrando el estado de la aplicación mediante un arreglo privado (`private orders = []`), algo que corresponde enteramente a la capa de base de datos. Por ejemplo, este diseño provoca que toda la información enviada mediante el método `create` se pierda inmediatamente en caso de que el servidor deba reiniciarse.

En segundo lugar, se incumple la regla del Tipado Estricto de TypeScript en múltiples niveles. Las variables de entrada como `order`, `id` o `status` en los tres métodos ilustrados carecen de tipos explícitos, lo que anula la capacidad del lenguaje para prevenir errores en tiempo de desarrollo. Por ejemplo, el sistema no puede saber si el parámetro `order` que entra a la creación es realmente un objeto válido o si `status` corresponde a un simple string.

El tercer fallo radica en la falta de Validación Temprana o Early Return. El método `updateStatus` asume ciegamente que la búsqueda del registro (`find`) será siempre exitosa y agrupa directamente su sobreescritura sobre el objeto. Validando preventivamente la existencia negada, evitaríamos que el código colapse estrepitosamente. Por ejemplo, arrojando al usuario un error generalizado (`Cannot read properties of undefined`) en lugar de detener el intento limpiamente al inicio del método.

El cuarto problema clave es la falta explícita de uso de excepciones nativas de NestJS para manejar fallos lógicos. En vez de mutar variables ciegamente dentro de `updateStatus`, el servicio debería enviar de inmediato una `NotFoundException` oficial para rechazar el intento si el `id` no pertenece a ninguna orden. Por ejemplo, sin aplicar estos estándares globales, el controlador receptor del servicio obtendrá respuestas en blanco o bloqueos completos impidiendo su procesamiento genérico.

Un último problema crítico es la mutabilidad engañosa. El método `findAll()` retorna directamente la referencia en memoria del arreglo original en lugar de arrojar una copia limpia desvinculada. Esto significa que si cualquier agente intermedio consume la lectura y accidentalmente adultera el arreglo resultante, de facto corromperá la base de datos subyacente de `OrdersService`. Por ejemplo, si un controlador ordena localmente de menor a mayor la variable resultado de `findAll()`, modificará inherentemente el vector `private orders` de por vida.

### 2. Explique cómo refactorizaría esta implementación en un proyecto real de NestJS.

Mi primer paso sería respetar el Principio de Inversión de Dependencias (DIP) inyectando a través del constructor del `OrdersService` un cliente de conexión base de datos, abandonando completamente el uso inmaduro de variables en memoria como arreglo privado en TypeScript para resguardar órdenes. Por ejemplo, declarando inyección privativa de `PrismaService` para delegar y vincular el historial de todas nuestras compras directo al motor asíncrono PostgreSQL.

Seguido a esto, tiparía la totalidad del flujo definiendo objetos abstractos de transferencia (DTO) que aseguren la estructura estricta de variables en tiempo de ejecución de las firmas previendo la intromisión genérica. Por ejemplo, insertando validadores generales que exijan las propiedades `title` o `price` enmarcadas en `CreateOrderDto` y tipando como identificador estricto explícito al parámetro numérico o cadena de texto `id` necesario en el método `updateStatus`.

Basándome estructuralmente en los estándares de codificación limpia que he implementado en otros proyectos, aplicaría un esquema preventivo obligatorio actualizando la búsqueda con herramientas nativas. Revisaría con un `findUnique()` inicial la existencia base de la tupla requerida despachando una excepción `NotFoundException("Order no encontrada")` si tal registro retornara lógicamente nulo. Por ejemplo, además de esto, obligaría que solo los sujetos dueños referenciados internamente logren incidir validando estrictamente este lazo cruzado evitando adulteraciones fraudulentas a perfiles ajenos (Ownership Validation).


## Parte 4 - Diseño de Arquitectura

### 1. ¿Cómo escalaría esta API para soportar 1000 requests por segundo?

Para escalar la API a 1000 requests por segundo implementaría escalamiento horizontal ejecutando múltiples instancias de la aplicación detrás de un load balancer. Esto permite distribuir el tráfico entre diferentes nodos. Además optimizaría la base de datos agregando índices en columnas frecuentemente consultadas como status y priority. También incorporaría una capa de caché usando Redis para evitar consultas repetidas a la base de datos y mejorar el tiempo de respuesta.

### 2. ¿Qué cambios haría si el sistema creciera a millones de tareas?

Si el sistema creciera a millones de tareas, implementaría paginación obligatoria en los endpoints para evitar cargar grandes volúmenes de datos en memoria. También optimizaría las consultas usando proyecciones para traer solo los campos necesarios desde la base de datos. A nivel de infraestructura podría agregar índices en las columnas más consultadas y usar read replicas en PostgreSQL para distribuir la carga de lectura.


### 3. ¿Cómo implementaría autenticación JWT en este sistema?

Implementaría autenticación JWT utilizando el módulo @nestjs/jwt junto con passport-jwt. El flujo sería que el usuario se autentique mediante un endpoint de login, el servidor valide sus credenciales y genere un token JWT firmado. Luego cada request incluiría el token en el header Authorization: Bearer. En NestJS protegería los endpoints usando AuthGuard('jwt'), que valida el token antes de permitir el acceso al recurso. Esto tambien se ve involucrado en el manejo de roles y permisos mediante el uso de Guards y interceptores.


### 4. ¿Cómo manejaría procesamiento asincrónico para tareas pesadas?

Para tareas pesadas implementaría un sistema de colas de trabajos usando BullMQ junto con Redis. El flujo sería que el endpoint de la API en lugar de procesar la tarea directamente la encola en BullMQ. Luego un worker separado consume las tareas de la cola y las procesa de forma asíncrona. Esto mantiene la API responsiva y maneja cargas pesadas sin bloquear el hilo principal.