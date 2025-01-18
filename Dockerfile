
FROM node:20-alpine AS build

WORKDIR /home/app

COPY package*.json .

RUN npm install

COPY ./src ./src

COPY ./public ./public

COPY ./nginx ./nginx

COPY components.json  jsconfig.json postcss.config.js tailwind.config.js vite.config.js index.html .

ARG API_HOST

ARG API_PORT

ARG DASHBOARD_HOST

ARG DASHBOARD_PORT

ENV VITE_API_HOST=$API_HOST 

ENV VITE_API_PORT=$API_PORT 

ENV DASHBOARD_PORT=$DASHBOARD_PORT 

ENV DASHBOARD_HOST=$DASHBOARD_HOST 

RUN npm run build

FROM nginx:stable-alpine AS production

COPY --from=build /home/app/nginx /etc/nginx/conf.d

COPY --from=build /home/app/dist /usr/share/nginx/html

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]

# EXPOSE $DASHBOARD_PORT

# CMD npm run preview

