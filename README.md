explication :
in backend in .env modify 

DB_HOST
DB_USER
DB_PASSWORD
DB_PORT
DB_NAME
JWT_SECRET

you can import the db i sent it it has the table and it was the same name. if you want to create a new table plase change 
the DB_NAME
and in my sql 

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  user_id INT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
i create to u .env.exemple to get exemple and if u get the project from my git modify .env.exemple to.env

you can use my jwt 
but if u get the project from my git or u want to modify the jwt tab this command in the terminal 
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

in backend please do npm install
