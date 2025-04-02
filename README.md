 upTo run the project run the following commands:

docker ps -a

docker exec -it <container_id for client> sh

For me it was: 87bd20556ae8

npm install

This installs dependencies inside the container.

exit 

docker-compose down

docker-compose up --build
