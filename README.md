#game server readme

Usage:

1. set server/resources/mysql_init_db_opts.json on user that has priviliges to create db, tables, users and grant access.

2. start mysql server 

3. create database by running (node ./server/init_database.js)

4. start server npm start


Features:

- Create account
- Dynamically checks if the username is already in use
- Password ecnryption
- Login
- Set cookie to store valid username
- Logout 



Todo:

- million things
- email sending to newuser
- password restore via email

