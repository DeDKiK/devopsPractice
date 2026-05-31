# devopsPractice

> A containerized full-stack application setup integrated with DevOps monitoring and orchestration.

![GitHub stars](https://img.shields.io/github/stars/DeDKiK/devopsPractice?style=for-the-badge&logo=github) ![GitHub forks](https://img.shields.io/github/forks/DeDKiK/devopsPractice?style=for-the-badge&logo=github) ![GitHub issues](https://img.shields.io/github/issues/DeDKiK/devopsPractice?style=for-the-badge&logo=github) ![Last commit](https://img.shields.io/github/last-commit/DeDKiK/devopsPractice?style=for-the-badge&logo=github) ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white) ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=white) ![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

## 📑 Table of Contents

- [Description](#description)
- [Key Features](#key-features)
- [Use Cases](#use-cases)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Key Dependencies](#key-dependencies)
- [Available Scripts](#available-scripts)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Development Setup](#development-setup)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 📝 Description

devopsPractice is a practical, full-stack application template designed to demonstrate and practice modern DevOps workflows, including containerization, orchestration, and system monitoring. The application couples a responsive React frontend built with Vite with an Express.js backend API, presenting a realistic environment for deploying web apps.

The backend server leverages MongoDB for data persistence and implements the prom-client library to collect default metrics along with custom counters and histograms tracking HTTP requests. On the deployment side, the project comes pre-configured with a root Dockerfile, docker-compose configuration, Nginx web serving, Kubernetes manifests, Helm charts, and Infrastructure as Code configurations.

## ✨ Key Features

- **📈 Prometheus Metric Instrumentation** — Exposes performance metrics like HTTP request totals and latency histograms using the prom-client library in the Express backend.
- **🐳 Dockerized Multi-Container Setup** — Provides a production-ready Dockerfile, docker-compose.yml, and custom Nginx configuration for easy local and staging orchestration.
- **☸️ Kubernetes and Helm Configuration** — Includes dedicated k8s manifests and Helm charts to support deployment and horizontal scaling in Kubernetes clusters.
- **⚡ React and Vite Frontend** — Utilizes React with Vite for hot-reloading development server capabilities and static asset builds optimized for production.
- **🧪 Vitest Test Runner Integration** — Comes pre-configured with Vitest for testing backend APIs and React components using standard test execution scripts.
- **🗄️ MongoDB Client Connection** — Connects to a MongoDB database inside the backend Express API using the official MongoClient driver.

## 🎯 Use Cases

- Setting up local development environments using Docker Compose to mimic production containers.
- Deploying a scalable application package onto a Kubernetes cluster using pre-configured Helm charts.
- Monitoring application request volume and latency in real time using Prometheus metrics.
- Practicing Infrastructure as Code (IaC) provisioning and CI/CD pipelines for full-stack Node.js projects.

## 🛠️ Tech Stack

- 🐳 **Docker**
- 🚀 **Express.js**
- 🟨 **JavaScript**
- ⚛️ **React**
- ⚡ **Vite**

**Notable libraries:** Vitest

## ⚡ Quick Start

```bash

# 1. Clone the repository
git clone https://github.com/DeDKiK/devopsPractice.git

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

## 📦 Key Dependencies

```
body-parser: ^2.2.2
cors: ^2.8.6
express: ^5.2.1
mongodb: ^7.2.0
react: ^19.2.5
react-dom: ^19.2.5
vitest: ^4.1.7
```

## 🚀 Available Scripts

- **dev** — `npm run dev`
- **build** — `npm run build`
- **lint** — `npm run lint`
- **preview** — `npm run preview`
- **test** — `npm run test`

## 🌐 API Endpoints

Detected endpoints (best-effort scan):

```
GET /metrics
GET /api/get-profile
POST /api/update-profile
GET /health
```

## 📁 Project Structure

```
.
├── Dockerfile
├── IaC
│   └── terraform
│       ├── enviroments
│       │   └── dev
│       │       ├── main.tf
│       │       └── providers.tf
│       └── modules
│           └── app
│               └── main.tf
├── backend
│   ├── Dockerfile
│   ├── package.json
│   ├── server.js
│   └── server.test.js
├── docker-compose.yml
├── eslint.config.js
├── helm
│   └── devops-practice
│       ├── Chart.yaml
│       ├── templates
│       │   ├── backend-deployment.yaml
│       │   ├── frontend-deployment.yaml
│       │   ├── hpa-backend.yaml
│       │   ├── hpa-frontend.yaml
│       │   ├── ingress.yaml
│       │   ├── mongo-deployment.yaml
│       │   ├── mongo-express.yaml
│       │   ├── mongo-pvc.yaml
│       │   ├── namespace.yaml
│       │   └── services.yaml
│       └── values.yaml
├── index.html
├── k8s
│   └── base
│       ├── backend.yml
│       ├── configmap.yml
│       ├── frontend.yml
│       ├── hpa-backend.yml
│       ├── hpa-frontend.yml
│       ├── ingress.yml
│       ├── mongo-express.yml
│       ├── mongo.yaml
│       └── namespace.yml
├── nginx.conf
├── package.json
├── prometheus
│   └── prometheus.yml
├── public
│   ├── favicon.svg
│   └── icons.svg
├── src
│   ├── App.css
│   ├── App.jsx
│   ├── app.test.js
│   ├── assets
│   │   └── images.jpeg
│   ├── index.css
│   └── main.jsx
└── vite.config.js
```

## 🛠️ Development Setup

### Node.js / JavaScript
1. Install Node.js (v18+ recommended)
2. Install dependencies: `npm install` (or `yarn` / `pnpm install` / `bun install`)
3. Start the dev server: see the **Quick Start** above

### Docker
1. `docker build -t my-app .`
2. `docker run -p 3000:3000 my-app`

## 🧪 Testing

This project uses **Vitest** for testing.

```bash
npm run test
```

## 🚢 Deployment

### Docker
```bash
docker build -t devopspractice .
docker run -p 3000:3000 devopspractice
```

### Docker Compose
```bash
docker compose up -d
```

> ⚙️ CI/CD is configured via GitHub Actions (see `.github/workflows/`).
