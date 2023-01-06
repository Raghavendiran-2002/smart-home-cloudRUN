docker build  --platform linux/amd64 -t smart-home .  
docker tag smart-home gcr.io/gccp-project-373305/smart-home
docker push gcr.io/gccp-project-373305/smart-home  