pipeline {
    agent any
    
    environment {
        IMAGE_NAME = 'graintrack'
        IMAGE_TAG = "${env.BUILD_NUMBER}"
        DOCKER_BUILDKIT = '1'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    echo "Building Docker image ${IMAGE_NAME}:${IMAGE_TAG}"
                    sh """
                        docker build \
                            -f ./api/Dockerfile \
                            -t ${IMAGE_NAME}:${IMAGE_TAG} \
                            -t ${IMAGE_NAME}:latest \
                            .
                    """
                }
            }
        }
        
        stage('Verify Image') {
            steps {
                script {
                    echo "Verifying image was built successfully"
                    sh "docker images ${IMAGE_NAME}"
                }
            }
        }
        
        stage('Cleanup Old Images') {
            steps {
                script {
                    echo "Cleaning up dangling images"
                    sh """
                        docker image prune -f
                    """
                }
            }
        }
    }
    
    post {
        success {
            echo "Successfully built and tagged ${IMAGE_NAME}:${IMAGE_TAG} and ${IMAGE_NAME}:latest"
        }
        failure {
            echo "Build failed for ${IMAGE_NAME}"
        }
        always {
            echo "Pipeline execution completed"
        }
    }
}
