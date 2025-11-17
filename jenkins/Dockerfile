FROM arm64v8/openjdk:21-jdk

ARG DOCKER_GID=999

USER root

# Install essential packages
RUN apt-get update
RUN apt-get install -y --no-install-recommends \
    git \
    curl \
    wget \
    gnupg \
    lsb-release \
    ca-certificates \
    apt-transport-https
RUN rm -rf /var/lib/apt/lists/*
RUN install -m 0755 -d /etc/apt/keyrings
RUN curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
RUN chmod a+r /etc/apt/keyrings/docker.asc
RUN echo "deb [arch=arm64 signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
RUN apt-get update
RUN apt-get install -y --no-install-recommends docker-ce-cli
RUN rm -rf /var/lib/apt/lists/*
RUN useradd -m -u 1000 jenkins
RUN groupadd -g ${DOCKER_GID} docker || groupmod -g ${DOCKER_GID} docker
RUN usermod -aG docker jenkins
RUN mkdir -p /usr/share/jenkins
RUN JENKINS_LTS_VERSION=$(curl -s https://updates.jenkins.io/current/latestCore.txt) && curl -fsSL https://repo.jenkins-ci.org/public/org/jenkins-ci/main/jenkins-war/${JENKINS_LTS_VERSION}/jenkins-war-${JENKINS_LTS_VERSION}.war -o /usr/share/jenkins/jenkins.war
RUN chmod 644 /usr/share/jenkins/jenkins.war
ENV JENKINS_HOME=/var/jenkins_home
ENV JENKINS_USER=jenkins
ENV JENKINS_UID=1000
ENV JENKINS_GID=1000
RUN mkdir -p ${JENKINS_HOME}
RUN chown -R ${JENKINS_UID}:${JENKINS_GID} ${JENKINS_HOME}

EXPOSE 8080 50000

USER jenkins

ENTRYPOINT ["java", "-jar", "/usr/share/jenkins/jenkins.war"]