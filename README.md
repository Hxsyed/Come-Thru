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
- `Admin-Website` : This folder contains Full stack Website files. 
  - `client/come-thru` : This folder contains all front-end-related files. 
    - `src`   
      - `admin/` : The main page for the logged in admin
      - `contexts/` : Has all the authorization & authentication implementation for creating an account, logging in and signing out
      - `navbar/` : The code for the navigation bar and its many states
      - `signIn/` : A page that lets a user log into the website
      - `util/` : Has config functions needed to communicate with the backend
      - `App.js/`: Routes to specific path
      - `index.js`: Browser router and ReactDOM render
  - `server` : This folder contains all back-end-related files. 
    - `index.js` : Contains all the back-end functions
    - `s3.js` : Contains the code for Amzon s3 bucket connection
- `Guard-UI` : This folder contains our Tkinter application files.
  - `db.py` : Contains all the back-end functions and database connection
  - `guard_ui.py` : Contains GUI code for our Tkinter application
- `Mask Detection` : This folder contains our face mask detection files.
  - `dataset` : This folder contains the images used for model training.
  - `face_detector`: This folder contains pre-trained model for face detection.
  - `detect_mask_video.py` : Runs the camera to setup frame and perform detection.
  - `final_mask.model` : Final trained model used for face mask detection.
  - `train_kfold.py` : File for training model using K-fold cross validation.
  - `train_models.py` : File for traning model using Train-Test split.
   
## Project Documentation
1. [Come-Thru Powerpoint](https://drive.google.com/file/d/11BTRRMZfQFwb-vi__FjNdz-cUS9OFXV8/view?usp=sharing)
2. [Come-Thru Proposal](https://drive.google.com/file/d/11BTRRMZfQFwb-vi__FjNdz-cUS9OFXV8/view?usp=sharing)  

