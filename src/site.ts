import { Application, Router, isHttpError, Status } from "https://deno.land/x/oak/mod.ts";
import {
    red,
    green,
    bold,
  } from "https://deno.land/std/fmt/colors.ts";
import { getIndex, getNotFound } from "./routes/static.ts"
import { gifs, getTudou, getTudouById, getTudouAmount } from "./routes/api.ts"

const app = new Application();
const router = new Router();

router
    .get("/", (ctx) => {
        getIndex(ctx);
    })
    .get("/api/tudou", (ctx) =>  {
        getTudou(ctx);
    })
    .get("/api/tudou/count", (ctx) => {
        getTudouAmount(ctx);
    });

app.addEventListener("listen", ({ hostname, port}) => {
    console.log(red(bold(
        "  __            .___                  \n" +
        "_/  |_ __ __  __| _/____  __ __       \n" +
        "\\   __\\  |  \\/ __ |/  _ \\|  |  \\ \n" +
        " |  | |  |  / /_/ (  <_> )  |  /      \n" +
        " |__| |____/\\____ |\\____/|____/     \n" +
        "                 \\/                    "
    )));
    console.log(`Listening on ${hostname}:${port}`)
})

app.use(async (context, next) => {
    try {
      await next();
    } catch (err) {
      if (isHttpError(err)) {
        context.response.status = err.status;
        const { message, status, stack } = err;
        if (context.request.accepts("json")) {
          context.response.body = { message, status, stack };
          context.response.type = "json";
        } else {
          context.response.body = `${status} ${message}\n\n${stack ?? ""}`;
          context.response.type = "text/plain";
        }
      } else {
        console.log(err);
        throw err;
      }
    }
});

app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const rt = Date.now() - start;
    console.log(`[${green("+")}] Served ${ctx.request.ip} in ${rt}ms`)
});

app.use(router.routes());
app.use(getNotFound)

for await (const entry of Deno.readDirSync('./static/media/')) {
    gifs.push(entry.name)
}

await app.listen({ hostname: "0.0.0.0", port: 8000 });