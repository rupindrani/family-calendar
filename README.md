# Family Calendar

A shared family calendar and to-do list app built with Spring Boot microservices and React.

## Architecture

| Service | Port | Responsibility |
|---|---|---|
| API Gateway | 8080 | JWT auth, routing |
| User Service | 8081 | Auth, families, members |
| Calendar Service | 8082 | Events |
| Todo Service | 8083 | Tasks |
| Frontend | 3000 | React UI |

## Running Locally

### Backend (each service separately)

```bash
cd backend/user-service && mvn spring-boot:run
cd backend/calendar-service && mvn spring-boot:run
cd backend/todo-service && mvn spring-boot:run
cd backend/api-gateway && mvn spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
npm start
```

### With Docker Compose

```bash
docker-compose up --build
```

## Features

- **Register** — create a new family or join one with an invite code
- **Dashboard** — overview of upcoming events, pending tasks, and family members
- **Calendar** — monthly view, add/edit/delete events, filter by family member
- **To-Do List** — create tasks, assign to members, set priority and due date, mark complete

## API Endpoints

### Auth (public)
- `POST /api/auth/register`
- `POST /api/auth/login`

### Families
- `GET /api/families/{familyId}`
- `GET /api/families/{familyId}/members`

### Events
- `GET /api/events` — all family events
- `POST /api/events`
- `PUT /api/events/{id}`
- `DELETE /api/events/{id}`

### Todos
- `GET /api/todos`
- `POST /api/todos`
- `PUT /api/todos/{id}`
- `PATCH /api/todos/{id}/toggle`
- `DELETE /api/todos/{id}`
