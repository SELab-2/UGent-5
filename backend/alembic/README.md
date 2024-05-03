# Alembic

From the docs:

> [Alembic](https://alembic.sqlalchemy.org/en/latest/) is a lightweight database
migration tool for usage with the [SQLAlchemy](https://www.sqlalchemy.org/)
Database Toolkit for Python.

It allows us to generate database schemas from Python SQLAlchemy code, found in each
`models.py` file.

## Usage

Here are some of the most commonly used commands you might need.

#### Automatically generate a revision script after modifying database models in Python:

```sh
alembic revision --autogenerate -m "my_revision_name"
```

Make sure to manually review the generated script in `alembic/versions`
and apply adjustments if needed.

#### Run a migration: this will upgrade the database schema to the most recent revision.

```sh
alembic upgrade head
```

#### Undo the most recent revision:

```sh
alembic downgrade -1
```

#### Reset the database to its initial (empty) state:

```sh
alembic downgrade base
```

For more examples, see the [official alembic tutorial](https://alembic.sqlalchemy.org/en/latest/tutorial.html).
