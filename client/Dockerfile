FROM node:22-slim

WORKDIR /usr/src/app
ENV TAILWIND_DISABLE_OXIDE=1
COPY package*.json ./
RUN npm install --include=dev
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0"]