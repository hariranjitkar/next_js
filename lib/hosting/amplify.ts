import { SecretValue } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as amplify from '@aws-cdk/aws-amplify-alpha'
import { BuildSpec } from 'aws-cdk-lib/aws-codebuild'

type AmplifyHostingProps = {
	appName: "fullstack-amplify-example"
	branch: "master"
	ghOwner: "hariranjitkar"
	repo: "next_js"
	ghTokenName: "github-token-ex"
}

export function createAmplifyHosting(
	scope: Construct,
	props: AmplifyHostingProps
) {
	const amplifyApp = new amplify.App(scope, `${props.appName}-hosting`, {
		appName: `${props.appName}`,
		sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
			owner: props.ghOwner,
			repository: props.repo,
			oauthToken: SecretValue.secretsManager(props.ghTokenName),
		}),
		platform: amplify.Platform.WEB_COMPUTE,
		autoBranchDeletion: true,
		customRules: [
			{
				source: '/<*>',
				target: '/index.html',
				status: amplify.RedirectStatus.NOT_FOUND_REWRITE,
			},
		],
		environmentVariables: {
			myAmplifyEnv: 'frontend', //process.env.myAmplifyEnv
		},
		
	})

	amplifyApp.addBranch(props.branch, {
		stage: props.branch === 'master' ? 'PRODUCTION' : 'DEVELOPMENT',
		branchName: props.branch,
	})

    amplify.Platform.WEB_COMPUTE

	return amplifyApp
}