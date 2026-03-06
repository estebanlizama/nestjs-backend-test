# Respuestas Teóricas

## Parte 1 - Preguntas Teóricas

### 1. Explique la diferencia entre Middleware, Guard, Interceptor y Pipe en NestJS.

El Middleware es lo primero que se ejecuta y es ideal para tareas genéricas de la aplicación, como registrar logs o manipular cabeceras HTTP antes de que NestJS enrute la petición. También se puede usar para interceptar y modificar la petición antes de que llegue al controlador como por ejemplo para validar que el usuario tenga permiso para acceder a una ruta temporal.

El Guard se ejecuta justo después del middleware y su única responsabilidad es determinar si la petición debe continuar hacia el controlador. Es el mecanismo principal y recomendado para implementar la autorización. Por ejemplo, un guard puede verificar que el usuario posea un token válido antes de permitir que el controlador procese orgánicamente el requerimiento enviado al proyecto.

El Interceptor se ejecuta antes y después del controlador. Su principal utilidad radica en poder mutar la respuesta final que va dirigida hacia el cliente, medir el tiempo total de ejecución entre ambos polos e implementar capas internas de retención agilizando las respuestas. Por ejemplo, un interceptor se vuelve excepcional cuando precisamos atrapar e igualar estructuras generales de envío sobre toda una gama gigantesca de controladores paralelos y dispersos.

El Pipe opera directamente sobre los argumentos que recibe el controlador. Su función central es transformar datos entrantes orgánicos de la solicitud, y principalmente validar a detalle y con rigor absoluto que la información cumpla sin lugar a cuestionamiento con contratos previos. Por ejemplo, un pipe puede prevenir agresivamente que información maliciosa acceda podando características inválidas del componente con listas blancas de ingreso al sistema.


### 2. ¿Cómo implementaría autorización basada en roles?

Para implementar autorización por roles, utilizaría un principio abierto combinando Guards y decoradores personalizados. Esto permite extender de manera limpia todo requerimiento de seguridad sin tocar artificialmente la lógica viva incrustada al interior de nuestros controladores. Por ejemplo, crearía un decorador que se ubique en zonas estratégicas de manera exclusiva dictaminando qué posiciones sociales o qué áreas jerárquicas están admitidas por ruta.

Consecuentemente el Guard compararía los atributos restrictivos de ingreso inyectados en el nivel general respecto de la validación viva asignada y codificada al interior del actor activo. Adicionalmente de tener este acceso garantizado, se establecería siempre exigir la validación estricta de sentido de pertenencia en niveles de servicio. Por ejemplo, evaluando invariablemente que la identidad particular autenticada corresponda de hecho a quien posea o custodie el recurso, lanzando excepciones nativas del proyecto si se detectase vulneración.


### 3. ¿Qué problemas aparecen cuando un backend crece mucho y cómo NestJS ayuda a resolverlos?

Cuando un backend crece, el código tiende inevitablemente a cruzarse y las responsabilidades arquitectónicas comienzan a volverse difusas. NestJS impone una base modular inamovible donde los controladores se desligan y solo los servicios aplican lógica especializada. Por ejemplo, el mecanismo estructural prohíbe tácitamente que los controladores se enzarcen con rutinas en bases de datos resguardando un diseño puro que previene el código inmanejable.

Un factor recurrente perjudicial son las respuestas ilegibles hacia los componentes frontales ante procesos fallidos. NestJS estandariza esta problemática mediante emisores intrínsecos de excepciones HTTP. Por ejemplo, esto facilita interceptar colapsos generales de la base de datos transformando mensajes crudos irreconocibles en envíos controlados de formatos Json con variables predecibles al consumidor web protegiendo así toda difusión o filtración interna del núcleo vital.

Durante el aumento abrupto del consumo surge además el ahogamiento del servidor de aplicaciones por volúmenes críticos o infinitos. Frente a esto las integraciones sólidas permiten fijar controles permanentes sin corromper o enlentecer al sistema base de modo violento. Por ejemplo, estableciendo como innegociable a todos nuestros controladores y servicios devolver conjuntos de tablas con límites máximos obligados y seleccionar meticulosamente con filtros específicos sólo columnas precisas descartando lecturas integrales.


### 4. ¿Cómo manejaría configuración por ambiente (development, staging, production)?

El manejo exige evitar todo identificador inamovible, contraseña insertada en línea o cadenas fijas incrustadas directamente dentro del código ejecutable. Utilizaría las implementaciones estandarizadas en gestión de módulos envolviendo valores críticos siempre al nivel global de los entornos virtuales del servidor. Por ejemplo, forzando a cargar todos estos accesos y dominios dependientes únicamente desde el punto particular.

Por lo cual NestJS permite la creación de variables de entorno que se pueden cargar desde archivos .env y que se pueden acceder desde cualquier parte de la aplicación donde se puede especificar el ambiente en el que se encuentra el servidor (development, staging, production). Permitiendo determinar al ssitema los recursos y permisos de acceso a los mismos separando la logica de desarrollo, pruebas y producción.  Por ejemplo, determinar o liberar variables de entorno únicas para cada ambiente. En el package.json se puede especificar el ambiente en el que se encuentra el servidor (development, staging, production) y determinar el archivo .env que se va a cargar como otro tipo de intrucciones. Dando pie al desarrollo del producto en entornos de datos diferentes.


### 5. ¿Cómo evitaría que dos usuarios compren el último producto disponible al mismo tiempo?

Para evitar que dos usuarios compren el último producto disponible al mismo tiempo, lo primero que haría es manejar la operación de compra como una transacción inquebrantable en la base de datos. De esta forma puedo asegurar que la verificación del stock y la actualización del inventario ocurran de manera atómica garantizando la exclusividad. Por ejemplo, si dos solicitudes llegan en milisegundos idénticos la base de datos pondrá a la segunda ejecución en estado de espera y luego la hará fallar al evidenciar que el primer usuario concretó exitosamente la resta del inventario.

Como continuación de esta estrategia, recurriría a aplicar un bloqueo a nivel de fila o row-level locking de manera intencional en la base de datos. Cuando un usuario intenta efectuar la compra, el sistema retiene temporalmente la lectura sobre esa tupla de producto mientras la transacción avanza por el proceso anulando así cualquier otra transacción paralela inoportuna que pretenda mutar el mismo registro. Por ejemplo, en bases de datos maduras como PostgreSQL esto se resuelve enviando consultas nativas de bloqueo concurrente del tipo SELECT FOR UPDATE desde el momento de la consulta inicial.

Además de los bloqueos reales y directos implementaría bloqueos optimistas sumando un campo numérico de versión al diseño o validando de nuevo la cantidad de productos instantes previos a dar commit. Si al intentar actualizar concretamente la cantidad el motor constata que el valor numérico cambió desde que se leyó primeramente, ordeno cancelar internamente toda la operación. Por ejemplo, informando cordialmente con un error controlado de aplicación al segundo comprador de que su carro de compras rechazó el artículo por agotamiento súbito sin comprometer ciclos del motor.

Finalmente, si el producto enfrentara oleadas continuas de consultas y excesivo tráfico agresivo, bloquearía las solicitudes antes siquiera de pisar el motor de almacenamiento apoyándome exteriormente en un sistema veloz de control como Redis. Por ejemplo, administrando colas temporales directas que vayan admitiendo una petición a la vez en un listado atómico rápido lo que sirve directamente de blindaje de embudos para controlar la concurrencia feroz aun existiendo múltiples servidores replicados de nuestra misma API respondiéndole en paralelo a miles de clientes al mismo tiempo.
