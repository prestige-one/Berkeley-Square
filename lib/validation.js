// Shared browser/server rules; scripts and markup are rejected, never rendered.
export function bsqValidateLead(input, field) {
  if (!field || field === "name") {
    const name = typeof input.name === "string" ? input.name.trim() : "";
    if (
      name.length < 2 ||
      name.length > 100 ||
      !/^[\p{L}\p{M}][\p{L}\p{M} .’'\-]*$/u.test(name) ||
      (name.match(/\p{L}/gu) || []).length < 2
    )
      return "Please enter your name using letters, spaces, apostrophes or hyphens.";
  }
  if (!field || field === "email") {
    const email = typeof input.email === "string" ? input.email.trim() : "";
    if (
      email.length > 254 ||
      !/^[A-Z0-9!#$%&'*+/=?^_`{|}~.-]+@[A-Z0-9](?:[A-Z0-9.-]*[A-Z0-9])?\.[A-Z]{2,63}$/i.test(
        email,
      ) ||
      email.includes("..") ||
      email.startsWith(".") ||
      email.includes(".@") ||
      /(^|[.@])-|-(?=[.@])/u.test(email)
    )
      return "Please enter a valid email address.";
  }
  if (
    !field &&
    ((typeof input.message !== "undefined" &&
      typeof input.message !== "string") ||
      (input.message || "").length > 1000 ||
      /[<>\u0000-\u0008]/u.test(input.message || ""))
  )
    return "Please use plain text and keep your message within 1,000 characters.";
  return "";
}
