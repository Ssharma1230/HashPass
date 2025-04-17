# HashPass

HashPass is a password manager that is built as a Google Chrome extension. It helps users generate strong passwords directly in the browser, ensuring strong protection without password storage.

## What HashPass Does

HashPass detects when a password input field appears on any website. Once detected, it prompts users to generate a secure password using a hashing algorithm powered by encrypted salts. These passwords are never stored and are generated in real-time for each login session. The extension also provides an option to disable its functionality on specific sites.

## Why HashPass Is Useful

Traditional password managers store user passwords, making them potential targets for attacks. HashPass avoids this risk by never storing passwords at all. With real-time generation and high-entropy security, users get strong protection against breaches while maintaining ease of use. The Chrome extension format also ensures a seamless browsing experience.

## How To Get Started with HashPass

The extension can be found in the Google Chrome Web Store.

## Baseline Requirements

1. Each generated password must have a minimum of 60 bits of entropy for strength as outlined by NIST Guidelines. 

2. Extension needs to determine anytime a password is needed on a webpage by scraping the web page’s elements. Once a password input field element is detected, a popup will appear, prompting the user to use our password manager to generate a password for that site.

3. Data to be stored in AWS RDS must be encrypted using AES and must not be in plain text before transmitting.

4. A user can disable our password manager for any given website, such that our extension will not pop up on sign-in pages and will not autofill the password fields for the specific site. 

5. The passwords must never be saved, they will always be computed in live time within a 15 second window any time a sign in is required. The algorithm decrypts the encrypted salts which are stored and uses those to compute the hash.

## Who Contributes to the Project

This project is maintained and developed by:

- Xavier Callait
- Shivam Sharma  
- Samarth Girish
