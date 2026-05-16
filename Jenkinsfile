pipeline {
  agent any

  environment {
    CI = "true"
    BACKEND_IMAGE = "devops-lab-backend:jenkins"
    FRONTEND_IMAGE = "devops-lab-frontend:jenkins"
    TELEGRAM_CHAT_ID = "8720333443"
  }

  stages {

    stage("Checkout") {
      steps {
        checkout scm
      }
    }

    stage("Backend Test") {
      steps {
        dir("backend") {
          sh "npm ci"
          sh "npm test"
        }
      }
    }

    stage("Frontend Test") {
      steps {
        dir("frontend") {
          sh "npm ci"
          sh "npm test -- --watchAll=false"
        }
      }
    }

    stage("Trivy FS Scan") {
      steps {
        sh "trivy fs --severity HIGH,CRITICAL --exit-code 1 --no-progress ."
      }
    }

    stage("Build Images For Scan") {
      steps {
        sh "docker build -t ${BACKEND_IMAGE} ./backend"
        sh "docker build -t ${FRONTEND_IMAGE} ./frontend"
      }
    }

    stage("Trivy Image Scan") {
      steps {
        sh "trivy image --severity HIGH,CRITICAL --exit-code 1 --no-progress ${BACKEND_IMAGE}"
        sh "trivy image --severity HIGH,CRITICAL --exit-code 1 --no-progress ${FRONTEND_IMAGE}"
      }
    }

    stage("Deploy To App VM") {
      steps {
        sh """
          ssh -o StrictHostKeyChecking=no vagrant@192.168.56.11 '
            cd /vagrant &&
            docker compose down &&
            docker compose up --build -d
          '
        """
      }
    }

    stage("Smoke Test") {
      steps {
        sh "curl --fail http://192.168.56.11/api/health"
      }
    }
  }

  post {

    success {
      withCredentials([
        string(credentialsId: 'telegram-bot-token', variable: 'TELEGRAM_BOT_TOKEN')
      ]) {

        sh """
          curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
          -d chat_id="${TELEGRAM_CHAT_ID}" \
          --data-urlencode text="SUCCESS: ${JOB_NAME} #${BUILD_NUMBER} ${BUILD_URL}"
        """
      }
    }

    failure {
      withCredentials([
        string(credentialsId: 'telegram-bot-token', variable: 'TELEGRAM_BOT_TOKEN')
      ]) {

        sh """
          curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
          -d chat_id="${TELEGRAM_CHAT_ID}" \
          --data-urlencode text="FAILED: ${JOB_NAME} #${BUILD_NUMBER} ${BUILD_URL}"
        """
      }
    }

    always {
      sh "docker image rm -f ${BACKEND_IMAGE} ${FRONTEND_IMAGE} || true"
    }
  }
}