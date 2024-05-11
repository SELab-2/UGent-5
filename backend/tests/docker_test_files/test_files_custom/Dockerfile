FROM python:3

WORKDIR /home/runner

COPY entrypoint .

RUN useradd -m runner
RUN chown -R runner:runner /home/runner/

ENTRYPOINT ["/home/runner/entrypoint"]
