# Reactvulna

## Table of Contents
1. [Introduction](#Introduction)
2. [Building, running the application](#Build)
3. [Configuring a backend](#Backend)
4. [Exercises](#Exercises)
    1.  [Exercise 1 - XSS](#Exercise_xss)
    1.  [Exercise 2 - Websocket](#Exercise_websocket)
    1.  [Exercise 3 - CSRF](#Exercise_csrf)
    1.  [Exercise 4 - Tabnabbing](#Exercise_tabnab)

<a name="Introduction"></a>
Reactvulna is a deliberately vulnerable react application. [Create React App](https://github.com/facebookincubator/create-react-app). It uses the [javulna](https://github.com/edu-secmachine/javulna) backend. Reactvulna (together with the javulna backend) is a movie-related application, where you can log in and out, read information about movies, buy movie-related objects, send messages to other users of the application, etc. The functionalities are far from complete or coherent, they just serve the purpose of demonstrating specific vulnerabilities. This document contains exercises which can be done with Reactvulna to understand how to exploit and how to fix specific vulnerabilities.

<a name="Build"></a>
## Building, running the application

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.  
  
Or

Run `npm run build` to build the project. Set up your favourite HTTP server so that a visitor to your site is served `index.html`, and requests to static paths like `/static/js/main.<hash>.js` are served with the contents of the `/static/js/main.<hash>.js` file.    

<a name="Backend"></a>
## Configuring a backend
Reactvulna uses by default a backend hosted on Google Cloud. This cloud instance is live only for limited periods. If you want to use it with your own backend, get the [javulna](https://github.com/edu-secmachine/javulna) application and run it. Than configure Reactvulna to use your local backend by changing the baseUrl attribute in environments/environment.ts, and environments/environment.prod.ts
 
<a name="Exercises"></a>
## Exercises 

<a name="Exercise_xss"></a>
### Exercise 1 – Xss
The application contains several XSS vulnerabilities in the Users page! Find the vulnerabilities, and exploit them!  
Then check the source-code, and fix it!  
Discuss what could be the developer's reason for choosing the vulnerable solutions!

<a name="Exercise_websocket"></a>
### Exercise 2 – Websocket
The application uses websocket to implement a chat functionality!  
Alas, it contains some vulnerabilities within it's implementation. Find an authenticaton-related vulnerability!  
How would you exploit it?    
How could you fix it?!

<a name="Exercise_csrf"></a>
### Exercise 3 – CSRF
The application is vulnerable to  CSRF! 
Find the CSRF vulnerability, and exploit it!  
How would you fix this vulnerability?

<a name="Exercise_tabnab"></a>
### Exercise 4 – Tabnabbing
The application is vulnerable to Tabnabbing! Find the vulnerable place, and exploit it!  
Fix the vulnerability!  


