# Archive Space

<img alt="Archive Space - Personal Archive System" src="https://www.raulcarini.dev/api/dynamic-og?title=Archive%20Space&description=Modern%20Archive%20System%20with%20Cloudflare%20Workers%2C%20R2%2C%20and%20Better%20Auth">

Archive Space is a modern, self-hosted file archive system.
It provides **cloud storage, search, preview, and organization features** built on **Cloudflare Workers, R2, KV, D1, and Next.js**.

The new architecture focuses on **speed, scalability, and security**, while keeping a simple, user-friendly UI.

## ✨ Features

- 🔒 **Authentication & Security**

  - Google/Github sign-in with [Better Auth](https://better-auth.com)
  - Middleware session checks
  - Restrict access to specific users by email

- 📁 **File Management**

  - Upload, download, and organize files by categories & tags
  - Search bar for instant file lookups
  - Filter by category
  - Grid/list layout switch
  - Upload speed tooltip

- 🎬 **Previews & Media**

  - Image, audio, and video previews (Google Drive–style)
  - Built-in media player
  - Partial content serving (HTTP 200/206)
  - Navigate with arrow keys

- 📊 **Stats & Optimization**

  - Usage & cost stats visible outside free tier
  - Optimized chunk sizes for faster file serving
  - KV for caching
  - D1 for persistent data storage

## 🏗️ Architecture

- **Next.js** → Serves client/static files & session checks
- **Cloudflare Workers (Hono.js)** → Handles APIs (auth, files, caching)
- **Cloudflare R2** → File storage (per org)
- **Cloudflare KV** → Caching layer
- **Cloudflare D1** → Persistent database for metadata

## 🚀 Getting Started

### 1. Prerequisites

- **Node.js LTS**: [Download](https://nodejs.org/en/download/package-manager)
- **Cloudflare account** (Free or Paid): [Sign up](https://www.cloudflare.com/)

### 2. Cloudflare Setup

- Create an **R2 bucket** (one per organization if needed)
- Create a **KV namespace** for caching
- Create a **D1 database** for the auth data
- Create an **API token** with access to D1

### 3. Cloudflare Worker

- Deploy a Worker using [Hono.js](https://hono.dev)
- The Worker handles file uploads/downloads, auth, and APIs

### 4. Environment Variables

Create a `.env.local` in the project root, based on `.env.example`.
Fill in credentials for Cloudflare and Better Auth.

### 5. Install & Run

```bash
# Clone repository
git clone https://github.com/r4ultv/archive-space.git
cd archive-space

# Install dependencies
pnpm install

# Start dev server
pnpm run dev
```

Visit → `http://localhost:3000`

## 🛠️ Tech Stack

* [Next.js](https://nextjs.org/)
* [TypeScript](https://www.typescriptlang.org/)
* [Cloudflare Workers](https://developers.cloudflare.com/workers/) + [Hono.js](https://hono.dev)
* [Cloudflare R2](https://developers.cloudflare.com/r2/)
* [Cloudflare KV](https://developers.cloudflare.com/kv/)
* [Cloudflare D1](https://developers.cloudflare.com/d1/)
* [Better Auth](https://better-auth.com)

## 📌 Roadmap

- [ ] Sharing links with permissions
- [ ] File Metadata support
- [ ] Folders
- [ ] Organizations (1 bucket for each)

## 📄 License

MIT © [Raul Carini](https://raulcarini.dev)