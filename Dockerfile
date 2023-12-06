FROM docker.io/node:16 as node
WORKDIR /app
COPY . .
RUN npm install
RUN npm install -g @angular/cli@latest
RUN npm run build --prod

FROM docker.io/nginx:alpine
COPY --from=node /app/dist/second-app /usr/share/nginx/html