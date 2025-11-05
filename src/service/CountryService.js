// ✅ src/service/CountryService.js
export const CountryService = {
  async getCountries() {
    try {
      const res = await fetch(
        "https://restcountries.com/v3.1/all?fields=name,cca2"
      );
      if (!res.ok) throw new Error("Failed to fetch countries");
      const data = await res.json();
      return data.map((country) => ({
        name: country.name.common,
        code: country.cca2,
      }));
    } catch (err) {
      console.error("Error fetching countries:", err);
      return [];
    }
  },
};
