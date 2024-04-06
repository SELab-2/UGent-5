FROM python:3

WORKDIR /home/runner

COPY ../../../files/projects/fca49c14-53d0-4faa-8632-e5c6f4652a73/checks/* /home/runner/
COPY entrypoint /home/runner/

RUN useradd -m runner
RUN chown -R runner:runner /home/runner/

# C u
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
