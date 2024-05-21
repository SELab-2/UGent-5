# Apollo

Apollo is an online submission platform where instructors can flexibly set requirements for
student submissions. These requirements can range from simple checks on the submitted
file structure to test scripts that run when a submission is made.

Students quickly receive feedback on their submission, allowing them to know if it meets
the project requirements.

This repository hosts the web application's source code. To use Apollo, visit https://sel2-5.ugent.be.

## Wiki

Documentation, including a user manual for teachers, can be found in the
[Apollo wiki](https://github.com/SELab-2/UGent-5/wiki).

## For Developers

Instructions for setting up the frontend development environment can be found
[here](frontend/README.md).

Instructions for the backend are located [here](backend/README.md).

## API

Automated clients can interact with the web application via the [API](https://sel2-5.ugent.be/api/docs).

## Used tools and frameworks

### Database
 - Database system: [PostgreSQL](https://www.postgresql.org/)
 - Database migrations: [alembic](https://github.com/sqlalchemy/alembic).

### Backend
 - Backend framework: [FastAPI](https://fastapi.tiangolo.com/)
 - Database interface: [SQLAlchemy](https://www.sqlalchemy.org/)
 - JSON-validation: [Pydantic](https://github.com/pydantic/pydantic)
 - Test framework: [pytest](https://github.com/pytest-dev/pytest)

### Frontend
 - Frontend framework: [Vue.js](https://vuejs.org/) (Composition API) + [TypeScript](https://www.typescriptlang.org/)
 - Component library: [Vuetify](https://dev.vuetifyjs.com/en/)
 - Test framework: [Vitest](https://vitest.dev/)

## The team

|                  |                                                   |
|------------------|---------------------------------------------------|
| Xander Bil       | System Administrator                              |
| Michaël Boelaert | Test Manager                                      |
| Mattis Cauwel    | Frontend Manager                                  |
| Dries Huybens    | Backend Manager                                   |
| Pieter Janin     | Customer Relations Officer, Documentation Manager |
| Bram Reyniers    | Technical Lead                                    |
| Marieke Sinnaeve | Team Lead                                         |
