const asyncHandler = async (promise) => {
  try {
    const result = await promise;
    return [null, result];
  } catch (error) {
    return [error, null];
  }
};
export default asyncHandler;
