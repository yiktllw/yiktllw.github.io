import { createServer } from "vite";
import type { ViteDevServer } from "vite";

export async function manualHMRTrigger(server: ViteDevServer) {
  let filePath = process.cwd() + "/src/router/blogRoutes.ts";
  const module = server.moduleGraph.getModulesByFile(filePath);

  if (module) {
    const md = Array.from(module)[0];
    server.moduleGraph.invalidateModule(md);

    server.ws.send({
      type: "update",
      updates: [
        {
          type: "js-update",
          path: `${filePath}`,
          acceptedPath: `${filePath}`,
          timestamp: Date.now(),
        },
      ],
    });
    server.ws.send({ type: "full-reload" });

    console.log(`[Manual HMR] 强制更新: ${filePath}`);
  } else {
    console.warn(`[Manual HMR] 找不到模块: ${filePath}`);
  }
}

export async function startServer() {
  const server = await createServer({
    root: process.cwd(),
    server: {
      port: 3000,
    },
  });

  await server.listen();
  // server.bindCLIShortcuts({
  //   print: true,
  //   customShortcuts: [
  //     {
  //       key: "c",
  //       description: "Disabled",
  //       action: undefined,
  //     },
  //     {
  //       key: "r",
  //       description: "Disabled",
  //       action: undefined,
  //     },
  //     {
  //       key: "u",
  //       description: "Disabled",
  //       action: undefined,
  //     },
  //     {
  //       key: "o",
  //       description: "Disabled",
  //       action: undefined,
  //     },
  //     {
  //       key: "q",
  //       description: "Disabled",
  //       action: undefined,
  //     },
  //   ],
  // });
  server.printUrls();
  return server;
}
