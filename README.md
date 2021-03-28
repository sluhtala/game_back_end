#game server readme

Important!
	This project is only for educational purpose only.

Usage:

1. set server/resources/mysql_init_db_opts.json on user that has priviliges to create db, tables, users and grant access.

2. set server/resources/email_config.json to set your mail settings.

3. start mysql server 

4. create database by running (node ./server/init_database.js)

5. create frontend build (npm run build --prefix game_app/)

6. start server npm start


Features:

- Create account
- Dynamically checks if the username is already in use
- Secure Password
- Login
- Set cookie to store valid username
- Logout 
- email system to confirm account and reset password



Todo:

- million things

