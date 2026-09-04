pipeline {
    agent any

    environment {
        NODE_ENV       = 'production'
        IMAGE_NAME     = 'registry.interno.corp/app-ejemplo'
        SONAR_HOST     = 'https://sonar.interno.corp'
        // Credenciales gestionadas por el Credentials Store de Jenkins
        DOCKER_CREDS   = credentials('docker-registry-creds')
        SONAR_TOKEN    = credentials('sonar-token')
        DEPLOY_SSH_KEY = credentials('deploy-ssh-key')
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Lint') {
            steps {
                sh 'npm run lint'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
            }
            post {
                always {
                    // Publicación de resultados de test (plugin JUnit)
                    junit allowEmptyResults: true, testResults: 'reports/junit/*.xml'
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                sh '''
                    sonar-scanner \
                      -Dsonar.projectKey=app-ejemplo \
                      -Dsonar.host.url=${SONAR_HOST} \
                      -Dsonar.login=${SONAR_TOKEN}
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'npm run build'
                sh 'docker build -t ${IMAGE_NAME}:${BUILD_NUMBER} .'
            }
        }

        stage('Push Image') {
            steps {
                sh '''
                    echo ${DOCKER_CREDS_PSW} | docker login registry.interno.corp \
                      -u ${DOCKER_CREDS_USR} --password-stdin
                    docker push ${IMAGE_NAME}:${BUILD_NUMBER}
                '''
            }
        }

        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                sh '''
                    scp -i ${DEPLOY_SSH_KEY} -r public/* \
                      deploy@servidor-web.interno.corp:/var/www/app-ejemplo/
                '''
            }
        }
    }

    post {
        success {
            echo 'Pipeline completado con éxito'
        }
        failure {
            echo 'Pipeline falló'
            // Notificación por correo (plugin Mailer)
            mail to: 'devops@corp.com',
                 subject: "Build fallido: ${JOB_NAME} #${BUILD_NUMBER}",
                 body: "Revisa ${BUILD_URL}"
        }
    }
}
