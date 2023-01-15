# MatchUp

A clone of tinder with modified functionalities. 

Packages used: 
Front-End: React - Cookie, router-dom, spring, tinder-card

Server: MongoDB, with bcrypt, cors, express, jsonwebtoken, mongodb, nodemon, uuid

This webapp runs with React and emulates a similar environment to Tinder. 

Matching condition: 
  Instead of matching based on gender, this matches based on shared personalities and common events of interest. Once both these conditions are filled, then the users will be suggested to each other's feed. 
  After both users swipe right (match) with each other, they will be suggested to chat with in the chat section. 

Functionalities: 

Personality tags: 
  There are currently only 5 tags available to choose from to add into a profile, but can be modified to add more. 
  
Events: 
  Users can add events into the events page and choose to express interest in the event. 

This project is done following the instructions of this video, but instead of matching just based on gender, I modified it to match based on shared personality tags and shared events of interest. Video: https://www.youtube.com/watch?v=Q70IMS-Qnjk 

Issues: The front end code could be optimized to look cleaner. 

How to run: Add your own uri from MongoDB into the server index.js file, make sure the packages are installed, and run using 'npm start:frontend' in matchup folder directory and 'npm start:backend' in server directory. 
