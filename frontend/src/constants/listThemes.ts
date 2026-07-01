export type ListThemeKey = "blue" | "green" | "purple" | "red";

export const DEFAULT_LIST_COLOR = "#2564cf";

export const listThemes: Record<
  ListThemeKey,
  { label: string; color: string }
> = {
  blue: { label: "Blue", color: DEFAULT_LIST_COLOR },
  green: { label: "Green", color: "#107c10" },
  purple: { label: "Purple", color: "#8764b8" },
  red: { label: "Red", color: "#d13438" },
};

export const getListThemeKeyByColor = (color?: string | null): ListThemeKey => {
  const theme = (Object.keys(listThemes) as ListThemeKey[]).find(
    (key) => listThemes[key].color.toLowerCase() === color?.toLowerCase(),
  );

  return theme ?? "blue";
};
