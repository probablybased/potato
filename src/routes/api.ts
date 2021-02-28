import { Context } from "../deps.ts";

export class api {
  gifs = new Array<string>();

  getTudou(ctx: Context) {
    const image: string =
      this.gifs[Math.floor(Math.random() * this.gifs.length)];
    const buffer = Deno.readFileSync(`./static/media/${image}`);
    ctx.response.headers.set("Content-Type", "image/gif");
    ctx.response.body = buffer;
  }

  getTudouById(ctx: Context, id: number) {
    const image: string = this.gifs[id];
    const buffer = Deno.readFileSync(`./static/media/${image}`);
    ctx.response.headers.set("Content-Type", "image/gif");
    ctx.response.body = buffer;
  }

  getTudouAmount(ctx: Context) {
    ctx.response.headers.set("Content-Type", "text/plain");
    ctx.response.body = this.gifs.length;
  }
}
