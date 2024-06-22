import io from "socket.io-client";
import { API_URL } from "./api.service";

const SOCKET_URL = API_URL.slice(0, -4);

// Export individual socket connections
export const chatSocket = io.connect(SOCKET_URL + "/chat");
export const coinflipSocket = io.connect(SOCKET_URL + "/coinflip");
export const rouletteSocket = io.connect(SOCKET_URL + "/roulette");
export const battlesSocket = io.connect(SOCKET_URL + "/battles");
export const casesSocket = io.connect(SOCKET_URL + "/cases");
export const crashSocket = io.connect(SOCKET_URL + "/crash");
export const upgraderSocket = io.connect(SOCKET_URL + "/upgrader");
export const limboSocket = io.connect(SOCKET_URL + "/limbo");
export const diceSocket = io.connect(SOCKET_URL + "/dice");
export const MinesSocket = io.connect(SOCKET_URL + "/mines");

// Export all socket connections
export const sockets = [
  chatSocket,
  coinflipSocket,
  rouletteSocket,
  battlesSocket,
  casesSocket,
  crashSocket,
  upgraderSocket,
  limboSocket,
  diceSocket,
  MinesSocket
];

// Authenticate websocket connections
export const authenticateSockets = token => {
  //console.log("[WS] Authenticating...");

  // Emit auth event for all sockets
  sockets.forEach(socket => socket.emit("auth", token));
};
