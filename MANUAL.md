# User Manual:

## Sign Up for HashPass:
On the HashPass webpage, users can sign up for HashPass.
Users enter basic personal information such as name, email, and phone number.

In addition, users will enter answers to security questions.
Finally, users will create their “simple passphrase” which will be used to access the password vault.

## Using HashPass

When a HashPass account is created, the user must download the extension from the Google Chrome Web Store

When a login field is detected by the extension on any webpage the user is on, the HashPass extension will pop-up

If the user already has an account with that webpage, the extension will prompt the user to enter their simple passphrase and will calculate the secure password.

If the user does not have an account with that webpage, HashPass will ask the user if they would like to generate a secure password for that webpage. If yes, a secure password will be generated.

# Developing off Hashpass

For this part, you will need an Amazon Web Server account for the cloud infrastructure and Google Developer account for uploading the extension

An API spec of the cloud infrastructure has been provided in the openapi.yml file

## Building the extension

Navigate to the extension/src/hashpass/directory

Run the `npm install` followed by `npm run build` to create the project

A build directory should have been created or modified upon completion of these commands

Upload the build directory to the Google Chrome extension developer page 

The HashPass extension will now be added to your Google Chrome extensions list

## Launching Cloud Infrastructure

Using your AWS account, you will need to login through the AWS CLI before proceeding to the next steps and you will need to download Terraform CLI

Ensure that for each directory in the aws/src/lambdas there is a zip file in the aws/src/terraform directory

If there is not a zip file, then zip the index.js (which can be obtained by doing `npx tsc` for each lambda) and the node_modules folder, move this .zip file into the aws/src/terraform directory

Navigate to the aws/src/terraform directory and enter the command `terraform init` to initialize a terraform project

Run the commands `terraform fmt` then `terraform validate` which will detect any errors and fix notation

You will be prompted for different variable names such as database names and passwords which will be used to initialize the resources

Run the commands `terraform plan` to show what will be changed on your AWS account

Finally enter `terraform apply -auto-approve` which will create or update the resources on AWS

Each time a change is a made, they will need to be applied again