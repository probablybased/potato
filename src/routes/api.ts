import { Context } from "https://deno.land/x/oak/mod.ts";

export var gifs = new Array<string>();

export async function getTudou(ctx: Context) {
    const image: string = gifs[Math.floor(Math.random() * gifs.length)];
    const buffer = await Deno.readFileSync(`./static/media/${image}`);
    ctx.response.headers.set('Content-Type', 'image/gif');
    ctx.response.body = buffer;
}

export async function getTudouById(ctx: Context, id: number) {
    const image: string = gifs[id];
    const buffer = await Deno.readFileSync(`./static/media/${image}`);
    ctx.response.headers.set('Content-Type', 'image/gif');
    ctx.response.body = buffer;
}

export function getTudouAmount(ctx: Context) {
    ctx.response.headers.set('Content-Type', 'text/plain');
    ctx.response.body = gifs.length
}