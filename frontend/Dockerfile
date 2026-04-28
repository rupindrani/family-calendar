FROM node:18-alpine AS build
WORKDIR /app
COPY package.json ./
# Install with force to resolve ajv peer dep conflict in react-scripts 5
RUN npm install --force
# Explicitly hoist the correct ajv version needed by webpack
RUN npm install ajv@8.12.0 ajv-keywords@5.1.0 --force
COPY public ./public
COPY src ./src
ENV CI=false
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
