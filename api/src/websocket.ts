import { Hono } from "hono";
import { createBunWebSocket } from "hono/bun";
import { ServerWebSocket } from "bun";

const connectedShippers = new Map<string, ServerWebSocket>();

export function setupWebSocket(app: Hono) {
	const { upgradeWebSocket, websocket } = createBunWebSocket();

	app.get(
		"/ws/:shipperId",
		upgradeWebSocket((c) => ({
			onOpen: (_, ws) => {
				const s = ws.raw as ServerWebSocket;
				const shipperId = c.req.param("shipperId");
				s.subscribe(shipperId);
				connectedShippers.set(shipperId, s);
				console.log(
					`Shipper ${shipperId} connected`,
					connectedShippers.size
				);
			},
			onClose: (_, ws) => {
				const s = ws.raw as ServerWebSocket;
				const shipperId = c.req.param("shipperId");
				s.unsubscribe(shipperId);
				connectedShippers.delete(shipperId);
				console.log(
					`Shipper ${shipperId} disconnected`,
					connectedShippers.size
				);
			},
		}))
	);

	return websocket;
}

export { connectedShippers };
