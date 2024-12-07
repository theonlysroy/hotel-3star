export const getRoomTypeSerialization = {
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
            typeName: { type: "string" },
          },
        },
      },
    },
  },
};

export const getRoomTypeByIdSerialization = {
  200: {
    type: "object",
    properties: {
      name: { type: "string" },
      statusCode: { type: "number" },
      success: { type: "boolean" },
      data: {
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
          typeName: { type: "string" },
        },
      },
    },
  },
};

export const updateRoomTypeSerialization = {
  200: {
    type: "object",
    properties: {
      name: { type: "string" },
      statusCode: { type: "number" },
      success: { type: "boolean" },
      data: {
        type: "object",
        properties: {
          typeName: { type: "string" },
        },
      },
    },
  },
};

export const deleteRoomTypeSerialization = {
  200: {
    type: "object",
    properties: {
      name: { type: "string" },
      statusCode: { type: "number" },
      success: { type: "boolean" },
      data: {
        type: "object",
        properties: {
          typeName: { type: "string" },
        },
      },
    },
  },
};
