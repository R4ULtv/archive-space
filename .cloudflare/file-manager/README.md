# Hono File Management API

## Overview
This project is a file management API built using the Hono framework. It provides endpoints for handling file uploads, downloads, and multipart uploads with authorization and token validation.

## Requirements
- Node.js (version 20 or higher)
- MongoDB Atlas account
- Realm Web SDK
- Hono framework

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Update the `wrangler.toml` file in the root directory with the following variables:
   ```toml
   [vars]
   MONGODB_APP_ID = "your_mongodb_app_id"
   MONGODB_API_KEY = "your_mongodb_api_key"
   ```

3. **Run the application:**
   ```bash
   npm start
   ```

## Usage
- The API exposes three main endpoints:
  - `GET /:objectName` - Download a file.
  - `POST /:objectName` - Upload a file or initiate a multipart upload.
  - `PUT /:objectName` - Upload a part of a file in a multipart upload.

## License
This project is licensed under the MIT License.
