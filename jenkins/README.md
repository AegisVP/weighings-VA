# Setting up Raspberry Pi

- Install Raspberry OS Lite
- Configure SSH
- Connect and configure an external USB
- Install Docker
- Configure Docker to use USB for storage
- Install Portainer
- Install Jenkins

## Install Raspberry OS Lite

- Download Raspberry Pi Imager (<https://www.raspberrypi.com/software/>)
- Select "Raspberry Pi OS Lite (64-bit)" for your board type
- Write the image to a prepared SD card
- After setup is done, make sure to upgrade all packages by running `sudo apt update && sudo apt upgrade -y`

## Configure SSH

- Configure it during the Imager step or
- Enable and configure it manually

## Connect and configure an external USB

- Partition and format the USB stick
- Mount to a path in your filesystem, for example `/mnt/usb`
- Configure automatic mounting by modifying `/etc/fstab`

## Install Docker

- Install by running `curl -sSL https://get.docker.com | sh`
- Give yourself rights by `sudo usermod -aG docker $USER`

## Configure Docker to use USB for storage

- Move docker directories to USB `sudo mv /var/lib/docker /mnt/usb/`
- Create a symlink for docker directories `sudo ln -s /mnt/usb/docker /var/lib/docker`
- Move container directories to USB `sudo mv /var/lib/containerd /mnt/usb/`
- Create a symlink for container directories `sudo ln -s /mnt/usb/containerd /var/lib/containerd`
- Set the correct rights `sudo chmod -R 700 /mnt/usb/docker` and `sudo chmod -R 700 /mnt/usb/containerd`

## Install Portainer (optional)

- Pull the image with `docker pull portainer/portainer-ce:latest`
- Create persistent volume with `docker volume create portainer_data`
- Run the image
  `docker run -d -p 8000:8000 -p 9443:9443 --name=portainer --restart=always -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer-ce:latest`
- Access it at `https://<raspberry-ip-address>:9443`
- You may need to fix a bug:
  - `sudo systemctl edit docker.service`
  - Add `[Service] \n Environment=DOCKER_MIN_API_VERSION=1.24`
  - `sudo systemctl restart docker`

## Install Jenkins

- Copy the `jenkins/Dockerfile` to your raspberry
- Build the custom Jenkins image
  `docker build --build-arg DOCKER_GID=$(getent group docker | cut -d: -f3) -t jenkins-rpi4-arm64 .`
- Run the created image
  `docker run -d -v /var/run/docker.sock:/var/run/docker.sock -v jenkins_home:/var/jenkins_home -p 8080:8080 -p 50000:50000 --name jenkins --restart=always jenkins-rpi4-arm64`
- Configure the environment variables from `.env.template` in the Jenkins Credentials store and save them as a
  secret-file with id `env-file-secret`
- Configure a pipeline to read a `Jenkinsfile` from the jenkins directory of the repository
