BruinWait-Lifting
# About
BruinWait allows users to manage their gym equipment usage through a waitlist system based on NFC tags or QR codes. We aim to optimize gym equipment availability and create a good user experience both in the app and in the gym.

It involves a database of users and equipment, a client-side React application, and a server to orchestrate operations.

This is a Fall 2024 CS35L project by Nico Franz, Ria Kundu, Alexander Shen, Keshiv Tandon, and Kevin Wong.

## Features
**Waitlist Management:**
- Unlimited users can join the waitlist, but each can only have one machine in use and one on the waitlist at a time.
- Users are notified of their new position if they miss their turn. After a second miss, they can choose to be sent to the end of the list or removed.

**Administrative Features:**
- Staff Access: Gym staff can manually adjust waitlists, mark machines as out of service, and view machine usage data for operational improvements.

**Issue Reporting:**
- Users can report machine issues directly from the waitlist UI.

**Limited Availability:**
- Skip the Line, machines become "limitedly available" when the next user's expected time is longer than the time another user wants to use it. Users can start their set immediately, reducing overall wait times.

**Home Screen Features:**
- Displays the current machine in use, time remaining, available machines, and the waitlisted machine status.

**Favorites List:** 
- Users can create a list of favorite machines for easy access, sorted by waitlist times.

# Building and Starting
Before you start with this repo, ensure that you have a [MongoDB cluster](https://www.mongodb.com/) available.

In the repo directory, run
> npm install

to install the Node dependencies. This may take some time.

## Client Server
Start the client-facing server by running
> npm start

## Backend Server
Replace the MongoDB URL and JWT secret key with values applicable to you and a random new one, respectively.

Start the server by running
> node Backend/server.js
