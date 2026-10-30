let bsqPhoneUtilsPromise;

// The stable public module is intentionally excluded from Next.js chunking.
// It is fetched only when phone validation is first needed and shared by all forms.
export function bsqLoadPhoneUtils() {
  bsqPhoneUtilsPromise ||= import(
    /* webpackIgnore: true */ "/assets/phone-number-utils.js"
  )
    .then((module) => {
      if (typeof module.default?.isValidNumber !== "function")
        throw new Error("Invalid phone validator");
      return module.default;
    })
    .catch(() => {
      bsqPhoneUtilsPromise = null;
      throw new Error(
        "Phone validation could not load. Please refresh the page and try again.",
      );
    });
  return bsqPhoneUtilsPromise;
}
