FROM hayd/alpine-deno:1.7.2

EXPOSE 8000

WORKDIR /app

USER deno

ADD . .

RUN deno cache src/site.ts

CMD ["run", "--allow-net", "--allow-read", "src/site.ts"]