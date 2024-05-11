FROM python:3

WORKDIR /home/runner

COPY entrypoint test.py ./

RUN useradd -m runner
RUN chown -R runner:runner .
RUN chmod +x ./entrypoint

ENTRYPOINT ["./entrypoint"]
