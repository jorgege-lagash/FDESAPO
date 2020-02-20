pipeline{
	agent {
		node {
			label 'docker-nosudo'//Using nodes on docker-nosudo label
		}
	}
	stages {
		stage('Init'){
			steps{
				slackSendBuildStart(includeGitInfo: true)
			}
		}
		stage('Load Variables From File'){
            parallel {
                stage('Release Develop') {
                    when {
                        branch 'release/develop'
                    }
                    steps {
                        script {
                            load "jenkins-config/release-develop.groovy"
                        }
                    }
                }
				stage('Release Rancher') {
                    when {
                       branch 'release/rancher'
                    }
                    steps {
                        script {
                            load "jenkins-config/release-rancher.groovy"
                        }
                    }
                }
            }
        }
		stage('Sanity Check'){
			agent{
                docker { 
                    image 'node:10.10.0' 
                    label 'docker-nosudo'
			        reuseNode true
				}
			}
			steps{
				sh 'yarn'
				sh 'yarn test:report'
				sh 'yarn lint:report'
			}
		}
		stage('Sonar Qube'){
			when {
				branch 'develop'
		    }
			steps{
				withSonarQubeEnv('Applaudo Sonar Cube 73') {
					sh "${SONARQUBE_HOME}/bin/sonar-scanner"
				}
			}
		}
		stage('Build Process'){
            when {
                anyOf {
                    branch 'release/develop'
					branch 'release/staging'
					branch 'release/production'
                }
            }
            environment {
				REACT_APP_SITE_TITLE="${REACT_APP_SITE_TITLE}"
				REACT_APP_API_URL="${REACT_APP_API_URL}"
				REACT_APP_DEFAULT_LOCALE="${REACT_APP_DEFAULT_LOCALE}"
				REACT_APP_APP_VERSION="${PACKAGE_VERSION}.${BUILD_NUMBER}"
            }
            agent{
                docker { 
                    image 'node:10.10.0' 
                    label 'docker-nosudo'
			        reuseNode true
                }
            }
			steps{
                sh 'yarn'
                sh 'yarn build'
			}
		}
        stage('Deploy To S3'){
            when {
                anyOf {
                    branch 'release/develop'
					branch 'release/staging'
					branch 'release/production'
                }
            }
			steps{
                withAWS(region:PA_AWS_REGION,credentials:PA_AWS_CREDENTIALS) {
                    s3Delete(bucket:PA_AWS_BUCKET_NAME, path:PA_AWS_STORAGE_FOLDER)
                    s3Upload(bucket:PA_AWS_BUCKET_NAME, file:PA_BUILD_FILES, path:PA_AWS_STORAGE_FOLDER);
					cfInvalidate(distribution:PA_CLOUDFRONT_DISTRIBUTION_ID, paths:['/*'], waitForCompletion: true)
                }
			}
		}
		stage('Build and Publish docker'){
			when{
				branch 'release/rancher'
			}
			steps{
				script{
				    docker.withRegistry("https://${DOCKER_REGISTRY_URL}", "ecr:${AWS_REGION}:${AWS_CREDENTIALS}") {
						IMAGE_SERVER = "${DOCKER_REGISTRY_IMAGE_NAME}:${env.PACKAGE_VERSION}.${env.BUILD_NUMBER}"
				        def customImage = docker.build(IMAGE_SERVER,
						"-f ${DOCKER_FILE_IMAGE} \
						 --build-arg ARG_REACT_APP_SITE_TITLE='${REACT_APP_SITE_TITLE}' \
						 --build-arg ARG_REACT_APP_API_URL='${REACT_APP_API_URL}' \
						 --build-arg ARG_REACT_APP_DEFAULT_LOCALE='${REACT_APP_DEFAULT_LOCALE}' \
						 --build-arg ARG_REACT_APP_APP_VERSION='${env.PACKAGE_VERSION}.${env.BUILD_NUMBER}' .")
				        customImage.push()
				    }
			    }
				rancher(endpoint: "$RANCHER_ENDPOINT", environmentId: "$RANCHER_ENVIROMENT_ID", credentialId: 'Rancher_Fisherman_Key', service: "$RANCHER_SERVICE", confirm: true, image: "$DOCKER_REGISTRY_URL/$IMAGE_SERVER", ports: '', environments: '', timeout: 300)
			    //jiraIssuesTransitionHelper projectKey: 'PA', status: 'Ready For Deployment', transition: 'Deploy For QA', component:'CMS'
			}

		}
	}
	environment{		
		SONARQUBE_HOME = tool 'SonarQube Scanner'
		SLACK_CHANNEL = 'arauco-feeds'
		PACKAGE_VERSION = sh (
			script: 'grep -o \'"version": *"[^"]*"\' package.json | grep -o \'[0-9]\\.[0-9]*\\.[0-9]*\'',
			returnStdout: true
		).trim()
	}
	options {
		buildDiscarder(logRotator(numToKeepStr: '15', artifactNumToKeepStr: '15'))
		timeout(time: 30, unit: 'MINUTES')
	}
	 post {
        success {
            slackSendBuildSuccess()
        }
        failure {
            slackSendBuildFailure()
        }
        fixed {
            slackSendBuildFixed()
        }
    }
}