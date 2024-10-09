# **Text Justification API**

This project is a RESTful API built with **NestJS** and **TypeScript** that justifies a given text to fit lines of 80 characters. The API also implements authentication through unique tokens and rate limiting to ensure fair use. This project leverages **PostgreSQL** with **Prisma ORM** for token management.

---

## **Table of Contents**
1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [API Documentation](#api-documentation)
   - [Get Token](#1-get-token)
   - [Justify Text](#2-justify-text)
4. [Rate Limiting](#rate-limiting)
5. [Installation](#installation)
6. [Running the Project](#running-the-project)
7. [Testing](#testing)
8. [Project Structure](#project-structure)

---

## **Features**

- **Text Justification**: Adjusts text to have lines of exactly 80 characters.
- **Authentication**: A unique token-based system for access control.
- **Rate Limiting**: Limits token usage to 80,000 words justified per day.
- **Persistent Data**: Uses **PostgreSQL** to store token information via **Prisma ORM**.

---

## **Tech Stack**

- **Backend**: [NestJS](https://nestjs.com/), [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Testing**: [Jest](https://jestjs.io/)

---

## **API Documentation**

### **1. Get Token**

**Endpoint**: `POST /api/token`

This endpoint generates a unique token for an email address. The token is required for further API requests.

- **Request**:
  - **Method**: `POST`
  - **Body** (JSON):
    ```json
    {
      "email": "foo@bar.com"
    }
    ```

- **Response**:
  - **Status**: `200 OK`
  - **Body** (JSON):
    ```json
    {
      "token": "generated-unique-token"
    }
    ```
- **Error Responses**:
  - **Status**: `401 Unauthorized`
    - invalid Email.

### **2. Justify Text**

**Endpoint**: `POST /api/justify`

This endpoint justifies a block of text to ensure each line is exactly 80 characters long.

- **Request**:
  - **Method**: `POST`
  - **Headers**:
    ```
    Authorization: <token>
    ```
  - **Body** (**text/plain**): Raw text input to be justified.

- **Response**:
  - **Status**: `200 OK` (if text is justified)
  - **Body** (text/plain): Justified text output, where each line has a length of 80 characters.

- **Error Responses**:
  - **Status**: `401 Unauthorized`
    - Returned if the token is missing or invalid.
  - **Status**: `402 Payment Required`
    - Returned if the user exceeds the daily limit of 80,000 words.

---

## **Rate Limiting**

Each token is restricted to justify up to 80,000 words per day. If the limit is exceeded, the user will receive a `402 Payment Required` response.

---

## **Installation**

### **1. Clone the repository**

```bash
git clone https://github.com/your-username/text-justification-api.git
cd text-justification-api
```

### **2. Install Dependencies**
```bash
npm install
```


### **3. Configure environment variables**
```bash
DATABASE_URL="Database url"
```


### **4. Run database migrations**
```bash
npx prisma migrate dev --name init
```


### **5. Run the server**
```bash
npm run start
```
By default, the server runs on http://localhost:3000.

### **6. API Testing**
Once the server is running, you can use tools like Postman or curl to interact with the API.
Example request for `/api/token`:
```bash
curl -X POST http://localhost:3000/api/token
-H "Content-Type: application/json"
-d '{"email": "foo@bar.com"}'
``` 

Example request for `/api/justify`:
```bash
curl -X POST http://localhost:3000/api/justify
-H "Authorization: <token>"
-H "Content-Type: text/plain"
--data-binary @your-text-file.txt
```

### **7. Testing**

To ensure code quality and functionality, the project includes unit and integration tests using Jest.

**Run tests**
```bash
npm run test
```
**Run tests with coverage**
```bash
npm run test:cov
```
A detailed coverage report will be generated in the coverage/ folder.
