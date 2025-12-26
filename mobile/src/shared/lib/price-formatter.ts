export const priceFormatter = (num?: number, curr?: string) => {
  if (!num) {
    return "";
  }

  const value = num.toLocaleString("ru-RU");

  return curr ? `${value} ${curr}` : value;
};
