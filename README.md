# Come-Thru
[![Netlify Status](https://api.netlify.com/api/v1/badges/77b3afd5-b2ef-4d5a-8ba3-a2e52fa2a111/deploy-status)](https://app.netlify.com/sites/come-thru/deploys)

## Live Website Link
[CCNY Zero Live](https://come-thru.netlify.app/)

Come-Thru Designed for entrance, engineered to last.

This is the frontend service for Come-Thru project. The project is created with the MERN stack (MySQL, Express, React, and Node).

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
- `client/come-thru`
  - `src`   
    - `admin/` : A page that lets a user log into the website
    - `contexts/` : Has all the authorization & authentication implementation for creating an account, logging in and signing out.
    - `navbar/` : The code for the navigation bar and its may states
    - `components/` : tab files
    - `App.js/`: Routes to specific path
    - `index.js`: Browser router and ReactDOM render

