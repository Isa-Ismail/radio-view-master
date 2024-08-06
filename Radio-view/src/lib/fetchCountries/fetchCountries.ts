import { countries, getCountryCode, getEmojiFlag } from "countries-list";

const fetchCountries = () => {
  return Object.values(countries).map((item) => {
    const code = getCountryCode(item.name);
    if (!code) {
      return {
        label: item.name,
        emoji: "",
        code: "",
      };
    }
    return {
      label: item.name,
      emoji: getEmojiFlag(code),
      code: code,
    };
  });
};
export default fetchCountries;
