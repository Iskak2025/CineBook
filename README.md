Project Backend Developer Arabaev Iskak

# 🎬 CineBook — Movie Booking System

**CineBook** — это полнофункциональная платформа для онлайн-бронирования билетов в кино. Система включает Spring Boot бекенд с JWT-аутентификацией и React фронтенд с современным кинематографическим дизайном.

## 🚀 Демо

> Backend: https://cinebook-backend.onrender.com  
> Frontend: https://cinebook-frontend.onrender.com

---

## 🛠️ Технологии

### Backend
| Технология | Назначение |
|-----------|-----------|
| Java 21 + Spring Boot 3.2 | Основной фреймворк |
| Spring Security + JWT | Аутентификация и авторизация |
| Spring Data JPA + Hibernate | Работа с базой данных |
| PostgreSQL | База данных (production) |
| TMDB API | Данные о фильмах |

### Frontend
| Технология | Назначение |
|-----------|-----------|
| React 19 + Vite | UI-фреймворк и сборка |
| React Router v7 | Маршрутизация |
| Framer Motion | Анимации |
| Axios | HTTP-запросы |
| Lucide React | Иконки |

---

## ✨ Функциональность

- 🔐 **Аутентификация** — Регистрация, вход, JWT-токены
- 🎥 **Каталог фильмов** — Популярные, топовые, сейчас в прокате (через TMDB API)
- 🔍 **Поиск** — Поиск фильмов по названию
- 🪑 **Бронирование** — Выбор сеанса и мест (Premium A1–A10 / Classic B1–D10)
- 🎫 **Мои билеты** — История и отмена бронирований
- ❤️ **Вишлист** — Сохранение понравившихся фильмов
- ⚡ **Quick-Release** — Мгновенный запуск сеанса (самовосстанавливающийся)
- 🌙 **Тёмная тема** — Переключение светлой/тёмной темы

---

## 📂 Структура проекта

```
Movie Booking System/
├── Movie-Booking-System/          # Spring Boot Backend
│   └── src/main/java/com/work/Movie/Booking/System/
│       ├── config/                # Security & CORS
│       ├── controllers/           # REST Controllers
│       ├── entities/              # JPA Entities
│       ├── Dto/                   # Data Transfer Objects
│       ├── repositories/          # Spring Data Repositories
│       ├── service/               # Business Logic
│       ├── jwt/                   # JWT Filter & Utils
│       └── enums/                 # SeatType, Role
│
└── frontend/                      # React + Vite Frontend
    └── src/
        ├── components/            # Navbar, BackgroundShapes, etc.
        ├── context/               # AuthContext, ThemeContext
        ├── pages/                 # Home, MovieDetails, Booking, etc.
        ├── services/              # api.js (Axios)
        └── layouts/               # MainLayout
```

---

## ⚙️ Локальный запуск

### Требования
- Java 21+
- Node.js 18+
- PostgreSQL или аккаунт Render (PostgreSQL)

### 1. Backend

```bash
cd Movie-Booking-System
```

Создайте файл `src/main/resources/application-local.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/cinebook
spring.datasource.username=postgres
spring.datasource.password=your_password
tmdb.api.key=YOUR_TMDB_API_KEY
```

```bash
./mvnw spring-boot:run
```

Backend запустится на `http://localhost:8080`

### 2. Frontend

```bash
cd frontend
npm install
```

Создайте файл `.env`:
```env
VITE_API_URL=http://localhost:8080/api
```

```bash
npm run dev
```

Frontend запустится на `http://localhost:5173`

---

## 🌐 Деплой на Render

### Backend (Web Service)
| Параметр | Значение |
|---------|---------|
| **Root Directory** | `Movie-Booking-System` |
| **Build Command** | `./mvnw clean package -DskipTests` |
| **Start Command** | `java -jar target/Movie-Booking-System-0.0.1-SNAPSHOT.jar` |

**Environment Variables:**
```
SPRING_DATASOURCE_URL     = jdbc:postgresql://<host>/<db>
SPRING_DATASOURCE_USERNAME = <user>
SPRING_DATASOURCE_PASSWORD = <password>
TMDB_API_KEY               = <your_tmdb_key>
JWT_SECRET                 = <long_random_string>
```

### Frontend (Static Site)
| Параметр | Значение |
|---------|---------|
| **Root Directory** | `frontend` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `frontend/dist` |

**Environment Variables:**
```
VITE_API_URL = https://<your-backend>.onrender.com/api
```

---

## 🗺️ API Эндпоинты

### Auth
| Метод | Путь | Описание |
|-------|------|---------|
| POST | `/api/users/register` | Регистрация |
| POST | `/api/users/login` | Вход |

### Movies
| Метод | Путь | Описание |
|-------|------|---------|
| GET | `/api/movies/get_all` | Все локальные фильмы |
| GET | `/api/movies/get/{id}` | Фильм по ID |
| POST | `/api/movies/quick-release/{tmdbId}` | Быстрый запуск сеанса |

### TMDB Proxy
| Метод | Путь | Описание |
|-------|------|---------|
| GET | `/api/tmdb/popular` | Популярные фильмы |
| GET | `/api/tmdb/top_rated` | Топ фильмов |
| GET | `/api/tmdb/now_playing` | Сейчас в кино |
| GET | `/api/tmdb/search?query=` | Поиск |

### Tickets
| Метод | Путь | Описание |
|-------|------|---------|
| POST | `/api/tickets/book` | Забронировать |
| GET | `/api/tickets/user/{userId}` | Билеты пользователя |
| DELETE | `/api/tickets/cancel/{id}` | Отмена |

### Watchlist
| Метод | Путь | Описание |
|-------|------|---------|
| POST | `/api/watchlist/{userId}/{movieId}` | Добавить |
| DELETE | `/api/watchlist/{userId}/{movieId}` | Удалить |
| GET | `/api/watchlist/user/{userId}` | Получить |

---

## 🪑 Схема зала

```
        [SCREEN]

  A1  A2  A3  A4  A5  A6  A7  A8  A9  A10   ← PREMIUM (500 ₸)
  B1  B2  B3  B4  B5  B6  B7  B8  B9  B10   ┐
  C1  C2  C3  C4  C5  C6  C7  C8  C9  C10   ├ CLASSIC (300 ₸)
  D1  D2  D3  D4  D5  D6  D7  D8  D9  D10   ┘
```

---

## 👤 Роли

| Роль | Возможности |
|------|------------|
| `USER` | Просмотр каталога, бронирование, вишлист, Quick-Release |
| `ADMIN` | Все права USER + управление фильмами, театрами |

---

## 📄 Лицензия

MIT License — свободное использование в учебных и некоммерческих целях.
