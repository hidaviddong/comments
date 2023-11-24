FROM node:18-alpine as builder

# 创建工作目录
WORKDIR /app

# 缓存优化
COPY package.json package-lock.json /app/

RUN npm install

COPY . /app

RUN npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder app/my_app /usr/share/nginx/html/my_app