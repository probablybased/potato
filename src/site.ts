import { staticContent } from "./routes/static.ts"
import { api } from "./routes/api.ts"
import { 
  Application,
  Router,
  Context,
  isHttpError,
  red,
  bold, 
  green
} from "./deps.ts" 

const app = new Application();
const router = new Router();
const html = new staticContent();
const serve = new api();

router
    .get("/", (ctx: Context) => {
        html.getIndex(ctx);
    })
    .get("/api/tudou", (ctx: Context) =>  {
        serve.getTudou(ctx);
    })
    .get("/api/tudou/count", (ctx: Context) => {
        serve.getTudouAmount(ctx);
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

app.use(async(ctx: Context, next) => {
    try {
      await next();
    } catch (err) {
      if (isHttpError(err)) {
        ctx.response.status = err.status;
        const { message, status, stack } = err;
        if (ctx.request.accepts("json")) {
          ctx.response.body = { message, status, stack };
          ctx.response.type = "json";
        } else {
          ctx.response.body = `${status} ${message}\n\n${stack ?? ""}`;
          ctx.response.type = "text/plain";
        }
      } else {
        console.log(err);
        throw err;
      }
    }
});

app.use(async(ctx: Context, next) => {
    const start = Date.now();
    await next();
    const rt = Date.now() - start;
    console.log(`[${green("+")}] Served ${ctx.request.ip} in ${rt}ms`)
});

app.use(router.routes());
app.use(html.getNotFound);

for await (const entry of Deno.readDirSync('./static/media/')) {
    serve.gifs.push(entry.name);
}

await app.listen({ hostname: "0.0.0.0", port: 8000 });