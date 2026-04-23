import { useCallback } from "react";

const LOCATION_INPUT_ID = "location-search-input";

const useFocusLocationInput = () => {
  return useCallback(() => {
    const input = document.getElementById(
      LOCATION_INPUT_ID,
    ) as HTMLInputElement | null;

    if (!input) return;

    input.scrollIntoView({ behavior: "smooth", block: "center" });
    input.focus({ preventScroll: true });
  }, []);
};

export default useFocusLocationInput;
