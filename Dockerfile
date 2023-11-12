FROM node:18.15.0 as build

#ADD ssl /etc/ssl
WORKDIR /usr/local/app


COPY ./package.json /usr/local/app/
COPY ./package-lock.json /usr/local/app/
RUN npm install

ARG profile
ARG myHref
ARG deployUrl
COPY ./src/ /usr/local/app/src
COPY ./karma.conf.js /usr/local/app/
COPY ./angular.json /usr/local/app/
COPY ./.browserslistrc /usr/local/app/
COPY ./tsconfig.app.json /usr/local/app/
COPY ./tsconfig.json /usr/local/app/
COPY ./tsconfig.spec.json /usr/local/app/

RUN npm run build --  --base-href=$myHref --configuration=$profile --deploy-url=$deployUrl


#Deployment stage
FROM nginx:latest
COPY --from=build /usr/local/app/dist/sa-client-web/ /usr/share/nginx/html/
ADD nginx-files/nginx.conf /etc/nginx/nginx.conf
ADD nginx-files/nginx.vh.default.conf /etc/nginx/conf.d/default.conf
