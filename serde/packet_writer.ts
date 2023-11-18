export class PacketWriter {
  #pointer = 6;
  #buffer = new DataView(new ArrayBuffer(1024));

  constructor(type: number) {
    this.#buffer.setUint16(0, type, true); // packet id
  }

  writeBoolean(value: boolean) {
    this.#buffer.setUint8(this.#pointer++, 0x01);
    this.#buffer.setUint8(this.#pointer++, +value);
  }

  writeUint8(value: number) {
    this.#buffer.setUint8(this.#pointer++, 0x01);
    this.#buffer.setUint8(this.#pointer++, value);
  }

  writeUint16(value: number) {
    this.#buffer.setUint8(this.#pointer++, 0x02);
    this.#buffer.setUint16(this.#pointer, value, true);
    this.#pointer += 2;
  }

  writeUint32(value: number) {
    this.#buffer.setUint8(this.#pointer++, 0x03);
    this.#buffer.setUint32(this.#pointer, value, true);
    this.#pointer += 4;
  }

  writeUint64(value: bigint) {
    this.#buffer.setUint8(this.#pointer++, 0x04);
    this.#buffer.setBigUint64(this.#pointer, value, true);
    this.#pointer += 8;
  }

  writeInt8(value: number) {
    this.#buffer.setUint8(this.#pointer++, 0x05);
    this.#buffer.setInt8(this.#pointer++, value);
  }

  writeInt16(value: number) {
    this.#buffer.setUint8(this.#pointer++, 0x06);
    this.#buffer.setInt16(this.#pointer, value, true);
    this.#pointer += 2;
  }

  writeInt32(value: number) {
    this.#buffer.setUint8(this.#pointer++, 0x07);
    this.#buffer.setInt32(this.#pointer, value, true);
    this.#pointer += 4;
  }

  writeInt64(value: bigint) {
    this.#buffer.setUint8(this.#pointer++, 0x08);
    this.#buffer.setBigInt64(this.#pointer, value, true);
    this.#pointer += 8;
  }

  writeFloat32(value: number) {
    this.#buffer.setUint8(this.#pointer++, 0x09);
    this.#buffer.setFloat32(this.#pointer, value, true);
    this.#pointer += 4;
  }

  writeFloat64(value: number) {
    this.#buffer.setUint8(this.#pointer++, 0x0A);
    this.#buffer.setFloat64(this.#pointer, value, true);
    this.#pointer += 8;
  }

  writeString(value: string) {
    if (value.length < 15) {
      this.#buffer.setUint8(this.#pointer++, 0x10 + value.length);
    } else {
      this.#buffer.setUint8(this.#pointer++, 0x1f);
      this.#buffer.setUint32(this.#pointer, value.length, true);
      this.#pointer += 4;
    }

    for (let i = 0; i < value.length; i++) {
      this.#buffer.setUint8(this.#pointer++, value.charCodeAt(i));
    }
  }

  writeUint32Array(value: number[]) {
    this.#buffer.setUint8(this.#pointer++, 0x20);
    this.#buffer.setUint8(this.#pointer++, 0x03);
    this.#buffer.setUint32(this.#pointer, value.length, true);
    this.#pointer += 4;

    for (let i = 0; i < value.length; i++) {
      this.#buffer.setUint32(this.#pointer, value[i], true);
      this.#pointer += 4;
    }
  }

  get buffer() {
    this.#buffer.setUint32(2, this.#pointer - 6, true); // packet size
    return new Uint8Array(this.#buffer.buffer.slice(0, this.#pointer));
  }
}
