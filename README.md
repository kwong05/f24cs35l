BruinWait-Lifting
# About
BruinWait allows users to manage their gym equipment usage through a waitlist system based on NFC tags or QR codes. We aim to optimize gym equipment availability and create a good user experience both in the app and in the gym.

It involves a MongoDB database of users and equipment, a client-side React application, and an Express server to orchestrate operations.

This is a Fall 2024 CS35L project by Nico Franz ([n-franz](https://github.com/n-franz)), Ria Kundu ([ria-kundu](https://github.com/ria-kundu)), Alexander Shen ([alexandershen27](https://github.com/alexandershen27)), Keshiv Tandon ([KeshivT](https://github.com/KeshivT)), and Kevin Wong ([kwong05](https://github.com/kwong05)), members of [group 31](https://docs.google.com/spreadsheets/d/197j2UxHFPtvOMseaxZuWUV0CE0oJPkdMcMjlUsVwgwI/edit?gid=1172905667#gid=1172905667&range=B176:B181).

## Current Features
**Home Screen Features:**
- Displays the current machine in use, available machines, the waitlisted machine status, and time remaining before the queue is empty,

**Waitlist Management:**
- Unlimited users can join the waitlist, but each can only have one machine in use and one on the waitlist at a time.
- Live updates across devices using WebSocket for real-time waitlist synchronization.

**Favorites List:** 
- Users can create a list of favorite machines 
- These machines are displayed at the top of the avaliable machines page for them, allowing for easy acces and a personalized experience

## Potential Features to Add in the Future
**User Features**
- Users are notified of their new position if they miss their turn. After a second miss, they can choose to be sent to the end of the list or removed.
- Skip the Line, machines become "limitedly available" when the next user's expected time is longer than the time another user wants to use it. Users can start their set immediately, reducing overall wait times.

**Administrative Features:**
- Staff Access: Gym staff can manually adjust waitlists, mark machines as out of service, and view machine usage data for operational improvements.

**Issue Reporting:**
- Users can report machine issues directly from the waitlist UI.

# Building and Starting
Before you start with this repo, ensure that you have a [MongoDB cluster](https://www.mongodb.com/) available.

## Client Server
Change into the ```frontend``` directory and run ```npm install```.

Start the client-facing server by running
```npm start```.

## Backend Server
Change into the ```backend``` directory.

Edit the ```uri``` variable in the ```server.js``` file (located around line 36), setting it to your MongoDB URL.

Install dependencies with ```npm install```.

Start the backend server by running
```npm start```.

## Configuration
Update the `.env` files for both the frontend and backend with the appropriate values:

- For the backend:
  - Set `PORT` to the server's port number.
  - Ensure `FRONTEND_URL` matches the URL of the frontend application.
  - Set `MONGO_URI` to your MongoDB connection string.

- For the frontend:
  - Set `PORT` to the client server's port number.
  - Ensure `REACT_APP_API_URL` matches the backend's URL.
  - Set `REACT_APP_WS_URL` to the WebSocket URL for real-time updates.