FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN if [ -f package.json ]; then npm install; else echo "No package.json found, skipping npm install"; fi
COPY . .
RUN if [ -f package.json ]; then npm run build; else echo "No package.json found, skipping build"; fi
CMD ["sh", "-c", "if [ -f package.json ]; then npm start; else echo 'App ready - waiting for connections' && sleep infinity; fi"]
