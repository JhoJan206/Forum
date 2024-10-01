# Forum - Aplicación de Chat en Tiempo Real

Este proyecto es una aplicación de foro de chat en tiempo real construida con **Node.js**, **Socket.io**, y una base de datos **Turso**. Los usuarios pueden unirse al chat, enviar mensajes y recibir mensajes de otros usuarios en tiempo real. Además, la aplicación maneja el estado offline, permitiendo que los mensajes se guarden localmente y se sincronicen cuando se restablezca la conexión.

## Características

- Chat en tiempo real utilizando **Socket.io**.
- Almacenamiento de mensajes en una base de datos **Turso**.
- Soporte para estado offline: los mensajes se almacenan localmente y se envían cuando la conexión se restablece.
- Servicio de **random-user** para asignar un nombre de usuario aleatorio si no se ha definido uno.
- **Service Worker** que permite el acceso offline a los mensajes y al contenido estático.

## Tecnologías Utilizadas

- Node.js: Backend de la aplicación.
- Socket.io: Comunicación en tiempo real entre el servidor y el cliente.
- Turso: Base de datos utilizada para almacenar los mensajes.
- Service Worker: Para hacer la aplicación accesible offline.
- Express.js: Framework para manejar el servidor HTTP.
- HTML, CSS y JavaScript: Interfaz del frontend.