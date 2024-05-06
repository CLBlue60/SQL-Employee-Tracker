// Importing required modules
const { Pool } = require("pg");
const inquirer = require("inquirer");
require("dotenv").config();

// Creating a new Pool instance for database connection
const db = new Pool({
  host: "localhost", // Hostname where the database server is running
  user: process.env.DB_USER, // Database user (retrieved from environment variables)
  password: process.env.DB_PASSWORD, // Database password (retrieved from environment variables)
  database: process.env.DB_NAME, // Database name (retrieved from environment variables)
  port: 5432, // Port on which the database server is listening
});

// Function to handle the main menu
async function mainMenu() {
  try {
    // Prompt the user to choose an action from the main menu
    const { select } = await inquirer.prompt({
      type: "list",
      name: "select",
      message: "Choose from the following options:",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add Department",
        "Add Roles",
        "Add Employee",
        "Update Employee",
      ],
    });

    // Perform action based on user's choice
    switch (select) {
      case "View all departments":
        await viewAllDepartments();
        break;
      case "View all roles":
        await viewAllRoles();
        break;
      case "View all employees":
        await viewAllEmployees();
        break;
      case "Add Department":
        await addDepartment();
        break;
      case "Add Roles":
        await addRoles();
        break;
      case "Add Employee":
        await addEmployee();
        break;
      case "Update Employee":
        await updateEmployeeRole();
        break;
      default:
        console.log("Wrong choice. Please try again.");
        break;
    }

    // Prompt the user if they want to go back to the main menu
    const { back } = await inquirer.prompt({
      type: "confirm",
      name: "back",
      message: "Would you like to go back to the main menu?",
    });
    if (back) {
      await mainMenu();
    } else {
      console.log("Thank you!");
    }
  } catch (err) {
    console.error("Error in mainMenu: ", err);
  }
}

// Function to view all departments
async function viewAllDepartments() {
  try {
    const departments = await db.query("SELECT * FROM departments");
    console.table(departments.rows);
  } catch (err) {
    console.error("Could not view departments: ", err);
  }
}

// Function to view all roles
async function viewAllRoles() {
  try {
    const roles = await db.query(
      "SELECT roles.title, roles.salary, departments.department_name FROM roles JOIN departments ON departments.id=roles.department_id"
    );
    console.table(roles.rows);
  } catch (err) {
    console.error("Could not view roles: ", err);
  }
}

// Function to view all employees
async function viewAllEmployees() {
  try {
    const sql = `SELECT employee.id, employee.first_name AS "first name", employee.last_name AS "last name", roles.title, departments.department_name AS department, roles.salary, manager.first_name || ' ' || manager.last_name AS manager FROM employee LEFT JOIN roles ON employee.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id LEFT JOIN employee manager ON manager.id = employee.manager_id`;
    const employees = await db.query(sql);
    console.table(employees.rows);
  } catch (err) {
    console.error("Could not view employees: ", err);
  }
}

// Function to add a new department
async function addDepartment() {
  try {
    const { answer } = await inquirer.prompt([
      {
        type: "input",
        name: "answer",
        message: "What is the new department name?",
      },
    ]);
    const newDepartment = await db.query(
      "INSERT INTO departments (department_name) VALUES ($1) RETURNING *",
      [answer]
    );
    console.table(newDepartment.rows);
    console.log("Added new department: " + answer);
  } catch (err) {
    console.error("Could not add department: ", err);
  }
}

// Function to add a new role
async function addRoles() {
  try {
    const { rows } = await db.query(
      "select id as value, department_name as name from departments"
    );
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "title",
        message: "What is the title of the new role?",
      },
      {
        type: "input",
        name: "salary",
        message: "What is the salary of the new role?",
      },
      {
        type: "list",
        name: "department",
        message: "Choose the department.",
        choices: rows,
      },
    ]);
    const newRole = await db.query(
      "INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3) RETURNING *",
      [answers.title, answers.salary, answers.department]
    );
    console.table(newRole.rows);
    console.log("Added new role: " + answers.title);
  } catch (err) {
    console.error("Could not add role: ", err);
  }
}

// Function to add a new employee
async function addEmployee() {
  try {
    // Fetch roles and managers data
    const roles = await db.query("SELECT id, title FROM roles");
    const managerQuery = [{ value: null, name: "None" }];
    const managers = await db.query(
      "SELECT id, first_name, last_name FROM employee WHERE manager_id IS NULL"
    );

    if (managers.rows.length > 0) {
      managerQuery.push(
        ...managers.rows.map((manager) => ({
          value: manager.id,
          name: `${manager.first_name} ${manager.last_name}`,
        }))
      );
    }

    // Prompt user for employee details
    const roleChoices = roles.rows.map((role) => ({
      value: role.id,
      name: role.title,
    }));
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "first_name",
        message: "What is the first name of the new employee?",
      },
      {
        type: "input",
        name: "last_name",
        message: "What is the last name of the new employee?",
      },
      {
        type: "list",
        name: "role_id",
        message: "Choose the role.",
        choices: roleChoices,
      },
      {
        type: "list",
        name: "manager_id",
        message: "Who is the manager?",
        choices: managerQuery,
      },
    ]);

    // Validate and add employee based on manager availability
    if (!managers.rows.length && answers.manager_id === null) {
      const newEmployee = await db.query(
        "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING *",
        [
          answers.first_name,
          answers.last_name,
          answers.role_id,
          answers.manager_id,
        ]
      );
      console.table(newEmployee.rows);
      console.log("Added new employee: ", answers);
    } else if (answers.manager_id !== null) {
      const newEmployee = await db.query(
        "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING *",
        [
          answers.first_name,
          answers.last_name,
          answers.role_id,
          answers.manager_id,
        ]
      );
      console.table(newEmployee.rows);
      console.log("Added new employee: ", answers);
    } else {
      console.log("Manager is required to add the employee");
    }
  } catch (err) {
    console.error("Could not add employee: ", err);
  }
}

// Function to update employee role
async function updateEmployeeRole() {
  try {
    // Fetch employees data
    const employees = await db.query(
      "SELECT id, first_name, last_name FROM employee"
    );

    // Prompt user to choose an employee
    const { employee_id } = await inquirer.prompt([
      {
        type: "list",
        name: "employee_id",
        message: "Choose the employee.",
        choices: employees.rows.map((employee) => ({
          value: employee.id,
          name: `${employee.first_name} ${employee.last_name}`,
        })),
      },
    ]);

    // Fetch roles data
    const roles = await db.query("SELECT id, title FROM roles");

    // Prompt user to choose a new role
    const { role_id } = await inquirer.prompt([
      {
        type: "list",
        name: "role_id",
        message: "Choose the role.",
        choices: roles.rows.map((role) => ({
          value: role.id,
          name: role.title,
        })),
      },
    ]);

    // Update employee's role in the database
    const updatedEmployee = await db.query(
      "UPDATE employee SET role_id = $1 WHERE id = $2 RETURNING *",
      [role_id, employee_id]
    );
    console.log("Updated employee role: ", updatedEmployee);
  } catch (err) {
    console.error("Could not update employee role: ", err);
  }
}

// Call the mainMenu function to start the application
mainMenu();
