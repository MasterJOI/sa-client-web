# To deploy build&deploy
1. On the server go to  dir with dockerfile (`/opt/dev-sa-client`) and run  `docker build . -t cip/sa-client-dev:0.0.1 --build-arg myHref=/dev/ --build-arg profile=development --build-arg deployUrl=/dev/ `
# 2. Go to the dir (`/opt/npworx-errors/`) and insert there folder with custom error page from Github project (`src/custom_50x`)
3. Run ```docker run  -p 4705:80
   -d
   --restart=always  cip/data-collector-dev:0.0.1 ```

# For PROD

1. On the server go to  dir with dockerfile (`/opt/sa-client`) and run  `docker build . -t cip/sa-client:0.0.1  --build-arg profile=production --build-arg myHref=/ --build-arg deployUrl=/`
# 2. Go to the dir (`/opt/npworx-errors/`) and insert there folder with custom error page from Github project (`src/custom_50x`)
3. Run ```docker run  -p 4704:80
   -d
   --restart=always  cip/data-collector:0.0.1 ```
