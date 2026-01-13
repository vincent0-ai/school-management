# Lama Dev School Management Dashboard

A comprehensive School Management System built with Next.js, Prisma, and PostgreSQL, using Clerk for authentication.

## 🚀 Getting Started

### 1. Prerequisites
- **Docker**: Ensure Docker Desktop is installed and running.
- **Node.js**: v18 or higher recommended.
- **Clerk Account**: You need a [Clerk](https://clerk.com/) account for authentication.

### 2. Environment Setup

Create a `.env` file in the root directory (already done if following the setup guide):

```env
DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/mydb?schema=public"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

### 3. Start Database
Run the following command to start PostgreSQL via Docker:

```bash
docker-compose up -d postgres
```

### 4. Run the Application
To avoid port conflicts (common with Next.js caching issues), use port **3002**:

```bash
PORT=3002 npm run dev
```

Open [http://localhost:3002](http://localhost:3002) in your browser.

---

## 🔐 Authentication & Roles (Important!)

This application uses **Clerk** for authentication and **PostgreSQL** for data.

### Default Logins?
**There are NO default passwords.**
Since Clerk manages auth, you must **Sign Up** to create your own account.
1. Go to [http://localhost:3002/sign-up](http://localhost:3002/sign-up)
2. Create a new account (Username, Email, Password).

### How to View Admin/Teacher/Student Dashboards?
By default, a new user has **no role** and may be redirected to Sign In or see an empty screen. To verify different dashboards, you must manually assign a role to your user in the **Clerk Dashboard**:

1. Go to your [Clerk Dashboard](https://dashboard.clerk.com/) > **Users**.
2. Select your newly created user.
3. Scroll to **Metadata** > **Public Metadata**.
4. Add the `role` property:
   
   **For Admin View:**
   ```json
   {
     "role": "admin"
   }
   ```
   **For Teacher View:**
   ```json
   {
     "role": "teacher"
   }
   ```
   *(Other roles: `student`, `parent`)*

5. Refresh your local app. You should now be redirected to the respective dashboard (e.g., `/admin`).

---

## 📂 Database Seed Data

The database is pre-populated with sample data (but NOT Clerk users). You can verify the UI displays this data once logged in with the correct role.

- **Admins**: `admin1`, `admin2`
- **Teachers**: `TName1 TSurname1` ...
- **Students**: `SName1 SSurname1` ...
- **Parents**: `PName 1 PSurname 1` ...
- **Classes**: 1A to 6A
- **Lessons, Exams, Assignments, Results**: Pre-generated sample entries.

If you need to reset the data:
```bash
npx prisma db push
npm run seed
```
