import { Context } from "../deps.ts"

export class api {
    gifs = new Array<string>();

    async getTudou(ctx: Context) {
        const image: string = this.gifs[Math.floor(Math.random() * this.gifs.length)];
        const buffer = await Deno.readFileSync(`./static/media/${image}`);
        ctx.response.headers.set('Content-Type', 'image/gif');
        ctx.response.body = buffer;
    }
    
    async getTudouById(ctx: Context, id: number) {
        const image: string = this.gifs[id];
        const buffer = await Deno.readFileSync(`./static/media/${image}`);
        ctx.response.headers.set('Content-Type', 'image/gif');
        ctx.response.body = buffer;
    }
    
    getTudouAmount(ctx: Context) {
        ctx.response.headers.set('Content-Type', 'text/plain');
        ctx.response.body = this.gifs.length;
    }
}
