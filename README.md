# 🎓 LMS - Learning Management System

A comprehensive, secure, and scalable Learning Management System built with the "Double Nest" stack.

## 👥 Team Members & Roles
* **[Name]** - Full Stack Engineer (Auth & Database)
* **[Name]** - Frontend Developer (UI/UX & Next.js)

## 🛠️ Problem Statement
Traditional learning platforms often struggle with slow page loads and fragmented security. The **LMS Project** provides a unified TypeScript environment that ensures high-speed content delivery via Next.js and a robust, type-safe API via NestJS to manage courses, students, and certifications securely.

## ⚡ Tech Stack Used
| Component | Technology |
| :--- | :--- |
| **Frontend** | Next.js 14+ (App Router), Tailwind CSS |
| **Backend** | NestJS |
| **Database** | PostgreSQL |
| **ORM** | TypeORM |
| **Security** | JWT, Bcrypt, Throttler (Rate Limit) |
| **Storage** | Multer (Course Material Uploads) |
| **Documentation** | Swagger / OpenAPI |

## ⚙️ Installation Steps

### 1. Database
Ensure **PostgreSQL** is running and create a database named `lms_db`.

### 2. Backend (NestJS)
```bash
cd lms-backend
npm install
# Configure your .env with DB_URL and JWT_SECRET
npm run start:dev