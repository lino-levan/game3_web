const variableLengthTypes = [0x0b, 0x1f, 0x20, 0x21];

export class PacketReader {
  #buffer: DataView;

  constructor(buffer: Uint8Array) {
    this.#buffer = new DataView(buffer.buffer);
  }

  #read(type: number, pointer: { value: number }) {
    let val: unknown;
    switch (type) {
      case 0x01: // uint8
        return this.#buffer.getUint8(pointer.value++);
      case 0x02: // uint16
        val = this.#buffer.getUint16(pointer.value, true);
        pointer.value += 2;
        return val;
      case 0x03: // uint32
        val = this.#buffer.getUint32(pointer.value, true);
        pointer.value += 4;
        return val;
      case 0x04: // uint64
        val = this.#buffer.getBigUint64(pointer.value, true);
        pointer.value += 8;
        return val;
      case 0x05: // int8
        return this.#buffer.getInt8(pointer.value++);
      case 0x06: // int16
        val = this.#buffer.getInt16(pointer.value, true);
        pointer.value += 2;
        return val;
      case 0x07: // int32
        val = this.#buffer.getInt32(pointer.value, true);
        pointer.value += 4;
        return val;
      case 0x08: // int64
        val = this.#buffer.getBigInt64(pointer.value, true);
        pointer.value += 8;
        return val;
      case 0x09: // float32
        val = this.#buffer.getFloat32(pointer.value, true);
        pointer.value += 4;
        return val;
      case 0x0A: // float64
        val = this.#buffer.getFloat64(pointer.value, true);
        pointer.value += 8;
        return val;
      case 0x0b: { // Optional
        const type = this.#buffer.getUint8(pointer.value++);
        return this.#read(type, pointer);
      }
      case 0x0c: // Optional (empty)
        return null;
      case 0x10:
      case 0x11:
      case 0x12:
      case 0x13:
      case 0x14:
      case 0x15:
      case 0x16:
      case 0x17:
      case 0x18:
      case 0x19:
      case 0x1a:
      case 0x1b:
      case 0x1c:
      case 0x1d:
      case 0x1e: { // small string
        const length = type - 0x10;
        const slice = this.#buffer.buffer.slice(
          pointer.value,
          pointer.value + length,
        );
        pointer.value += length;
        return new TextDecoder().decode(slice);
      }
      case 0x1f: { // string
        const length = this.#buffer.getUint32(pointer.value, true);
        pointer.value += 4;
        const slice = this.#buffer.buffer.slice(
          pointer.value,
          pointer.value + length,
        );
        pointer.value += length;
        return new TextDecoder().decode(slice);
      }
      case 0x20: { // list
        const listType = this.#buffer.getUint8(pointer.value++);
        const length = this.#buffer.getUint32(pointer.value, true);
        pointer.value += 4;

        const result: unknown[] = [];

        for (let i = 0; i < length; i++) {
          if (variableLengthTypes.includes(listType)) {
            const itemType = this.#buffer.getUint8(pointer.value++);
            result.push(this.#read(itemType, pointer));
          } else {
            result.push(this.#read(listType, pointer));
          }
        }

        return result;
      }
      case 0x21: { // map
        const keyType = this.#buffer.getUint8(pointer.value++);
        const valType = this.#buffer.getUint8(pointer.value++);
        const length = this.#buffer.getUint32(pointer.value, true);
        pointer.value += 4;

        const result: Map<unknown, unknown> = new Map();

        for (let i = 0; i < length; i++) {
          let key: unknown;
          if (variableLengthTypes.includes(keyType)) {
            const itemType = this.#buffer.getUint8(pointer.value++);
            key = this.#read(itemType, pointer);
          } else {
            key = this.#read(keyType, pointer);
          }
          let value: unknown;
          if (variableLengthTypes.includes(valType)) {
            const itemType = this.#buffer.getUint8(pointer.value++);
            key = this.#read(itemType, pointer);
          } else {
            key = this.#read(valType, pointer);
          }
          result.set(
            key,
            value,
          );
        }

        return result;
      }
      case 0x30:
      case 0x31:
      case 0x32:
      case 0x33:
      case 0x34:
      case 0x35:
      case 0x36:
      case 0x37:
      case 0x38:
      case 0x39:
      case 0x3a:
      case 0x3b:
      case 0x3c:
      case 0x3d:
      case 0x3e:
      case 0x3f: { // small array
        const length = type - 0x30;
        const listType = this.#buffer.getUint8(pointer.value++);
        const result: unknown[] = [];

        for (let i = 0; i < length; i++) {
          result.push(this.#read(listType, pointer));
        }

        return result;
      }
      case 0xe0: // Item Stack
        return {
          id: this.#read(this.#buffer.getUint8(pointer.value++), pointer),
          count: this.#read(this.#buffer.getUint8(pointer.value++), pointer),
          data: JSON.parse(
            this.#read(this.#buffer.getUint8(pointer.value++), pointer),
          ),
        };

      case 0xe1: // Inventory
        return {
          owner: this.#read(this.#buffer.getUint8(pointer.value++), pointer),
          slotCount: this.#read(
            this.#buffer.getUint8(pointer.value++),
            pointer,
          ),
          activeSlot: this.#read(
            this.#buffer.getUint8(pointer.value++),
            pointer,
          ),
          items: this.#read(this.#buffer.getUint8(pointer.value++), pointer),
        };

      case 0xe1: // Fluid Stack
        return {
          id: this.#read(this.#buffer.getUint8(pointer.value++), pointer),
          amount: this.#read(this.#buffer.getUint8(pointer.value++), pointer),
        };

      default:
        throw new Error(`Unknown type ${type}`);
    }
  }

  read() {
    const pointer = { value: 0 };
    const value: unknown[] = [];

    while (pointer.value < this.#buffer.byteLength) {
      const type = this.#buffer.getUint8(pointer.value++);

      try {
        value.push(this.#read(type, pointer));
      } catch {
        break;
      }
    }

    return value;
  }
}
