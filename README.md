# Instashop Nikos Lytras
## Hello there, welcome to my solution
**Here you can find information for how to run the server.**
**I need to apologize for the delay but the last two weeks was crazy and i a didn't had so much time**

## Instructions
***You are gonna need a mongo server up and running***

Note that before you run the bellow commands you are gonna need a ``.env`` file in the root folder of the project, you can see the provided ``.env.example`` file (or rename it to .env an use it as is).

To run the services in the root of the folder hit the following commands: 
- ``npm run install``
- ``npm run start_client``
- ``npm run start_parse (In a new terminal)``

## When the services are up

- To create, edit and delete a landmark you need to sing up and then login.

For any questions you can contact with me, thank you very much for your time.

## Parse Dashboard
The parse dashboard is up and running on ``{parse_server_url}/dashboard`` (e.g. http://localhost:5005/dashboard)

## Sample Landmark in DB

```JSON
{
    "_id" : "Cij3zS5utu",
    "title" : "nikos",
    "info" : "edwdwefwfewfeffffffffffffffff",
    "link" : "https://www.google.com",
    "fileName" : "download.jpeg",
    "imagePath" : "http://localhost:5005/parse/files/NqqPKd9Mzzdk0Es6P7NdzXOXNb4tsqdq6Q8p0cZi/4e57b650506fc757cf602ad262ec4477_download.jpeg",
    "_created_at" : ISODate("2023-05-19T11:11:15.696+0000"),
    "_updated_at" : ISODate("2023-05-19T11:11:45.638+0000")
}
```