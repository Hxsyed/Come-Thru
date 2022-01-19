# Come-Thru
[![Netlify Status](https://api.netlify.com/api/v1/badges/77b3afd5-b2ef-4d5a-8ba3-a2e52fa2a111/deploy-status)](https://app.netlify.com/sites/come-thru/deploys)

## Live Website Link
[CCNY Zero Live](https://come-thru.netlify.app/)

Come-Thru Designed for entrance, engineered to last.

This is the frontend service for Come-Thru project. The project is created with the MERN stack (MySQL, Express, React, and Node). Front-end of this project was hosted with `netlify` and the backend was hosted with `heroku`. 

## Group Members Team 8
- Haroon Syed
- Muner Khan 
- Martin Gonzales
- Md Mahmodul Zakir

## Running Locally
First clone the github repo and go into the project directory. Then,
```bash
npm install
npm start dev # run the react.js project in development mode
```
Open http://localhost:3000 to view it in the browser.

## Repository Structure
- `client/come-thru` : This folder contains all front-end-related files. 
  - `src`   
    - `admin/` : The main page for the logged in admin
    - `contexts/` : Has all the authorization & authentication implementation for creating an account, logging in and signing out
    - `footer/` : The code for the footer bar and its many states
    - `navbar/` : The code for the navigation bar and its many states
    - `signIn/` : A page that lets a user log into the website
    - `util/` : Has config functions needed to communicate with the backend
    - `App.js/`: Routes to specific path
    - `index.js`: Browser router and ReactDOM render
- `server` : This folder contains all back-end-related files. 
  - `index` : Contains all the back-end functions
  - `hello.py` : Contains the code to fetch the RFID tag from MFRC-522 scanner
   
## Project Documentation
1. [Come-Thru Powerpoint](https://drive.google.com/file/d/11BTRRMZfQFwb-vi__FjNdz-cUS9OFXV8/view?usp=sharing)
2. [Come-Thru Proposal](https://drive.google.com/file/d/11BTRRMZfQFwb-vi__FjNdz-cUS9OFXV8/view?usp=sharing)  

