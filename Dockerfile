FROM node:18.15.0 as build

#ADD ssl /etc/ssl
WORKDIR /usr/local/app


COPY ./package.json /usr/local/app/
COPY ./package-lock.json /usr/local/app/
RUN npm install

ARG profile
ARG myHref
COPY ./src/ /usr/local/app/src
COPY ./postcss.config.js /usr/local/app/
COPY ./tailwind.config.js /usr/local/app/
COPY ./angular.json /usr/local/app/
COPY ./tsconfig.app.json /usr/local/app/
COPY ./tsconfig.json /usr/local/app/
COPY ./tsconfig.spec.json /usr/local/app/

RUN npm run build --base-href=$myHref --configuration=$profile


#Deployment stage
FROM nginx:latest
COPY --from=build /usr/local/app/dist/sa-client-web/ /usr/share/nginx/html/
ADD nginx-files/nginx.conf /etc/nginx/nginx.conf
ADD nginx-files/nginx.vh.default.conf /etc/nginx/conf.d/default.conf
