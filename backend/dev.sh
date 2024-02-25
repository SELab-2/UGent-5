#!/usr/bin/env bash

export API_ENV=develpoment
uvicorn app:app --reload --port 8080 \
    --ssl-keyfile "local-cert/localhost-key.pem" \
    --ssl-certfile "local-cert/localhost.pem"
