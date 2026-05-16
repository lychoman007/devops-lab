pipeline {
  agent any

  environment {
    CI = "true"
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
}