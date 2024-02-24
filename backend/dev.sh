#!/usr/bin/env bash

uvicorn app:app --reload --port 8080 --ssl-keyfile "localhost-key.pem" --ssl-certfile "localhost.pem"
