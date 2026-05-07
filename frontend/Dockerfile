FROM oven/bun:1-alpine

WORKDIR /project
COPY . .

RUN bun install
ENV HOST=0.0.0.0
CMD ["bun", "run", "dev"]
