FROM node:18-bullseye

WORKDIR /app

# Установка Java
RUN apt-get update && apt-get install -y openjdk-11-jdk

# Копирование зависимостей
COPY package.json yarn.lock ./

# Установка Yarn
# RUN npm install -g yarn
RUN yarn install --ignore-platform

# RUN yarn install

# Копирование исходного кода
COPY . .

CMD ["yarn", "ios"]
