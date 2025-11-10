# Use the official OpenSCAD image as base
FROM openscad/openscad:trixie AS base

# Metadata
LABEL maintainer="Kevin Hill"
LABEL description="Custom OpenSCAD image with extra tools"

# Switch to root if needed (official image likely uses root)
# USER root

# Example: install additional tools you need
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      git \
      curl \
      rustup \
      ca-certificates \
      && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://deb.nodesource.com/setup_24.x | bash -
RUN apt-get install -y nodejs

# Set working directory
WORKDIR /data

# Optional: set a non-root user for running (match host UID/GID)
ARG USER_ID=1000
ARG GROUP_ID=1000
RUN groupadd -g ${GROUP_ID} scaduser \
    && useradd -m -u ${USER_ID} -g scaduser scaduser \
    && chown scaduser:scaduser /data

USER scaduser

# Default entrypoint – use openscad as is
ENTRYPOINT ["openscad"]
CMD ["--help"]
