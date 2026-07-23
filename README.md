# Fazerlane

Fazerlane is a full stack learning platform that transforms YouTube tutorials into structured learning lanes. It uses Google Gemini to organize content and Qdrant to provide semantic recommendations. The application also includes features to track your progress as you learn.

## Features

The platform uses Google Gemini to automatically structure YouTube tutorials and educational videos into coherent, step by step learning paths. It uses a Qdrant vector database and pgvector to suggest related content based on your preferences and what you are currently studying. You can track your learning journey through built in progress monitoring and state management. The user interface is built with Next.js 15, Tailwind CSS, and Framer Motion to provide an interactive experience. The backend services run on Bun, Express, and PostgreSQL to handle data and traffic. We use Redis and BullMQ to process background tasks like video processing and content structuring. You can also take notes and write descriptions using the integrated Tiptap rich text editor, which supports Markdown.

## Technology Stack

### Frontend (`/ui`)
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Components**: [Radix UI](https://www.radix-ui.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching**: [React Query (@tanstack/react-query)](https://tanstack.com/query/latest)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

### Backend (`/backend`)
- **Runtime**: [Bun](https://bun.sh/)
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL (with [`pgvector`](https://github.com/pgvector/pgvector))
- **Vector Database**: [Qdrant](https://qdrant.tech/)
- **Caching & Queues**: Redis + [BullMQ](https://docs.bullmq.io/)
- **AI Integration**: Google Gemini API (`@google/genai`), OpenAI (optional embeddings)
- **Storage**: AWS S3 / Cloudflare R2 compatibility

## Project Structure

The project is divided into two main directories. The backend directory contains the Bun and Express server code. Inside this directory, you will find the source code, database migrations, and the Docker Compose file used to start the database, Redis, and Qdrant. The backend dependencies are listed in its package.json file.

The ui directory contains the Next.js frontend application. This directory holds the Next.js App Router pages, reusable components, and Zustand state stores. The frontend dependencies are managed in its respective package.json file.

## Getting Started

You will need to install a few tools on your local machine before you can run the project. Please ensure you have Bun version 1.0 or higher, Node.js version 20 or higher, and pnpm installed. You also need Docker and Docker Compose to run the infrastructure services. Finally, you will need an API key for Google Gemini, and optionally an OpenAI API key if you plan to use their embeddings.

You can begin by cloning the repository to your local machine.

```bash
git clone https://github.com/Lakaka-Labs/fazerlane.git
cd fazerlane
```

Next, you need to set up the infrastructure. Fazerlane relies on PostgreSQL, Redis, and Qdrant. You can start these services using the Docker Compose file located in the backend directory.

```bash
cd backend
docker-compose up -d stgres redis qdrant
```

This command will start PostgreSQL on port 5433, Redis on port 6379, and Qdrant on port 6333.

After the infrastructure is running, you can set up the backend server. Stay in the backend directory and install the dependencies using Bun.

```bash
bun install
```

You will need to create a configuration file for your environment variables. Copy the example file and update it with your database credentials and API keys.

```bash
cp .env.example .env
```

Once your environment variables are configured, you can run the database migrations and start the development server.

```bash
bun run migrate
bun run dev
```

The backend server will start running on port 5000.

Now you can set up the frontend application. Open a new terminal window and navigate to the ui directory.

```bash
cd ../ui
```

Install the frontend dependencies using pnpm.

```bash
pnpm install
```

Create a local environment configuration file based on the example provided. You will need to update this file to point to your backend API URL, which is usually http://localhost:5000.

```bash
cp .env.example .env.local
```

Finally, start the Next.js development server.

```bash
pnpm run dev
```

The frontend application will start running on port 3000.

## Contributing

We welcome contributions to the project. If you would like to help, please fork the repository and create a feature branch for your changes. You can then commit your work and push the branch to your fork. Once your changes are ready, please open a pull request for review.

## License

This project is licensed under the MIT License. You can read the LICENSE file for more details.
