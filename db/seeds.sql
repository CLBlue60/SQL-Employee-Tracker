-- Active: 1714946534252@@127.0.0.1@5432@employee_db
-- Inserts for the departments table
INSERT INTO
    departments (department_name)
VALUES ('Finance'),
    ('Engineering'),
    ('Human Resources'),
    ('Sales'),
    ('Legal');

-- Inserts for the roles table
INSERT INTO
    roles (title, salary, department_id)
VALUES ('CFO', 100000, 1),
    (
        'Assistant Engineer', 65000, 2
    ),
    ('Sales Lead', 205000, 4),
    ('Tort Lawyer', 107000, 5),
    (
        'Mandatory Fun Executive Organizer', 50000, 3
    ),
    (
        'Lost and Found Supervisor', 85000, 3
    ),
    (
        'Assistant Pencil Sharpener', 45000, 2
    );

-- Inserts for the employee info
INSERT INTO
    employee (
        first_name, last_name, role_id, manager_id
    )
VALUES ('John', 'Doe', 2, NULL), -- Engineer with no manager
    ('Jane', 'Smith', 6, 1), -- Lost and Found Supervisor managed by CFO
    ('Alice', 'Johnson', 3, 2), -- Sales Lead managed by Assistant Engineer
    ('Bob', 'Williams', 1, 6), -- CFO managed by Lost and Found Supervisor
    ('Emily', 'Brown', 4, NULL);

-- View combined table
SELECT
    employee.id AS employee_id,
    employee.first_name,
    employee.last_name,
    roles.title AS role_title,
    roles.salary,
    departments.department_name
FROM
    employee
    JOIN roles ON employee.role_id = roles.id
    JOIN departments ON roles.department_id = departments.id;
