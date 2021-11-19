#!/bin/bash

cd "$(dirname "$0")" || exit


main() {
  [[ -z ${awsRegion} ]] && error "aws region is required"
  [[ -z ${stage} ]] && error "stage is required"

    

  APP_ID=$(getAppIdFromTeamProviderInfo "${stage}")

  log INFO "Deploy Amplify backend for ${stage} env, app id: ${APP_ID} on ${awsRegion} region"

  export AWS_REGION=${awsRegion}

  initializeAmplifyConfig

  # If env doesnt exist, then it will be created
  echo y | amplify init --amplify "${AMPLIFY}" --providers "${PROVIDERS}" || error "Could not init amplify env"

  log INFO "Pushing backend changes to AWS"
  amplify push --yes --codegen "${CODEGEN}" -c || error "Failed to push changes to AWS"
}

main
