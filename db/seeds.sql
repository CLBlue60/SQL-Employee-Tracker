-- Insert departments
INSERT INTO
    departments (department_name)
VALUES ('Finance'),
    ('Engineering'),
    ('Human Resources'),
    ('Sales'),
    ('Legal');

-- Insert roles
INSERT INTO
    roles (title, salary, department_id)
VALUES ('CFO', 100000, 1),
    ('Assistant Engineer', 65000, 2),
    ('Sales Lead', 205000, 4),
    ('Tort Lawyer', 107000, 5),
    ('Mandatory Fun Executive Organizer', 50000, 3),
    ('Lost and Found Supervisor', 850000, 3),
    ('Assistant Pencil Sharpener', 45000, 2);

-- Insert employees
INSERT INTO
    employee (
        first_name, last_name, role_id, manager_id
    )
VALUES ('Burt', 'Macklin', 6, NULL),
    ('Janet', 'Snakehorn', 5, 1),
    ('Lemmony', 'Snicker', 1, 2),
    ('Alfred', 'Bottomsworth', 2, 3),
    ('Scarlet', 'Paperdog', 3, NULL),
    ('Rick', 'Mortimer', 4, 5),
    ('Eric', 'Last Name Here-Edwards', 7, NULL);

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
