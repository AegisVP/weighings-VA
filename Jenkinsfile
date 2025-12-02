pipeline {
    agent any

    environment {
        // Docker configuration
        COMPOSE_PROJECT_NAME = 'graintrack'

        // Paths
        DOCKER_COMPOSE_FILE = 'docker-compose.yaml'
        ENV_FILE = '.env'
    }

    options {
        // Keep last 5 builds
        buildDiscarder(logRotator(numToKeepStr: '5'))
        disableConcurrentBuilds()
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    echo "🔍 Checking out repository..."
                    checkout scm
                }
            }
        }

        stage('Load Environment Secrets') {
            steps {
                script {
                    echo "🔐 Loading environment secrets from Jenkins credentials..."
                    withCredentials([file(credentialsId: 'env-file-secret', variable: 'ENV_FILE_SECRET')]) {
                        sh '''
                            # Copy the secret file to .env
                            cp "${ENV_FILE_SECRET}" "${ENV_FILE}"
                            chmod 600 ${ENV_FILE}
                            echo "✅ .env file created securely from secret file"
                        '''
                    }
                }
            }
        }

        stage('Validate Configuration') {
            steps {
                script {
                    echo "✔️ Validating .env file and docker compose configuration..."
                    sh '''
                        # Check if .env file exists and is readable
                        if [ ! -f "${ENV_FILE}" ]; then
                            echo "❌ ERROR: .env file not found!"
                            exit 1
                        fi

                        docker compose --env-file ${ENV_FILE} -f ${DOCKER_COMPOSE_FILE} config > /dev/null
                        if [ $? -eq 0 ]; then
                            echo "✅ docker-compose.yaml is valid"
                        else
                            echo "❌ ERROR: docker-compose.yaml has syntax errors!"
                            exit 1
                        fi

                        # Check required environment variables
                        echo "📋 Environment variables to be used:"
                        grep -v '^#' ${ENV_FILE} | grep -v '^$' | sed 's/=.*/=***/' | sort
                    '''
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    echo "🔨 Building Docker images with docker compose..."
                    sh '''
                        docker compose --env-file ${ENV_FILE} -f ${DOCKER_COMPOSE_FILE} --project-name ${COMPOSE_PROJECT_NAME} build

                        if [ $? -eq 0 ]; then
                            echo "✅ Docker images built successfully"
                            docker volume create ${COMPOSE_PROJECT_NAME}-postgres-data
                        else
                            echo "❌ ERROR: Docker build failed!"
                            exit 1
                        fi
                    '''
                }
            }
        }

        stage('Restart Containers') {
            steps {
                script {
                    echo "🔄 Restarting docker compose services..."
                    sh '''
                        # Stop existing containers gracefully
                        docker compose --env-file ${ENV_FILE} -f ${DOCKER_COMPOSE_FILE} --project-name ${COMPOSE_PROJECT_NAME} down

                        # Wait a moment for cleanup
                        sleep 5

                        # Start new containers
                        docker compose --env-file ${ENV_FILE} -f ${DOCKER_COMPOSE_FILE} --project-name ${COMPOSE_PROJECT_NAME} up -d

                        echo "✅ Containers restarted successfully"
                    '''
                }
            }
        }

        stage('Health Check') {
            steps {
                script {
                    echo "🏥 Performing health checks..."
                    sh '''
                        # Display container statuses
                        docker compose --env-file ${ENV_FILE} -f ${DOCKER_COMPOSE_FILE} --project-name ${COMPOSE_PROJECT_NAME} ps
                    '''
                }
            }
        }
    }

    post {
        always {
            script {
                echo "🧹 Cleaning up..."
                sh '''
                    # Remove the local .env file to avoid secrets in workspace
                    rm -f ${ENV_FILE}
                '''
            }
        }

        success {
            script {
                echo "✅ Pipeline completed successfully!"
            }
        }

        failure {
            script {
                echo "❌ Pipeline failed!"
            }
        }

        unstable {
            script {
                echo "⚠️ Pipeline is unstable"
            }
        }
    }
}
