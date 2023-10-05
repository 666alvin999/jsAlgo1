import {join} from "node:path";
import {ServerWebSocket} from "bun";
import {watch} from "node:fs";
import {FSWatcher, WatchEventType} from "fs";

const port = parseInt(process.argv[2]);
const baseDir = join(import.meta.dir, "..", "..", "target");

const wsClients: Set<ServerWebSocket> = new Set();

const watcher: FSWatcher = watch(
    baseDir,
    {recursive: true},
    (event: WatchEventType, data) => {
        console.log("something changed:", data);
        wsClients.forEach((ws) => ws.send("reload"));
    }
);

const server = Bun.serve({
    port: port,
    fetch: async (request: Request) => {
        if (!server.upgrade(request)) {
            const url = new URL(request.url);
            const filename = url.pathname === "/" ? "/index.html" : url.pathname;
            const filePath = join(baseDir, filename);
            const file = Bun.file(filePath);

            if (!(await file.exists())) {
                return new Response(
                    `Unknown file "${filePath}"`,
                    {status: 404}
                );
            } else {
                return new Response(file);
            }
        }
    },
    websocket: {
        open: (ws: ServerWebSocket) => {
            wsClients.add(ws);
        },
        close: (ws: ServerWebSocket) => {
            wsClients.delete(ws);
        },
        message: (ws: ServerWebSocket, message: string) => {
            console.log(`Message received from ${ws.remoteAddress}:${message}`);
            ws.send("Well received");
        }
    }
});

console.log(`HTTP Server listening on ${server.hostname}:${port}`);