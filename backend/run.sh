#!/usr/bin/env bash

uvicorn app:app --reload --port 8080 \
    --ssl-keyfile "local-cert/localhost-key.pem" \
    --ssl-certfile "local-cert/localhost.pem"
