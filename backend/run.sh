#!/usr/bin/env bash

export API_ENV="production"
uvicorn app:app --reload
