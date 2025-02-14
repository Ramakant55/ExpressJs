basic setup of express js
==========================
-> first create a simple package.json
command-> npm init -y
required dependencies
-express
-mongoose
-dotenv
-nodemon

npm i express mongoose dotenv nodemon

=>create a file named .env (environment fies)->always put in git ignore file


modules
======
user.js---name, email, password
products.js
order.js


//JWT Tokens
jsonwebtoken->it i a secret code that we generate after some specific task
 1.Header->Tells Which Algorithm is used
 2.Payload->Store User Info
 3.Signature->for verifying token we use some secret key

 symmetic algorithm->it is used for generating signature
 asymmetric algorithm->it is used for verifying signature

 algo name->it is used for identifying the algorithm
 HS256,HS384,HS512

npm i jsonwebtoken

for install crypto-> npm install crypto




