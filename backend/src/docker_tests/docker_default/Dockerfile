FROM python:3

WORKDIR /home/runner

COPY entrypoint .

RUN useradd -m runner
RUN chown -R runner:runner /home/runner/

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        # cmd line utils
        coreutils \
        curl \
		wget \
        tree \
        # C utils
        gcc \
        g++ \
        make

# Python packages
RUN pip install --no-cache-dir --upgrade numpy pandas


ENTRYPOINT ["/home/runner/entrypoint"]
