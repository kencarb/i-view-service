const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
const CognitoUser = AmazonCognitoIdentity.CognitoUser;
const AuthenticationDetails = AmazonCognitoIdentity.AuthenticationDetails;
const AWS = require('aws-sdk');
const Promise = require("promise");
const stack = require('../.build/stack.json');
const sigV4Client = require("../libs/sigV4Client.js");
global.fetch = require('node-fetch');

module.exports.login = function(username, password) {
  const userPool = new CognitoUserPool({
    UserPoolId: stack.UserPoolId,
    ClientId: stack.UserPoolClient
  });
  const user = new CognitoUser({ Username: username, Pool: userPool });
  const authenticationData = { Username: username, Password: password };
  const authenticationDetails = new AuthenticationDetails(authenticationData);

  return new Promise((resolve, reject) =>
    user.authenticateUser(authenticationDetails, {
      onSuccess: result => resolve(),
      onFailure: err => reject(err)
    })
  );
};

//module.exports.getUserToken = function(currentUser) {
function getUserToken(currentUser) {
  return new Promise((resolve, reject) => {
    currentUser.getSession(function(err, session) {
      if (err) {
        reject(err);
        return;
      }
      resolve(session.getIdToken().getJwtToken());
    });
  });
}

//module.exports.getCurrentUser = function() {
function getCurrentUser() {
  const userPool = new CognitoUserPool({
    UserPoolId: stack.UserPoolId,
    ClientId: stack.UserPoolClient
  });
  return userPool.getCurrentUser();
}

//module.exports.getAwsCredentials = function(userToken) {
function getAwsCredentials(userToken) {
  const authenticator = `cognito-idp.${stack.AwsRegion}.amazonaws.com/${stack.UserPoolId}`;

  AWS.config.update({ region: stack.AwsRegion });

  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: stack.IdentityPoolId,
    Logins: {
      [authenticator]: userToken
    }
  });

  return AWS.config.credentials.getPromise();
}

module.exports.invokeApig = function({
  path,
  method = "GET",
  headers = {},
  queryParams = {},
  body
}) {

  const currentUser = getCurrentUser();

  const userToken = (async () => { await getUserToken(currentUser) })();

  (async () => {
    await getAwsCredentials(userToken);
  })();

  const signedRequest = sigV4Client
    .newClient({
      accessKey: AWS.config.credentials.accessKeyId,
      secretKey: AWS.config.credentials.secretAccessKey,
      sessionToken: AWS.config.credentials.sessionToken,
      region: stack.AwsRegion,
      endpoint: stack.ServiceEndpoint
    })
    .signRequest({
      method,
      path,
      headers,
      queryParams,
      body
    });

  body = body ? JSON.stringify(body) : body;
  headers = signedRequest.headers;

  const results = (async () => { await global.fetch(signedRequest.url, {
    method,
    headers,
    body
  })})();

  if (results.status !== 200) {
    throw new Error((async () => { await results.text()}))();
  }

  return results.json();
};