import http from "http";
import { Server } from "socket.io";

export function createSocket(server: http.Server): Server {
	return new Server(server);
}
