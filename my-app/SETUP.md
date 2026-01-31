# Backend Setup & Testing Guide

Step-by-step guide to set up PostgreSQL with Postgres.app and test your API with Postman.

---

## Part 1: Postgres.app Setup

### Step 1: Start Postgres.app
1. Open the **Postgres.app** from your Applications folder
2. If you see **"Initialize"**, click it to create your first PostgreSQL server
3. The elephant icon in your menu bar should show the server is running (green indicator)

### Step 2: Create a database
Postgres.app creates a default database with your Mac username. For this project, create a dedicated database:

1. Open **Terminal** (or iTerm)
2. Add Postgres to your PATH if you haven't:
   ```bash
   sudo mkdir -p /etc/paths.d && echo /Applications/Postgres.app/Contents/Versions/latest/bin | sudo tee /etc/paths.d/postgresapp
   ```
3. Create the database:
   ```bash
   createdb hungryhoyas
   ```
4. Verify it exists:
   ```bash
   psql -l
   ```
   You should see `hungryhoyas` in the list.

### Step 3: Get your connection string
Postgres.app uses **trust authentication** by default (no password for local connections).

- **User:** Your Mac username (run `whoami` in Terminal to check)
- **Host:** localhost
- **Port:** 5432
- **Database:** hungryhoyas
- **Password:** none (leave blank)

**Connection string format:**
```
postgresql://YOUR_MAC_USERNAME@localhost:5432/hungryhoyas
```

Example if your Mac username is `jessenajera`:
```
postgresql://jessenajera@localhost:5432/hungryhoyas
```

---

## Part 2: Project Setup

### Step 4: Update your .env file
1. Open `my-app/.env`
2. Replace the `DATABASE_URL` with your actual connection string:
   ```
   DATABASE_URL="postgresql://jessenajera@localhost:5432/hungryhoyas"
   ```
   (Replace `jessenajera` with your Mac username if different)

### Step 5: Push the schema to the database
From the `my-app` folder in Terminal:

```bash
cd /Users/jessenajera/Desktop/hungryHoyas/my-app
npm run db:push
```

You should see: `Your database is now in sync with your Prisma schema.`

### Step 6: Start the Next.js dev server
```bash
npm run dev
```

The API will be available at `http://localhost:3000`.

---

## Part 3: Test with Postman

### Step 7: Create a new user
1. Open **Postman**
2. Create a new request: **POST** `http://localhost:3000/api/users`
3. Go to the **Body** tab → select **raw** → choose **JSON**
4. Paste this body:
   ```json
   {
     "email": "student@georgetown.edu",
     "name": "Alex Hoyas",
     "nutritionGoals": {
       "goalCalories": 2200,
       "goalProtein": 165,
       "goalCarbs": 275,
       "goalFat": 73
     }
   }
   ```
5. Click **Send**
6. You should get a `200` response with the created user (including an `id`). **Copy the `id`** for the next steps.

### Step 8: List all users
1. New request: **GET** `http://localhost:3000/api/users`
2. Click **Send**
3. You should see an array with your created user(s).

### Step 9: Get a single user
1. New request: **GET** `http://localhost:3000/api/users/YOUR_USER_ID`
2. Replace `YOUR_USER_ID` with the `id` from Step 7
3. Click **Send**
4. You should see the user with their nutrition goals.

### Step 10: Update nutrition goals
1. New request: **PUT** `http://localhost:3000/api/users/YOUR_USER_ID/goals`
2. Replace `YOUR_USER_ID` with the user's `id`
3. Body tab → **raw** → **JSON**:
   ```json
   {
     "goalCalories": 2500,
     "goalProtein": 180
   }
   ```
4. Click **Send**
5. You should get the updated goals (only provided fields are updated).

### Step 11: Get nutrition goals only
1. New request: **GET** `http://localhost:3000/api/users/YOUR_USER_ID/goals`
2. Replace `YOUR_USER_ID` with the user's `id`
3. Click **Send**
4. You should see just the nutrition goals object.

---

## API Reference Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List all users |
| POST | `/api/users` | Create user (optional: `nutritionGoals`) |
| GET | `/api/users/[id]` | Get single user with goals |
| GET | `/api/users/[id]/goals` | Get user's nutrition goals |
| PUT | `/api/users/[id]/goals` | Create or update nutrition goals |

---

## Troubleshooting

**"Connection refused" or "ECONNREFUSED"**
- Make sure Postgres.app is running (green elephant in menu bar)
- Check that the port in your URL is `5432`

**"database does not exist"**
- Run `createdb hungryhoyas` in Terminal

**"role does not exist"**
- Use your Mac username in the connection string. Run `whoami` in Terminal to confirm.
