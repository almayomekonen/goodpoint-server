# Production Authentication Setup

## Overview

This guide helps you set up authentication for your Railway production environment.

## The Problem

Your local database has users like `admin@goodpoint.com` with password `password`, but your Railway production database doesn't have these users.

## Solution

### Step 1: Deploy the Code Changes

```bash
git add .
git commit -m "Fix authentication: use main user table for passwords"
git push
```

### Step 2: Set Railway Environment Variables

In your Railway dashboard, set these environment variables:

```bash
# Authentication Configuration
ACCESS_TOKEN_NAME=kloklokl
TWO_FACTOR_TOKEN_COOKIE=kloo
SECRET_OR_KEY=70f4c2ef4f56230e4b689ae7b72497d1107a4efafaa7140b207142c59a8955b7

# Database Configuration (use your Railway database details)
DB_HOST=your_railway_db_host
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
DB_SSL=true

# Application Configuration
NODE_ENV=production
PORT=8080
```

### Step 3: Create Admin User in Production Database

You have two options:

#### Option A: Use the SQL Script

1. Access your Railway database (via Railway dashboard or CLI)
2. Run the SQL script: `create-production-admin.sql`
3. This creates user: `admin@goodpoint.prod` with password: `Admin123!`

#### Option B: Use Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Connect to your database
railway connect

# Run the SQL script
mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME < create-production-admin.sql
```

### Step 4: Test Production Login

Use these credentials to test:

- **Username**: `admin@goodpoint.prod`
- **Password**: `Admin123!`

### Alternative: Create User via Application

If you have access to create users through your application interface, you can:

1. Create a new admin user through the UI
2. Use that user's credentials for testing

## Verification

After setup, you should be able to:

1. ✅ Access your production frontend
2. ✅ Login with the production credentials
3. ✅ See the user authenticated successfully
4. ✅ Access protected routes

## Troubleshooting

### If login still fails:

1. Check Railway logs for errors
2. Verify environment variables are set correctly
3. Ensure the database user was created successfully
4. Check if the SUPERADMIN role exists in your production database

### If SUPERADMIN role doesn't exist:

Run this SQL first:

```sql
INSERT INTO `role` (`id`, `name`, `description`, `roleKey`)
VALUES (1, 'Super Admin', 'Super Administrator', 'SUPERADMIN');
```

## Security Notes

- Change the default password after first login
- Use a strong, unique password in production
- Consider implementing password policies
- Regularly rotate the SECRET_OR_KEY
