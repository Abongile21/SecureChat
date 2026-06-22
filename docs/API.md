# API Documentation

## Authentication Endpoints

### Login
**Endpoint:** `POST /api/auth/login`
**Description:** Authenticate user with Azure AD

**Request:**
```json
{
  "email": "user@company.com",
  "name": "John Doe",
  "azureId": "azure-user-id"
}
```

**Response:**
```json
{
  "token": "jwt-token-here",
  "user": {
    "email": "user@company.com",
    "name": "John Doe"
  }
}
```

**Status Codes:**
- 200: Success
- 400: Missing required fields
- 500: Server error

---

## Chat Endpoints

### Send Message
**Endpoint:** `POST /api/chat/message`
**Authentication:** Required (Bearer Token)
**Description:** Send message to chatbot and receive response

**Request:**
```json
{
  "chatId": "chat-session-id",
  "message": "What is phishing?"
}
```

**Response:**
```json
{
  "chatId": "chat-session-id",
  "userMessage": "What is phishing?",
  "botResponse": "Phishing is a cyberattack...",
  "timestamp": "2024-06-22T10:30:00Z"
}
```

### Get Chat History
**Endpoint:** `GET /api/chat/history/:chatId`
**Authentication:** Required
**Description:** Retrieve chat history for a session

**Response:**
```json
{
  "chatId": "chat-session-id",
  "messages": [
    {
      "id": "msg-1",
      "userMessage": "What is phishing?",
      "botResponse": "Phishing is...",
      "timestamp": "2024-06-22T10:30:00Z"
    }
  ]
}
```

### Start New Chat
**Endpoint:** `POST /api/chat/start`
**Authentication:** Required
**Description:** Initialize new chat session

**Response:**
```json
{
  "chatId": "new-chat-id",
  "createdAt": "2024-06-22T10:30:00Z"
}
```

---

## User Endpoints

### Get User Profile
**Endpoint:** `GET /api/users/profile`
**Authentication:** Required
**Description:** Retrieve current user profile

**Response:**
```json
{
  "userId": "user-id",
  "email": "user@company.com",
  "profile": {
    "department": "IT",
    "manager": "manager@company.com",
    "joinDate": "2024-01-15"
  }
}
```

### Update User Profile
**Endpoint:** `PUT /api/users/profile`
**Authentication:** Required
**Description:** Update user profile information

**Request:**
```json
{
  "department": "Security",
  "preferences": {
    "emailNotifications": true,
    "language": "en"
  }
}
```

---

## Gamification Endpoints

### Get Leaderboard
**Endpoint:** `GET /api/gamification/leaderboard`
**Authentication:** Required
**Description:** Get top-ranked users

**Response:**
```json
{
  "leaderboard": [
    {
      "rank": 1,
      "userId": "user-1",
      "name": "John Doe",
      "points": 5000,
      "badges": 15
    }
  ],
  "timestamp": "2024-06-22T10:30:00Z"
}
```

### Get User Achievements
**Endpoint:** `GET /api/gamification/achievements/:userId`
**Authentication:** Required
**Description:** Get user badges and achievements

**Response:**
```json
{
  "userId": "user-id",
  "achievements": [
    {
      "id": "badge-1",
      "name": "Security Novice",
      "earnedAt": "2024-06-20T15:00:00Z"
    }
  ],
  "totalPoints": 1250
}
```

### Award Points
**Endpoint:** `POST /api/gamification/points`
**Authentication:** Required
**Description:** Award points to user (admin only)

**Request:**
```json
{
  "userId": "user-id",
  "points": 50,
  "reason": "Completed training module"
}
```

---

## Analytics Endpoints

### Get Engagement Metrics
**Endpoint:** `GET /api/analytics/engagement`
**Authentication:** Required (Manager/Admin)
**Description:** Get organization engagement statistics

**Response:**
```json
{
  "totalUsers": 100,
  "activeUsers": 75,
  "engagementRate": 0.85,
  "timestamp": "2024-06-22T10:30:00Z"
}
```

### Get Training Progress
**Endpoint:** `GET /api/analytics/training-progress`
**Authentication:** Required (Manager/Admin)
**Description:** Get training completion statistics

**Response:**
```json
{
  "completedTrainings": 450,
  "inProgressTrainings": 120,
  "averageScore": 82.5
}
```

### Generate Report
**Endpoint:** `POST /api/analytics/generate-report`
**Authentication:** Required (Manager/Admin)
**Description:** Generate custom analytics report

**Request:**
```json
{
  "startDate": "2024-06-01",
  "endDate": "2024-06-30",
  "format": "pdf"
}
```

**Response:**
```json
{
  "reportId": "report-123",
  "format": "pdf",
  "generatedAt": "2024-06-22T10:30:00Z"
}
```

---

## Error Responses

### Standard Error Format
```json
{
  "error": "Description of error",
  "statusCode": 400
}
```

### Common Status Codes
- 200: OK
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

---

## Rate Limiting

- Standard: 100 requests per minute per user
- Chat endpoints: 20 requests per minute per user
- Admin endpoints: 500 requests per minute per user

---

## Pagination

For list endpoints, use query parameters:
- `limit`: Number of results (default: 20, max: 100)
- `offset`: Number of results to skip (default: 0)

Example: `GET /api/users?limit=50&offset=100`
