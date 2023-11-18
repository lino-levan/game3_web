import { PacketWriter } from "./packet_writer.ts";

export function chunkRequest(
  realmId: number,
  generateMissingChunks: boolean,
  chunkPositions: number[],
) {
  const packetWriter = new PacketWriter(3);
  packetWriter.writeInt32(realmId);
  packetWriter.writeBoolean(generateMissingChunks);
  packetWriter.writeUint32Array(chunkPositions);
  return packetWriter.buffer;
}

export function login(username: string, token: bigint) {
  const packetWriter = new PacketWriter(10);
  packetWriter.writeString(username);
  packetWriter.writeUint64(token);
  return packetWriter.buffer;
}

export function register(username: string, displayName: string) {
  const packetWriter = new PacketWriter(12);
  packetWriter.writeString(username);
  packetWriter.writeString(displayName);
  return packetWriter.buffer;
}
