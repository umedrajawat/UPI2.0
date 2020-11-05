# UPI2.0

Commands to run the backend
>>npm i    //this will install all the node modules required for running the server

>>node src/index.js || npm run dev 

PORT - 3000

TECH STACK used-
Node.js
Express.js
MongoDB
Mongoose.js
AWS S3


3rd party Libraries used-
aws-sdk
Bcryptjs
Express
Jsonwebtoken
Mongodb
Mongoose
Multer
validate

Explanation of the Solution
Server:
Created a server using express exposing following endpoints-
               Does Not Require Authorization
http://localhost:5000/users [METHOD-POST ] 
               Requires Authorization
http://localhost:5000/users/login[METHOD-POST ]
http://localhost:5000/users/me[METHOD-GET ]
http://localhost:5000/users/me[METHOD-PATCH ]
http://localhost:5000/users/me[METHOD-DELETE ]
http://localhost:5000/users/upload[METHOD-POST ]
http://localhost:5000/users/upload [METHOD-DELETE]
http://localhost:5000/users/logout[METHOD-POST ]
http://localhost:5000/users/logouAll[METHOD-POST]

http://localhost:5000/users [METHOD-POST ] - This API takes a json as input containing name, email and password of the user and thus creates a user in the database along with a 8 digit unique Account number.

http://localhost:5000/users/login[METHOD-POST ] - This API takes a json containing email and password of the user and returns account details, a jwt token to access account details of the user, and a message displaying whether the csv file is uploaded or not .

http://localhost:5000/users/me[METHOD-GET ] - In this API we pass the jwt Token received from /users/login POST API as Authorization header .This API will validate the JWT TOKEN stored in the mongodb database and thus return Account details if token matches.
Else will display unauthorized access.

http://localhost:5000/users/me[METHOD-PATCH ] - This is used to update the name,email and password of the user in the database.

http://localhost:5000/users/me[METHOD-DELETE ] - This api will delete the user from the database.

http://localhost:5000/users/upload [METHOD-POST] - This will allow the user to upload .CSV file with all account details using multer library and will process this data into an array of jsons and update the users account balance, monthly income and credit limit.

http://localhost:5000/users/upload [METHOD-DELETE] - This will delete the .csv file associated with the user.
http://localhost:5000/users/logout[METHOD-POST ] - This will logout the user with the provided JWT TOKEN and will delete the token from the users database and thus this JWT token will not be valid for logging in.

http://localhost:5000/users/logouAll[METHOD-POST] - This will logout all the users to access the APIS as it will delete all the JWT TOKENS stored in the database of the user.

SCREENSHOTS-
Adding a new user - We have to provide name,email and password in json format


STRUCTURE OF THE USER DATA IN MONGODB

{
    "_id" : ObjectId("5f8c177cf4463ea050fb158e"),
    "accountNumber" : 85851908,
    "Balance" : 75000,
    "avgBalance" : 22098.583333332,
    "creditlimit" : 26518.3,
    "name" : "Umed Rajawat",
    "email" : “umedrajawati@gmail.com",
    "password" : "$2a$08$.qGrVEU8oiInx58.N0uTDOXO6GhXFO/0Exj7Ind9RSzEx8C7sXb6i",
    "tokens" : [ 
        {
            "_id" : ObjectId("5f8c177df4463ea050fb158f"),
            "token" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjhjMTc3Y2Y0NDYzZWEwNTBmYjE1OGUiLCJpYXQiOjE2MDMwMTY1NzN9.egVyRvE8s0Eby4fLs12FEB_MlpL6524QVROHAWw3iBY"
        }, 
        {
            "_id" : ObjectId("5f8c17f2f4463ea050fb1590"),
            "token" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjhjMTc3Y2Y0NDYzZWEwNTBmYjE1OGUiLCJpYXQiOjE2MDMwMTY2OTB9.sPrBMO5EoEc-YAFWA-DNAo2Wj7Z-p5L9fkUTBuWQDpA"
        }, 
    ],
    "createdAt" : ISODate("2020-10-18T10:22:52.359Z"),
    "updatedAt" : ISODate("2020-10-18T11:49:06.208Z"),
    "__v" : 6
}

