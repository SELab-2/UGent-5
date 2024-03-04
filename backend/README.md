## Run the backend api

### Setup

#### In this directy execute the following command to create a python environment:

```sh
python -m venv venv
```

#### Activate the environment:

```sh
source venv/bin/activate
```

#### Install the dependencies:

```sh
pip install -r requirements.txt
```

#### Create a config.yml file with following content

```yml
api_url: https://localhost:8080
cas_server_url: https://login.ugent.be
database_uri: "database connection string: postgresql://..., see discord..."
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



#### To format the python code in place to conform to PEP 8 style:

```sh
autopep8 -ri .
```
