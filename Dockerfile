# ====================== Production Frontend (Nginx) ======================
FROM node:22-alpine AS builder

WORKDIR /app

# Копіюємо package файли
COPY package*.json ./
RUN npm ci --frozen-lockfile

# Копіюємо весь код
COPY . .

# Білдимо фронтенд
RUN npm run build

# ====================== Nginx Server ======================
FROM nginx:alpine

# Копіюємо збілджений фронтенд
COPY --from=builder /app/dist /usr/share/nginx/html

# Копіюємо nginx конфіг
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]