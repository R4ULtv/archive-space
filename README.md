<img alt="Archive Space - Simple Archive with Cloudflare R2" src="https://www.raulcarini.dev/api/dynamic-og?title=Archive%20Space&description=Simple%20Archive%20with%20Cloudflare%20R2">

This repository provides a simple website for managing your personal archive using Next.js and Cloudflare R2. The application allows users to save files in the cloud and organize them by categories and tags.

## Prerequisites
- Node.js: Download and install the LTS version of Node.js from the official website: [Node.js Download](https://nodejs.org/en/download/package-manager).
- Cloudflare Account: A free or paid Cloudflare account is required. You can create an account at [Cloudflare](https://www.cloudflare.com/).

## Installation

### 1. Cloudflare Account + API Key:

- Go to [Cloudflare](https://www.cloudflare.com/) and create a new account or log in to your existing account.
- In the Cloudflare dashboard, click on "R2" in the left-hand menu.
- Click on "Create bucket".
- Give your bucket a name and select the region where you want to create it.
- Create an API key for the r2 bucket. Check on your [profile page](https://dash.cloudflare.com/profile/api-tokens).

### 2. Set up your environment variables:

- Create a `.env.local` file in the root directory of the project.
- You need to follow the example on `.env.example` and fill in all the steps.

### 3. Install the repository locally:

- Open a terminal and navigate to the directory where you want to install the repository.
- Run the following command to clone the repository:

```bash
# Clone the repository:
git clone https://github.com/r4ultv/archive-space.git
# Navigate into the project directory:
cd archive-space
# Install the dependencies using npm:
npm install
```

### 4. Run the development server:

In the repository directory, run the following command to start the development server:

```bash
# Start the development server:
npm run dev
```

### 5. Open your browser:

Navigate to `http://localhost:3000` to view the application.
