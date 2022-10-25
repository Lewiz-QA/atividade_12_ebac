pipeline {
    agent any
    
    options {
            ansiColor('xterm')
        }
    stages {
        stage('Clonar o repositório') {
            steps {
                git branch: 'main', url: 'https://github.com/Lewiz-QA/atividade_12_ebac'
            }
        }
        stage('Instalar dependências') {
            steps {
                bat 'npm install'
            }
        }
        stage('Executar Cypress') {
            steps {
                bat 'npm run cy:run'
            }
        }
    }
}
