import { decompress } from "https://deno.land/x/lz4@v0.1.2/mod.ts";
import { PacketReader } from "./packet_reader.ts";

export interface ItemStack {
  id: string;
  count: bigint;
  data: any;
}

export function protocolVersion(arr: any) {
  return {
    version: arr[0] as number,
  };
}

export function tileEntity(arr: any) {
  return {
    tileId: arr[0] as bigint,
    identifier: arr[1] as string,
    realmId: arr[2] as number,
    _unstable_raw: arr as unknown[],
  };
}

export function tileUpdate(arr: any) {
  return {
    realmId: arr[0] as number,
    layer: arr[1] as number,
    positionX: arr[2] as bigint,
    positionY: arr[3] as bigint,
    tileId: arr[4] as number,
  };
}

export function commandResult(arr: any) {
  return {
    commandId: arr[0] as bigint,
    success: !!arr[1],
    message: arr[2] as string,
  };
}

export function selfTeleported(arr: any) {
  return {
    realmId: arr[0] as number,
    positionX: arr[1] as bigint,
    positionY: arr[2] as bigint,
  };
}

export function chunkTiles(arr: any) {
  const compressedChunk = new Uint8Array(arr[0]);
  const chunk = decompress(compressedChunk);
  const reader = new PacketReader(chunk);
  const result = reader.read();

  return {
    realmId: result[0] as number,
    chunkPositionX: result[1] as number,
    chunkPositionY: result[2] as number,
    updateCounter: result[3] as bigint,
    tiles: new Uint16Array(result[4] as number[]),
    fluids: new BigUint64Array(result[5] as bigint[]),
  };
}

export function realmNotice(arr: any) {
  return {
    realmId: arr[0] as number,
    realmType: arr[1] as string,
    tilesetIdentifier: arr[2] as string,
    outdoors: !!arr[3],
  };
}

export function loginStatus(arr: any) {
  return {
    success: !!arr[0],
    id: arr[1] as bigint,
    username: arr[2] as string,
    displayName: arr[3] as string,
    _unstable_raw: arr as unknown[],
  };
}

export function registrationStatus(arr: any) {
  return {
    username: arr[0] as string,
    displayName: arr[1] as string,
    token: arr[2] as bigint,
  };
}

export function entity(arr: any) {
  const entityType = arr[3] as string;
  let extraData: any = {};

  return {
    entityId: arr[0] as bigint,
    identifier: arr[1] as string,
    realmId: arr[2] as number,
    entityType,
    positionX: arr[4] as bigint,
    positionY: arr[5] as bigint,
    facing: arr[6] as number,
    updateCounter: arr[7] as number,
    offsetX: arr[8] as number,
    offsetY: arr[9] as number,
    offsetZ: arr[10] as number,
    zSpeed: arr[11] as number,
    path: arr[12] as number[],
    money: arr[13] as bigint,
    hitpoints: arr[14] as number,
    _unstable_raw: arr as unknown[],
    ...extraData,
  };
}

export function error(arr: any) {
  return {
    message: arr[0] as string,
  };
}

export function entityMoved(arr: any) {
  return {
    entityId: arr[0] as bigint,
    realmId: arr[1] as number,
    positionX: arr[2] as bigint,
    positionY: arr[3] as bigint,
    facing: arr[4] as number,
    newOffset: arr[5] as [number, number, number] | null,
    newZSpeed: arr[6] as number | null,
    adjustOffset: !!arr[7],
    isTeleport: !!arr[8],
  };
}

export function entitySetPath(arr: any) {
  return {
    entityId: arr[0] as bigint,
    realmId: arr[1] as number,
    positionX: arr[2] as bigint,
    positionY: arr[3] as bigint,
    pathDirections: arr[4] as number[],
    newUpdateCounter: arr[5] as bigint,
  };
}

export function inventorySlotUpdate(arr: any) {
  return {
    slot: arr[0] as number,
    item: arr[1] as ItemStack,
  };
}

export function destroyEntity(arr: any) {
  return {
    entityId: arr[0] as bigint,
    realmRequirement: arr[1] as number | null,
  };
}

export function inventory(arr: any) {
  return arr[0];
}

export function setActiveSlot(arr: any) {
  return {
    slot: arr[0] as number,
  };
}

export function destroyTileEntity(arr: any) {
  return {
    tileEntityId: arr[0] as bigint,
  };
}

export function time(arr: any) {
  return {
    time: arr[0] as number,
  };
}

export function fluidUpdate(arr: any) {
  return {
    realmId: arr[0] as number,
    positionX: arr[1] as bigint,
    positionY: arr[2] as bigint,
    fluid: arr[3] as bigint,
  };
}

export function heldItemSet(arr: any) {
  return {
    realmId: arr[0] as number,
    entityId: arr[1] as bigint,
    hand: !!arr[2],
    slot: arr[3] as number,
    newUpdateCounter: arr[4] as bigint,
  };
}

export function openModuleForAgent(arr: any) {
  return {
    moduleIdentifier: arr[0] as string,
    agentId: arr[1] as bigint,
    removeOnMovement: !!arr[2],
  };
}

export function setTileEntityEnergy(arr: any) {
  return {
    tileEntityId: arr[0] as bigint,
    energy: arr[1] as bigint,
  };
}

export function setPlayerStationTypes(arr: any) {
  return {
    identifiers: arr[0] as string[],
  };
}

export function entityChangingRealms(arr: any) {
  return {
    entityId: arr[0] as bigint,
    newRealmId: arr[1] as number,
    newPositionX: arr[2] as bigint,
    newPositionY: arr[3] as bigint,
  };
}

export function chatMessageSent(arr: any) {
  return {
    playerId: arr[0] as bigint,
    message: arr[1] as string,
  };
}

export function openTextTab(arr: any) {
  return {
    name: arr[0] as string,
    message: arr[1] as string,
    removeOnMovement: !!arr[2],
    ephemeral: !!arr[3],
  };
}

export function tileSetResponse(arr: any) {
  return {
    realmId: arr[0] as number,
    tilesetData: arr[1] as Record<number, string>,
  };
}

export function recipeList(arr: any) {
  return {
    recipeTypeIdentifier: arr[0] as string,
    recipeJsons: arr[1] as string[],
  };
}

export function livingEntityHealthChanged(arr: any) {
  return {
    entityGlobalId: arr[0] as bigint,
    newHealth: arr[1] as number,
  };
}

export function villageUpdate(arr: any) {
  return {
    villageId: arr[0] as bigint,
    realmId: arr[1] as number,
    chunkX: arr[2] as number,
    chunkY: arr[3] as number,
    positionX: arr[4] as number,
    positionY: arr[5] as number,
    villageName: arr[6] as string,
    availableLabor: arr[7] as number,
    greedFactor: arr[8] as number,
    resources: arr[9] as Record<string, number>,
  };
}

export function openVillageTrade(arr: any) {
  return {
    villageId: arr[0] as bigint,
    removeOnMove: !!arr[1],
  };
}

export function entityMoneyChanged(arr: any) {
  return {
    globalId: arr[0] as bigint,
    moneyCount: arr[1] as bigint,
  };
}

export const packetIdToName = {
  1: "protocolVersion",
  2: "tileEntity",
  4: "tileUpdate",
  5: "commandResult",
  7: "selfTeleported",
  8: "chunkTiles",
  9: "realmNotice",
  11: "loginStatus",
  13: "registrationStatus",
  14: "entity",
  16: "error",
  17: "entityMoved",
  19: "entitySetPath",
  22: "inventorySlotUpdate",
  23: "destroyEntity",
  24: "inventory",
  25: "setActiveSlot",
  27: "destroyTileEntity",
  30: "time",
  33: "fluidUpdate",
  34: "heldItemSet",
  40: "openModuleForAgent",
  44: "setTileEntityEnergy",
  45: "setPlayerStationTypes",
  46: "entityChangingRealms",
  47: "chatMessageSent",
  48: "openTextTab",
  52: "tileSetResponse",
  53: "recipeList",
  54: "livingEntityHealthChanged",
  57: "villageUpdate",
  58: "openVillageTrade",
  60: "entityMoneyChanged",
} as const;

export const packetIdToDecoder = {
  protocolVersion,
  tileEntity,
  tileUpdate,
  commandResult,
  selfTeleported,
  chunkTiles,
  realmNotice,
  loginStatus,
  registrationStatus,
  entity,
  error,
  entityMoved,
  entitySetPath,
  inventorySlotUpdate,
  destroyEntity,
  inventory,
  setActiveSlot,
  destroyTileEntity,
  time,
  fluidUpdate,
  heldItemSet,
  openModuleForAgent,
  setTileEntityEnergy,
  setPlayerStationTypes,
  entityChangingRealms,
  chatMessageSent,
  openTextTab,
  tileSetResponse,
  recipeList,
  livingEntityHealthChanged,
  villageUpdate,
  openVillageTrade,
  entityMoneyChanged,
} as const;
