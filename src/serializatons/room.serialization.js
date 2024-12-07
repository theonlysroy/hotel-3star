export const getRoomSerialization = {
  200: {
    type: "object",
    properties: {
      name: { type: "string" },
      statusCode: { type: "number" },
      success: { type: "boolean" },
      data: {
        type: "array",
        items: {
          type: "object",
          properties: {
            _id: { type: "string" },
            roomNumber: { type: "string" },
            coverPhoto: { type: "string" },
            roomTypeDetails: {
              type: "object",
              properties: {
                typeName: { type: "string" },
                bedroomCount: { type: "number" },
                isAirconditioned: { type: "boolean" },
                hasTv: { type: "boolean" },
                hasBathtub: { type: "boolean" },
                hasBalcony: { type: "boolean" },
                costPerDay: { type: "number" },
              },
            },
            isOccupied: { type: "boolean" },
            isUnderMaintenance: { type: "boolean" },
            currentGuestId: { type: "string" },
          },
        },
      },
    },
  },
};

export const createRoomTypeSerialization = {
  201: {
    type: "object",
    properties: {
      name: { type: "string" },
      statusCode: { type: "number" },
      success: { type: "boolean" },
      data: {
        type: "object",
        properties: {
          _id: { type: "string" },
        },
      },
    },
  },
};
