import { Context } from "../deps.ts";

export class staticContent {
  async getIndex(ctx: Context) {
    const page = await Deno.readFileSync("./static/html/index.html");
    ctx.response.body = page;
  }

  getNotFound(ctx: Context) {
    ctx.response.headers.set("Content-Type", "text/plain");
    ctx.response.body = "404 Not Found";
  }
}
