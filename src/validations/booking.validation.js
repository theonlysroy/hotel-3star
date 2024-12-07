export const createBookingValidation = {
  type: "object",
  required: ["email", "roomId"],
  properties: {
    email: { type: "string" },
    roomId: { type: "string" },
    name: { type: "string" },
    phoneNumber: { type: "string" },
    address: { type: "string" },
  },
};
