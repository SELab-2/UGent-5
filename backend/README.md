# Backend API

## Running the API

### Setup

```sh
# Create a python virtual environment
python -m venv venv
# Activate the environment
source venv/bin/activate
# Install dependencies
pip install -r requirements.txt
```

#### Create a `.env` file with following content

```yml
FRONTEND_URL="https://localhost:8080"
CAS_SERVER_URL="https://login.ugent.be"
DATABASE_URI="database connection string: postgresql://..., see discord..."
SECRET_KEY="<secret key to sign JWT tokens>" # e.g. generate with `openssl rand -hex 32`
ALGORITHM="HS256" # algorithm used to sign JWT tokens
FILE_PATH="files" # Location where uploaded files are stored
```

### Install docker

To be able to run the automated tests or run a local development database,
follow the installation instructions for either
[docker engine](https://docs.docker.com/engine/install/) (CLI) or [docker desktop](https://www.docker.com/get-started/) (GUI, includes docker engine).

### Usage

#### Activate the environment:

```sh
source venv/bin/activate
```

#### Run the web server:

```sh
./run.sh
```

This will start a local development server on port `5173`

## Recommended: run a local instance of the database in a docker container

```bash
# Pull the latest postgres image
docker pull postgres
# Run the postgres deamon in a docker container
docker run --name my_postgres_container \
  -p 5432:5432 \
  -e POSTGRES_USER=username \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=dbname \
  -d \
  postgres
```

#### Change this line in `.env` to reflect database connection info
```yml
DATABASE_URI="postgresql://username:password@localhost:5432/dbname"
```

#### Run alembic to initialize the database
```yml
alembic upgrade head
```

#### Managing the database
```bash
# Start the database container
docker start my_postgres_container
# Stop the database container
docker stop my_postgres_container

# Remove a stopped container
docker rm my_postgres_container
```
If you installed Docker Desktop, you can use the GUI to manage your containers and images.

## The API

## Login

Authentication happens with the use of CAS. The client can ask where it can find
the CAS server with the `/api/authority` endpoint. A ticket then can be obtained
via `<authority>?service=<redirect_url>`. The CAS server will redirect to
`<redirect_url>?ticket=<ticket>` after authentication. Once the client is
authenticated, further authorization happens with [JWT](https://jwt.io/). To
obtain this token, a `POST` request has to be made to `/api/token/`, with the
CAS ticket `<ticket>` and the `<redirect_url>`. The redirect url is needed to
verify the ticket. If the ticket is valid, a webtoken will be returned. To
authorize each request, add the token in the `Authorization` header.

## Developing

#### To format the python code in place to conform to PEP 8 style:

```sh
autopep8 -ri .
```

## Testing

You can add tests by creating `test_*` files and `test_*` functions under `tests` directory.

### Run the tests (in the virtual environment):

```sh
pytest -v
```
