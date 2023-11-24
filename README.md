# To deploy build&deploy
1. On the server go to  dir with dockerfile (`/opt/dev-sa-client`) and run  `docker build . -t ipze/sa-client-dev:0.0.1 --build-arg myHref=/dev/ --build-arg profile=development --build-arg deployUrl=/dev/ `
2. Go to the dir (`/opt/acs-ipze-errors/`) and insert there folder with custom error page from Github project (`src/custom_50x`)
3. Run ```docker run  -p 4705:80
   -d
   --restart=always  --name sa-client sa-client-dev:0.0.1 ```

# For PROD

1. On the server go to  dir with dockerfile (`/opt/sa-client`) and run  `docker build . -t cip/sa-client:0.0.1  --build-arg profile=production --build-arg myHref=/ --build-arg deployUrl=/`
2. Go to the dir (`/opt/acs-ipze-errors/`) and insert there folder with custom error page from Github project (`src/custom_50x`)
3. Run ```docker run  -p 4704:80
   -d
   --restart=always  --name sa-client sa-client-dev:0.0.1 ```

# Local dev server
1. Run ``` npm install ``` in project root folder.
2. Run ``` ng serve ``` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.
