# Proyecto Final 2025 – Plataforma de Eventos

##Descripción: Este proyecto consiste en el desarrollo de una aplicación web para la gestión de eventos. El sistema permite a los usuarios registrarse, iniciar sesión, crear, consultar y administrar eventos, así como gestionar la asistencia a los mismos. La aplicación está compuesta por un frontend desarrollado en React con Vite y un backend basado en Symfony, ambos desplegados mediante contenedores Docker para facilitar su despliegue y mantenimiento.

## Credenciales

- **Usuario (User):**
  - Username: `rociogavira@ejemplo.com`
  - Password: `123456`
- **Admin (User2):**
  - Username: `rocio@ejemplo.com`
  – Password: `123`
- **Admin (Administrador):**
  - Username: `admin@gmail.com`
  – Password: `123`

## Puertos

- **Frontend (React + Vite):**  
  – Puerto: **5173**  

- **Backend (Symfony API):**  
  – Puerto: **8000**  

- **Base de datos (MySQL):**  
  – Puerto: **3306** (accesible internamente desde los contenedores).

- **phpMyAdmin:**  
  – Puerto: **8080**  

- **Proxy (Nginx):**  
  – Puerto: **80**  

## Instrucciones de uso

### Prueba en entorno local (usando Docker)

1. **Clona el repositorio**:
   ```bash
   git clone https://github.com/RociooGaviraa/ProyectoFinal2025.git
   cd ProyectoFinal2025
   ```

2. **Levanta los servicios con Docker Compose:**
   ```bash
   docker-compose up --build
   ```
   Esto levantará los contenedores del frontend, backend, base de datos, phpMyAdmin y el proxy (Nginx).

3. **Accede a la aplicación:**
   – Frontend: http://localhost:5173  
   – Backend API: http://localhost:8000  
   – phpMyAdmin: http://localhost:8080

4. **Prueba las funcionalidades:**
   – Registra un nuevo usuario (o usa las credenciales predeterminadas) y accede al sistema.
   – Crea, edita, elimina o inscríbete a eventos.
   – Verifica la integración con Stripe (para eventos de pago).

### Prueba en la versión desplegada (por ejemplo, en AWS)

1. **Accede a la URL pública** (o IP) del servidor donde se ha desplegado la aplicación.
2. **Usa las credenciales predeterminadas** (o las creadas en producción) para iniciar sesión.
3. **Prueba todas las funcionalidades** (registro, login, gestión de eventos, inscripciones, etc.) tal como se haría en local.

## Datos de prueba

### Usuarios predeterminados (para pruebas)

- **Usuario (User1):**
  – Username: `rociogavira@gmail.com`  
  – Password: `123456`
- **Admin (User2):**
  – Username: `rocio@ejemplo.com`  
  – Password: `123`
- **Admin (Administrador):**
  – Username: `rocio@ejemplo.com`  
  – Password: `123`

- **Tarjeta:**
  – Correo electrónico: (El del usuario, que este logueado)
  - Número de tarjeta: `4242 4242 4242 4242` 
  - Fecha de caducidad: `12/34` 
  – CV: `123`
  - Nombre titular de tarjeta: `Rocío`


### Datos de prueba (eventos, inscripciones, etc.)

- Se recomienda crear eventos de prueba (gratuitos y de pago) para verificar la inscripción y el flujo de pago con Stripe.
- Puedes usar phpMyAdmin (puerto 8080) para consultar o insertar datos de prueba en la base de datos.
