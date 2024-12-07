export const createRoomTypeBodySchema = {
  type: "object",
  required: [
    "typeName, isAirconditioned, noOfRooms, hasTv, hasBathtub, hasBalcony",
  ],
  properties: {
    typeName: { type: "string" },
    isAirconditioned: { type: "boolean" },
    noOfRooms: { type: "number" },
    hasTv: { type: "boolean" },
    hasBathtub: { type: "boolean" },
    hasBalcony: { type: "boolean" },
  },
};
