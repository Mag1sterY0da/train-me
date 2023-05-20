export const handleClientError = (err: Error) => {
  throw new Error(err.message);
};
