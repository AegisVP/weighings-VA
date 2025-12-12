FROM debian:bookworm-slim

ARG DOCKER_GID=999

USER root

# Update package manager and install required packages
RUN apt-get update && \
    apt-get install -y --no-install-recommends openjdk-17-jdk-headless git curl wget gnupg lsb-release ca-certificates apt-transport-https && \
    rm -rf /var/lib/apt/lists/*

# Create directory for Docker keyring and install Docker GPG key
RUN install -m 0755 -d /etc/apt/keyrings && \
    curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc && \
    chmod a+r /etc/apt/keyrings/docker.asc && \
    echo "deb [arch=arm64 signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# Update package manager for Docker packages and install Docker CLI and plugins
RUN apt-get update && \
    apt-get install -y --no-install-recommends docker-ce-cli docker-buildx-plugin docker-compose-plugin && \
    rm -rf /var/lib/apt/lists/*

# Create jenkins user and download Jenkins
RUN useradd -m -u 1000 jenkins && \
    groupadd -g ${DOCKER_GID} docker || groupmod -g ${DOCKER_GID} docker && \
    usermod -aG docker jenkins && \
    mkdir -p /usr/share/jenkins && \
    curl -fsSL "https://updates.jenkins-ci.org/latest/jenkins.war" -o /usr/share/jenkins/jenkins.war && \
    chmod 644 /usr/share/jenkins/jenkins.war

# Set environment variables
ENV JENKINS_HOME=/var/jenkins_home
ENV JENKINS_USER=jenkins
ENV JENKINS_UID=1000
ENV JENKINS_GID=1000

# Create jenkins home directory
RUN mkdir -p ${JENKINS_HOME} && \
    chown -R ${JENKINS_UID}:${JENKINS_GID} ${JENKINS_HOME}

# Expose Jenkins ports
EXPOSE 8080 50000

# Switch to jenkins user
USER jenkins

# Start Jenkins
ENTRYPOINT ["java", "-Dfile.encoding=UTF-8", "-jar", "/usr/share/jenkins/jenkins.war"]