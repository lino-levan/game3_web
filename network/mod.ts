import { BytesList } from "../serde/bytes_list.ts";
import { packetIdToDecoder, packetIdToName } from "../serde/read.ts";
import { PacketReader } from "../serde/packet_reader.ts";

type PacketId = keyof typeof packetIdToName;

export interface PacketEventPayload<T extends PacketId> {
  type: typeof packetIdToName[T];
  data: ReturnType<typeof packetIdToDecoder[T]>;
}

export class PacketEvent<T extends PacketId>
  extends CustomEvent<PacketEventPayload<T>> {
  constructor(detail: PacketEventPayload<T>) {
    super("packet", { detail });
  }
}

interface PacketEventListener<T extends PacketId> {
  (evt: PacketEvent<T>): void;
}

interface PacketEventListenerObject<T extends PacketId> {
  handleEvent(object: PacketEvent<T>): void;
}

type PacketEventListenerOrEventListenerObject<T extends PacketId> =
  | PacketEventListener<T>
  | PacketEventListenerObject<T>;

export class Connection extends EventTarget {
  #hostname: string;
  #port: number;
  #connection: Deno.TlsConn | undefined;
  #buffer = new BytesList();

  constructor(hostname: string, port: number) {
    super();
    this.#hostname = hostname;
    this.#port = port;
  }

  addEventListener<T extends PacketId>(
    type: string,
    callback: PacketEventListenerOrEventListenerObject<T> | null,
    options?: AddEventListenerOptions | boolean,
  ): void {
    // @ts-ignore I promise I know what I'm doing
    super.addEventListener(type, callback, options);
  }

  async connect() {
    if (this.#connection) {
      throw new Error("Attempted to connect twice");
    }

    this.#connection = await Deno.connectTls({
      port: 12255,
      hostname: "home.heimskr.gay",
    });
  }

  async eventLoop() {
    if (!this.#connection) {
      throw new Error(
        "Attempted to start event loop before connecting to server",
      );
    }

    for await (const chunk of this.#connection.readable) {
      this.#buffer.add(chunk);

      if (this.#buffer.size < 6) continue;

      const packetHeader = new DataView(this.#buffer.slice(0, 6).buffer);
      const packetType = packetHeader.getInt16(0, true);
      const packetSize = packetHeader.getInt32(2, true);

      if (this.#buffer.size - 6 >= packetSize) {
        const packet = this.#buffer.slice(6, packetSize + 6);
        this.#buffer.shift(packetSize + 6);
        const reader = new PacketReader(packet);
        const decoded = reader.read();

        const type = packetIdToName[packetType];
        this.dispatchEvent(
          new PacketEvent({
            type,
            data: packetIdToDecoder[type](decoded),
          }),
        );
      }
    }
  }

  async write(buffer: Uint8Array) {
    if (!this.#connection) {
      throw new Error("Attempted to write before connecting to server");
    }
    // TODO: replace with WriteableStream
    await this.#connection.write(buffer);
  }
}
