import { getCountryForTimezone } from "countries-and-timezones";

const REGION_PATTERN = /^[A-Za-z]{2}$/;

export const normalizeCountryCode = (countryCode: string | null | undefined) => {
  if (!countryCode) {
    return undefined;
  }

  const normalized = countryCode.trim().toUpperCase();
  return REGION_PATTERN.test(normalized) ? normalized : undefined;
};

export const getFlagEmojiFromCountryCode = (countryCode: string | null | undefined) => {
  const normalized = normalizeCountryCode(countryCode);

  if (!normalized) {
    return "🌐";
  }

  return String.fromCodePoint(
    ...normalized.split("").map((char) => 127397 + char.charCodeAt(0)),
  );
};

export const getCountryPresentation = (metadata?: {
  timezone?: string | null;
}) => {
  const timezone = metadata?.timezone?.trim();
  const country = timezone ? getCountryForTimezone(timezone) : undefined;
  const countryCode = normalizeCountryCode(country?.id);

  return {
    code: countryCode,
    flag: getFlagEmojiFromCountryCode(countryCode),
    name: country?.name ?? timezone ?? "Unknown location",
  };
};
