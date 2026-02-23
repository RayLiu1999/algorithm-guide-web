# Build Stage
FROM node:20-alpine AS build

WORKDIR /app

# 複製 package 檔案並安裝依賴
COPY package*.json ./
RUN npm install

# 複製原始碼並執行編譯
COPY . .
RUN npm run build

# Production Stage
FROM nginx:stable-alpine

# 從編譯階段複製靜態檔案
COPY --from=build /app/dist /usr/share/nginx/html

# 複製自訂的 Nginx 配置以支援 SPA 路由
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
