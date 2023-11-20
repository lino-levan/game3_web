import { login, register } from "../serde/write.ts";
import { Connection } from "../network/mod.ts";

// Set up some constants
const DISCORD_BASE_URL = "https://discord.com/api/v10";
const GAME3_NAME = "bot_" + Math.random().toString(36).substring(7);
const BOT_TOKEN = Deno.env.get("DISCORD_TOKEN")!;
const CHANNEL_ID = Deno.env.get("DISCORD_CHANNEL_ID")!;

// Connect to server
const connection = new Connection("home.heimskr.gay", 12255);
await connection.connect();

// listen to events
connection.addEventListener("packet", async (event) => {
  const { type, data } = event.detail;
  if (type === "registrationStatus") {
    await connection.write(login(GAME3_NAME, data.token));
  }
  if (type === "chatMessageSent") {
    const playerId = data.playerId.toString();
    if (data.message.startsWith("!link ")) {
      const discordId = data.message.slice(6);
      const req = await fetch(`${DISCORD_BASE_URL}/users/${discordId}`, {
        headers: {
          "Authorization": `Bot ${BOT_TOKEN}`,
        },
      });
      const res = await req.json();
      localStorage.setItem(playerId, JSON.stringify(res));
      return;
    }

    const username =
      JSON.parse(localStorage.getItem(playerId) ?? "{}").username ?? playerId;

    const req = await fetch(
      `${DISCORD_BASE_URL}/channels/${CHANNEL_ID}/messages`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bot ${BOT_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: `${username}: ${data.message}`,
        }),
      },
    );

    await req.json();
  }
});

// Start event loop
connection.eventLoop();

// Register
await connection.write(register(GAME3_NAME, GAME3_NAME));
