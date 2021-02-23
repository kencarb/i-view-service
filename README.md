# i-view-service

Based on: https://serverless-stack.com

...scroll down to The Basics, Build your first Serverless app using AWS Lambda and React.

### features:
- deploys all components via Serverless to CloudFormation, e.g. `i-view-service/serverless.yml` and `i-view-service/resources/*.yml`
- adds additional text field and pick list field to "The Basics" APIs

### to do's and caveats:
- to do: integrate CloudFront Distribution into CF stack
- to do: integrate Route 53? ... not certain if this is desireable
- caveat: this implementation skips the "Secrets and 3rd party APIs" section in "The Basics"
- caveat: `npm test` does not work due to Cognito auth routine
  - testing using mocks is feasible
  - testing using `npx aws-api-gateway-cli-test` is feasible: https://www.npmjs.com/package/aws-api-gateway-cli-test

### deployment:
- using https://aws.amazon.com/cloud9/ is practically a no brainer
- steps...
  - `npm install serverless -g`
  - clone this repo in `environment` path
  - `cd i-view-service/`
  - `npm install`
  - `[npm audit fix]`
  - `sls deploy`
- stack is updated in CloudFormation
- outputs are captured in `i-view-service/.build/stacks.json`
  - also available in CloudFormation stack / Outputs
  - output values are needed to configure React __i-view-app__
