// The destination expects one JSON object; project_interest cannot be overridden by a visitor.
export function bsqWebhookPayload(lead) {
  return {
    name: lead.name,
    phone: lead.phone,
    email: lead.email,
    source: lead.referrer || "",
    project_interest: "Berkeley Square",
    message: lead.message || "Registered for interest",
    consent: lead.consent === true,
    country: lead.country,
    calling_code: lead.callingCode,
    intent: lead.intent,
    form_source: lead.source,
    created_at: lead.createdAt,
    consent_policy: lead.consentPolicy,
    attribution: lead.attribution || {},
  };
}

export function bsqLeadReferrer(value) {
  try {
    const url = new URL(typeof value === "string" ? value.slice(0, 2048) : "");
    if (!["http:", "https:"].includes(url.protocol)) return "";
    url.username = "";
    url.password = "";
    url.hash = "";
    return url.href;
  } catch {
    return "";
  }
}
