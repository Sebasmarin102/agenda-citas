# Agenda de citas — Costura

Sistema de reservas de citas para un pequeño negocio de costura. Las clientas reservan sin necesidad de crear una cuenta; la administradora del negocio gestiona su agenda, bloquea horarios y consulta estadísticas desde un panel protegido.

**Demo en vivo:**
- Reservas (clienta): https://agenda-citas-two.vercel.app
- Panel admin: https://agenda-citas-two.vercel.app/admin

## Funcionalidades

**Para la clienta (sin login):**
- Elige fecha y duración del servicio (15 / 30 / 45 / 60 min).
- Ve únicamente los horarios realmente disponibles (calculados en tiempo real contra el horario de atención y las citas ya existentes).
- Reserva con solo nombre y celular.
- Recibe confirmación inmediata con número de cita.

**Para la administradora (panel protegido con login):**
- Ver la agenda de cualquier día (incluye canceladas y horarios bloqueados).
- Cancelar una cita, o marcarla como "no se presentó" una vez que ya pasó su hora.
- Bloquear un horario manualmente (por ejemplo, si no puede atender).
- Dashboard con horarios más pedidos, días con más demanda, clientas frecuentes y tasa de no presentados.
- Recibe por correo: aviso instantáneo de cada cita nueva, resumen diario de las citas del día siguiente, y aviso cuando falta ~1 hora para una cita.

## Stack

- **Backend:** Node.js + Express 5, MySQL (`mysql2`), arquitectura MVC + capa de servicios.
- **Frontend:** React 19 + Vite 6, `react-router-dom`.
- **Autenticación:** JWT (`jsonwebtoken` + `bcryptjs`), guardado en `localStorage` del navegador.
- **Validación:** Zod.
- **Fechas/horas:** Luxon (zona horaria fija del negocio: `Europe/Madrid`).
- **Email:** Resend.
- **Infraestructura:** Vercel (frontend), Render (backend), Aiven (MySQL), cron-job.org (tareas programadas externas).

## Estructura del repositorio

```
Agenda-citas-costura/
├── backend/     → API REST (Express + MySQL)
├── frontend/    → Aplicación React (clienta + panel admin)
```

## Correr el proyecto en local

### Backend

```bash
cd backend
npm install
```

Crea un archivo `.env` en `backend/` con:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=sewing_appointments
JWT_SECRET=una_clave_aleatoria_larga
RESEND_API_KEY=tu_api_key_de_resend
MOM_EMAIL=correo_que_recibe_las_notificaciones
CRON_SECRET=otra_clave_aleatoria
FRONTEND_URL=http://localhost:5173
PORT=3000
```

Crea la base de datos y las tablas, luego:

```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
```

Crea un archivo `.env` en `frontend/` con:

```
VITE_API_URL=http://localhost:3000
```

```bash
npm run dev
```


