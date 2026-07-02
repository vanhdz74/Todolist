export const fixedCategories = [
  { name: "Blue category", color: "blue", swatch: "#7bdcff" },
  { name: "Green category", color: "green", swatch: "#9ce8aa" },
  { name: "Orange category", color: "orange", swatch: "#ffb56b" },
  { name: "Purple category", color: "purple", swatch: "#c9a7ff" },
  { name: "Red category", color: "red", swatch: "#ff9aa2" },
  { name: "Yellow category", color: "yellow", swatch: "#ffe45c" },
] as const;

export const repeatOptions = [
  { label: "Does not repeat", value: "NONE" },
  { label: "Daily", value: "DAILY" },
  { label: "Weekdays", value: "WEEKDAYS" },
  { label: "Weekly", value: "WEEKLY" },
  { label: "Monthly", value: "MONTHLY" },
];

export const formatCreatedDate = (value?: string) => {
  if (!value) return "Created recently";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Created recently";

  return `Created ${new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)}`;
};

export const formatModifiedDate = (value?: string) => {
  if (!value) return "Updated recently";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Updated recently";

  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));

  if (seconds < 60) return "Updated a few seconds ago";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `Updated ${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `Updated ${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  return `Updated ${new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)}`;
};

export const formatReminderDisplay = (value?: string | null) => {
  if (!value) {
    return {
      title: "Remind me",
      subtitle: "",
    };
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return {
      title: "Remind me",
      subtitle: "",
    };
  }

  const time = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
  const day = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date);

  return {
    title: `Remind me at ${time}`,
    subtitle: day,
  };
};
