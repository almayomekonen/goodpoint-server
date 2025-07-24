# Firebase Authentication Integration Guide

## Overview

This guide explains how to set up and use Firebase Authentication in the GoodPoint NestJS backend. The implementation provides a comprehensive authentication system that supports both Firebase ID tokens and legacy access tokens.

## Features

- **Firebase Admin SDK Integration**: Full integration with Firebase Admin SDK for token verification
- **User Linking**: Automatic linking between Firebase users and MySQL database users
- **Hybrid Authentication**: Support for both Firebase and legacy authentication methods
- **Role-Based Access Control**: Comprehensive role checking and authorization
- **Rate Limiting**: Built-in rate limiting for API endpoints
- **Token Caching**: Performance optimization with token caching
- **Health Monitoring**: Firebase connectivity health checks
- **User Management**: Complete user management APIs

## Setup Instructions

### 1. Environment Configuration

Add the following environment variables to your `.env` file:

```bash
# Firebase Configuration
FIREBASE_PROJECT_ID=goodpoint-37525
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@goodpoint-37525.iam.gserviceaccount.com
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json

# Authentication Settings
TOKEN_EXPIRATION=3600
REFRESH_TOKEN_EXPIRATION=604800
ENABLE_TOKEN_CACHING=true
CACHE_EXPIRATION=300
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
```

### 2. Firebase Service Account

Ensure you have the Firebase service account JSON file (`firebase-service-account.json`) in your server root directory. This file contains the credentials needed to authenticate with Firebase Admin SDK.

### 3. Database Migration

Run the database migration to add the Firebase UID index:

```bash
npm run migration-run
```

## Usage

### Authentication Guards

#### Firebase Authentication Guard

Use `@UseFirebaseAuth()` decorator to protect routes with Firebase authentication:

```typescript
@UseFirebaseAuth(Roles.ADMIN, Roles.TEACHER)
@Get('protected-endpoint')
async protectedEndpoint(@RequestUser() user: AuthenticatedUser) {
    // User is authenticated via Firebase
    return { message: 'Authenticated', user };
}
```

#### Hybrid Authentication Guard

Use `@UseHybridAuth()` decorator to support both Firebase and legacy authentication:

```typescript
@UseHybridAuth(Roles.ADMIN, Roles.TEACHER)
@Get('hybrid-endpoint')
async hybridEndpoint(@RequestUser() user: AuthenticatedUser) {
    // User can be authenticated via Firebase or legacy tokens
    return { message: 'Authenticated', user };
}
```

#### Skip Authentication

Use `@SkipAuth()` decorator to bypass authentication:

```typescript
@SkipAuth()
@Get('public-endpoint')
async publicEndpoint() {
    return { message: 'Public endpoint' };
}
```

### User Linking

#### Link Existing User to Firebase

```typescript
POST /api/firebase/link-user
{
    "email": "user@example.com",
    "firebaseUid": "firebase-uid-here"
}
```

#### Create New User and Link to Firebase

```typescript
POST /api/firebase/create-user
{
    "email": "newuser@example.com",
    "password": "secure-password",
    "type": "staff",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+1234567890",
    "preferredLanguage": "HEBREW",
    "systemNotifications": true
}
```

#### Sync User with Firebase

```typescript
POST /api/firebase/sync-user
{
    "email": "user@example.com"
}
```

#### Get User Linking Status

```typescript
GET /api/firebase/linking-status/user@example.com
```

#### Migrate Existing Users

```typescript
POST / api / firebase / migrate - users;
```

### Health Monitoring

#### Check Firebase Health

```typescript
GET / api / firebase / health;
```

#### List Firebase Users

```typescript
GET /api/firebase/users?maxResults=100
```

#### Get User by UID

```typescript
GET / api / firebase / user / { uid };
```

#### Get User by Email

```typescript
GET / api / firebase / user / email / { email };
```

## API Endpoints

### Authentication Endpoints

| Method | Endpoint                              | Description               | Auth Required    |
| ------ | ------------------------------------- | ------------------------- | ---------------- |
| POST   | `/api/firebase/verify-token`          | Verify Firebase ID token  | No               |
| POST   | `/api/firebase/link-user`             | Link user to Firebase     | Admin/SuperAdmin |
| POST   | `/api/firebase/create-user`           | Create and link user      | Admin/SuperAdmin |
| POST   | `/api/firebase/sync-user`             | Sync user with Firebase   | Admin/SuperAdmin |
| POST   | `/api/firebase/unlink-user`           | Unlink user from Firebase | Admin/SuperAdmin |
| GET    | `/api/firebase/linking-status/:email` | Get linking status        | Admin/SuperAdmin |
| POST   | `/api/firebase/migrate-users`         | Migrate existing users    | SuperAdmin       |

### Management Endpoints

| Method | Endpoint                                | Description       | Auth Required    |
| ------ | --------------------------------------- | ----------------- | ---------------- |
| GET    | `/api/firebase/health`                  | Health check      | Admin/SuperAdmin |
| GET    | `/api/firebase/users`                   | List users        | Admin/SuperAdmin |
| GET    | `/api/firebase/user/:uid`               | Get user by UID   | Admin/SuperAdmin |
| GET    | `/api/firebase/user/email/:email`       | Get user by email | Admin/SuperAdmin |
| POST   | `/api/firebase/user/:uid/revoke-tokens` | Revoke tokens     | SuperAdmin       |
| POST   | `/api/firebase/user/:uid/delete`        | Delete user       | SuperAdmin       |

## Error Handling

The system provides comprehensive error handling with appropriate HTTP status codes:

- `401 Unauthorized`: Invalid or missing authentication token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: User or resource not found
- `409 Conflict`: User already exists or Firebase UID already linked
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

## Security Features

### Rate Limiting

The system implements rate limiting to prevent abuse:

- **Window**: 15 minutes (configurable)
- **Max Requests**: 100 per window (configurable)
- **Scope**: Per IP address

### Token Caching

For performance optimization, verified tokens are cached:

- **Enabled**: By default (configurable)
- **Expiration**: 5 minutes (configurable)
- **Cleanup**: Automatic cleanup of expired tokens

### Role-Based Access Control

Comprehensive role checking:

- **Roles**: TEACHER, ADMIN, SUPERADMIN
- **Inheritance**: SUPERADMIN has access to all endpoints
- **Flexibility**: Support for custom roles

## Troubleshooting

### Common Issues

1. **Firebase Initialization Failed**
    - Check service account credentials
    - Verify project ID
    - Ensure service account file exists

2. **User Not Found in Database**
    - User must exist in MySQL database before linking
    - Use migration endpoint to create Firebase users for existing users

3. **Token Verification Failed**
    - Check token expiration
    - Verify Firebase project configuration
    - Ensure token is properly formatted

4. **Rate Limit Exceeded**
    - Wait for rate limit window to reset
    - Reduce request frequency
    - Contact administrator if needed

### Debug Endpoints

The system includes debug endpoints for troubleshooting:

- `/api/staff/debug/auth-test`: Test authentication
- `/api/staff/debug/env-check`: Check environment variables
- `/api/staff/debug/simple-login`: Test login process

## Performance Considerations

### Caching Strategy

- **Token Caching**: Reduces Firebase API calls
- **User Data Caching**: Consider implementing Redis for user data
- **Database Indexing**: Firebase UID column is indexed

### Monitoring

- **Health Checks**: Regular Firebase connectivity checks
- **Logging**: Comprehensive logging for debugging
- **Metrics**: Consider adding application metrics

## Migration Guide

### From Legacy Authentication

1. **Backup Database**: Create backup before migration
2. **Run Migration**: Execute database migration
3. **Migrate Users**: Use `/api/firebase/migrate-users` endpoint
4. **Update Frontend**: Ensure frontend sends Firebase tokens
5. **Test Thoroughly**: Verify all endpoints work correctly

### Testing

1. **Unit Tests**: Test individual components
2. **Integration Tests**: Test authentication flows
3. **End-to-End Tests**: Test complete user journeys
4. **Load Testing**: Test performance under load

## Support

For issues and questions:

1. Check the troubleshooting section
2. Review logs for error details
3. Test with debug endpoints
4. Contact the development team

## Changelog

### Version 1.0.0

- Initial Firebase authentication integration
- User linking system
- Hybrid authentication support
- Rate limiting and caching
- Comprehensive API endpoints
- Health monitoring
- Database migration support
