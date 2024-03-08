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

#### Create a config.yml file with following content

```yml
api_url: https://localhost:8080
cas_server_url: https://login.ugent.be
database_uri: "database connection string: postgresql://..., see discord..."
secret_key: "<secret key to sign JWT tokens>"
algorithm: "<algorithm used to sign JWT tokens>"
```

### Usage

#### Activate the environment:

```sh
source venv/bin/activate
```

#### Run the web server:

> Note: For local development, an SSL-certificate is needed to interact with the
> CAS-server of UGent. Install [mkcert](https://github.com/FiloSottile/mkcert)
> and run
> ```sh
> mkdir local-cert
> mkcert -key-file local-cert/localhost-key.pem -cert-file local-cert/localhost.pem localhost
> ```

```sh
./run.sh
```

It will start a local development server on port `8080`

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
