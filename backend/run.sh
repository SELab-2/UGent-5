#!/usr/bin/env bash

uvicorn src.main:app --reload --port 8080 \
    --ssl-keyfile "local-cert/localhost-key.pem" \
    --ssl-certfile "local-cert/localhost.pem"
