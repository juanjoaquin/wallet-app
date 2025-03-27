# Wallet: Billetera virtual, con sistema de transferencias a otros usuarios y pagos. 
``
Lógica de la aplicación
``

La aplicación es una billetera virtual, donde la lógica de negocio se basa en la gestión de transferencias financieras digitales, aplicando seguridad y la disponibilidad de los fondos
de los usuarios. Donde la lógica empieza primeramente con el registro y la autenticación a través de JWT.
En la gestión de Cuentas y Saldo, cada usuario se registra pero debe crear su cuenta de Wallet una vez registrado como usuario. El saldo inicial de todos es 0 y se incrementa al asociar una tarjeta
y recargarse saldo (que posee un monto límite al recargo).
El usuario puede enviar dinero a otro mediante su ID único (sería como el CBU), como contacto agendado, o como el alias que se pone al crear la cuenta en la Wallet. Se valida que el usuario tenga
dinero suficiente antes de procesar la transferencia, o los pagos.

# Al completar la transferencia:
- Se resta el saldo del remitente.
- Se suma el saldo del destinatario.
- Se genera un registro de la transacción en ambas cuentas.
- Se envía una notificación al destinatario

* Pagos de Servicios o Compras
Los usuarios pueden realizar pagos con su saldo disponible, estos pagos los generó únicamente desde el backend. Simulando que los pagos uno no los crea, sino que son terceros.

- Obtiene una notificación al entrar un pago.
- Se descuenta el monto de la cuenta del usuario.
- Se registra la operación en el historial de pagos.

* Historial de Transacciones y Notificaciones
Cada usuario puede ver su historial de movimientos (recargas, transferencias, pagos).

- Se almacenan detalles como monto, fecha y tipo de transacción.
- Se envían notificaciones en eventos importantes (recarga exitosa, transferencia recibida, pago realizado).

* Gestión de Tarjetas de Crédito/Débito
- Los usuarios pueden agregar, eliminar y gestionar sus tarjetas.
- Se valida que la tarjeta sea válida antes de permitir su uso.
- Se pueden establecer tarjetas predeterminadas para recargas rápidas.
- Únicamente se puede poseer una tarjeta, en la que se puede desvincular y asociar otra.

``
Desarrollo
``
Backend: Laravel
Frontend: React JS & TypeScript
BD: MySQL
Validaciones: Zod, y Laravel validations
Autenticación: JWT 
UI: Taiwind CSS, Lucide Dev Icons

# Pasos a seguir para utilizarlo

1. Clonar el repositorio
2. Instalar Vite usando React + TypeScript
3. Una vez creado Laravel con Composer realizar las migraciones con `php artisan migrate`
4. Ejecutar `npm run dev` para la copilación del frontend.
5. Ejecutar `php artisan serve` para levantar el backend. 

# Imagenes del proyecto

![1](https://imgur.com/XIDvIvY)
