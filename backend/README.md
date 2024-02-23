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

### Usage

#### Activate the environment:

```sh
source venv/bin/activate
```

#### Run the web server:

```sh
./run.sh
```

It will start a local development server on port `8000`

#### To format the python code in place to conform to PEP 8 style:

```sh
autopep8 -ri .
```
