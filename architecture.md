# Architecture
Parte 2 – Análisis y Debugging
Código a analizar:
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
1. Identifique al menos 5 problemas de arquitectura o diseño.
2. Explique cómo refactorizaría esta implementación en un proyecto real de NestJS.

Parte 4 – Diseño de Arquitectura
1. ¿Cómo escalaría esta API para soportar 1000 requests por segundo?
2. ¿Qué cambios haría si el sistema creciera a millones de tareas?
3. ¿Cómo implementaría autenticación JWT en este sistema?
4. ¿Cómo manejaría procesamiento asincrónico para tareas pesadas?