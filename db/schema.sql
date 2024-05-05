-- Drop the database if it exists
DROP DATABASE IF EXISTS employee_db;

-- Create the database
CREATE DATABASE employee_db;

-- Create the 'departments' table
CREATE TABLE departments (
    id SERIAL PRIMARY KEY, department_name VARCHAR(60) NOT NULL
);

-- Create the 'roles' table
CREATE TABLE roles (
    id SERIAL PRIMARY KEY, title VARCHAR(60) NOT NULL, salary DECIMAL NOT NULL, department_id INTEGER NOT NULL, FOREIGN KEY (department_id) REFERENCES departments (id)
);

-- Create the 'employee' table
CREATE TABLE employee (
    id SERIAL PRIMARY KEY, first_name VARCHAR(60) NOT NULL, last_name VARCHAR(60) NOT NULL, role_id INTEGER NOT NULL, manager_id INTEGER, FOREIGN KEY (role_id) REFERENCES roles (id), FOREIGN KEY (manager_id) REFERENCES employee (id)
);
