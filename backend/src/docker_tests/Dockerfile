FROM python:3

WORKDIR /home/runner

COPY checks/* /home/runner/
COPY entrypoint /home/runner/

RUN useradd -m runner
RUN chown -R runner:runner /home/runner/

ENTRYPOINT ["/home/runner/entrypoint"]
