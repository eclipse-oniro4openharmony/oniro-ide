# syntax=docker/dockerfile:1

FROM ubuntu:jammy
RUN apt-get update && \
    apt-get install -y curl sudo build-essential jq vim && \
    curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash - && \
    apt-get install -y nodejs && \
    npm install -g yarn
RUN apt-get install -y libsecret-1-dev libxkbfile-dev libc6 clangd
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y && \
    export PATH="$HOME/.cargo/env:$PATH"
WORKDIR /home/theia
COPY . .
RUN yarn && \
    yarn download:plugins && \
    yarn browser compile
EXPOSE 3000
ENTRYPOINT [ "yarn", "browser", "start", "--hostname=0.0.0.0" ]
