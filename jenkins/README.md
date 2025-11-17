# Building and Installing Jenkins

## Save the Dockerfile

## Build Jenkins image on Raspberry PI Docker:

```sh
DOCKER_GID=$(getent group docker | cut -d: -f3)

docker build --build-arg DOCKER_GID=$DOCKER_GID -t jenkins-rpi4-arm64 .

docker run -d \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v jenkins_home:/var/jenkins_home \
  -p 8080:8080 \
  -p 50000:50000 \
  --name jenkins \
  jenkins-rpi4-arm64
```
