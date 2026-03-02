# Test API and MongoDB Connection

## 1) Start MongoDB container

```bat
docker run -d ^
  --name mongodb ^
  -p 27017:27017 ^
  -e MONGO_INITDB_ROOT_USERNAME=admin ^
  -e MONGO_INITDB_ROOT_PASSWORD=123456 ^
  mongo
```

If container already exists:

```bat
docker start mongodb
```

## 2) Create local `.env` (do not push this file)

Create file `.env` with:

```env
PORT=3000
MONGODB_URI=mongodb://admin:123456@127.0.0.1:27017/TestUser?authSource=admin
```

## 3) Install and run backend

```bat
npm install
npm run dev
```

Connection success signs in terminal:
- `Connected to MongoDB`
- `Server running on port 3000`

## 4) API URLs for testing

Base URL:

- `http://localhost:3000`

Health check:

- `GET /`

Role APIs:

- `POST /api/roles`
- `GET /api/roles`
- `GET /api/roles/:id`
- `PATCH /api/roles/:id`
- `DELETE /api/roles/:id` (soft delete)

User APIs:

- `POST /api/users`
- `GET /api/users`
- `GET /api/users/:id`
- `PATCH /api/users/:id`
- `DELETE /api/users/:id` (soft delete)
- `POST /api/users/enable`
- `POST /api/users/disable`

## 5) Quick API test commands

```bat
curl http://localhost:3000/
```

```bat
curl -X POST http://localhost:3000/api/roles ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"admin\",\"description\":\"Administrator\"}"
```

```bat
curl http://localhost:3000/api/roles
```

```bat
curl -X POST http://localhost:3000/api/users ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"vinh\",\"password\":\"123456\",\"email\":\"vinh@gmail.com\",\"fullName\":\"Nguyen Quang Vinh\"}"
```

```bat
curl -X POST http://localhost:3000/api/users/enable ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"vinh@gmail.com\",\"username\":\"vinh\"}"
```

```bat
curl -X POST http://localhost:3000/api/users/disable ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"vinh@gmail.com\",\"username\":\"vinh\"}"
```
