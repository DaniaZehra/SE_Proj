FROM node:18-slim

WORKDIR /usr/src/app

# Disable oxide (must be BEFORE install)
ENV TAILWIND_DISABLE_OXIDE=1

COPY package*.json ./

RUN rm -f package-lock.json && npm install --include=dev

COPY . .

RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "dev"]
