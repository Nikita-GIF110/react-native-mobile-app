export function daysAgo(dateString: string | null | undefined) {
  if (!dateString) {
    return 0;
  }

  const pastDate = new Date(dateString);
  const now = new Date();

  const diffInMs = now.getTime() - pastDate.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  return diffInDays;
}

export const formatDate = (
  dateString: string | null | undefined,
  type?: "dd.mm.yyyy" | "mm.yyyy" = "dd.mm.yyyy"
) => {
  if (!dateString) {
    return "";
  }

  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");

  if (type === "mm.yyyy") {
    return `${month}.${year}`;
  }

  const day = String(date.getDate()).padStart(2, "0");
  return `${day}.${month}.${year}`;
};

export const formatTime = (dateString: string | null | undefined) => {
  if (!dateString) {
    return "";
  }

  const date = new Date(dateString);

  const hours = date.getHours(); // Часы (0-23)
  const minutes = date.getMinutes(); // Минуты (0-59)
  const formattedTime = `${String(hours).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")}`;

  return formattedTime;
};
