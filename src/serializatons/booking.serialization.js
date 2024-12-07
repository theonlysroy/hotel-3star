export const getBookingSerialization = {
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
            customerId: { type: "string" },
            roomId: { type: "string" },
            checkInTime: { type: "string" },
            checkOutTime: { type: "string" },
            status: { type: "string" },
            cost: { type: "number" },
          },
        },
      },
    },
  },
};

export const createBookingSerialization = {
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
          customerId: { type: "string" },
          roomId: { type: "string" },
          checkInTime: { type: "string" },
          checkOutTime: { type: "string" },
          status: { type: "string" },
          cost: { type: "number" },
        },
      },
    },
  },
};
