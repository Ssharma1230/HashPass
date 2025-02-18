# HashPass 

HashPass is a password manager that is built as a Google Chrome extension. 

## Baseline Requirements

1. Each generated password must have a minimum of 60 bits of entropy for strength as outlined by NIST Guidelines. 

2. Extension needs to determine anytime a password is needed on a webpage by scraping the web page’s elements. Once a password input field element is detected, a popup will appear, prompting the user to use our password manager to generate a password for that site.

3. Data to be stored in AWS RDS must be encrypted using AES and must not be in plain text before transmitting.

4. A user can disable our password manager for any given website, such that our extension will not pop up on sign-in pages and will not autofill the password fields for the specific site. 

5. The passwords must never be saved, they will always be computed in live time within a 15 second window any time a sign in is required. The algorithm decrypts the encrypted salts which are stored and uses those to compute the hash.

## Contributers

Shivam Sharma
Samarth Girish
Xavier Callait