FROM debian:bullseye as builder

ARG NODE_VERSION=18.16

RUN apt-get update; apt install -y curl
RUN curl https://get.volta.sh | bash
ENV VOLTA_HOME /root/.volta
ENV PATH /root/.volta/bin:$PATH
RUN volta install node@${NODE_VERSION}

#######################################################################

RUN apt install ffmpeg -y --no-install-recommends \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

RUN mkdir /app
WORKDIR /app

COPY package*.json ./

ENV NODE_ENV production

COPY . ./

RUN npm install
FROM debian:bullseye

LABEL fly_launch_runtime="nodejs"

COPY --from=builder /root/.volta /root/.volta
COPY --from=builder /app /app

WORKDIR /app
ENV NODE_ENV production
ENV PATH /root/.volta/bin:$PATH

CMD [ "npm", "run", "cleanstart" ]
