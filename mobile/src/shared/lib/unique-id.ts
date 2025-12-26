export const uniqueId = () => {
  const randomPart = Math.random().toString(36).substring(2, 9);
  const timestampPart = Date.now().toString(36);

  return `${timestampPart}-${randomPart}`;
};
