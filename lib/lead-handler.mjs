import { bsqWebhookPayload, bsqLeadReferrer } from "./lead-webhook.mjs";
import {
  randomUUID,
  randomBytes,
  createHmac,
  timingSafeEqual,
  createHash,
} from "node:crypto";
import { bsqCountries } from "./countries.js";
import bsqPhoneUtils from "./phone-number-utils.js";
import { bsqValidateLead } from "./validation.js";

const bsqRateLimit = new Map();
const bsqRecentLeads = new Map();
const bsqUsedTokens = new Map();
const bsqTokenSecret = process.env.BSQ_FORM_TOKEN_SECRET || randomBytes(32);
const bsqOnVercel = process.env.VERCEL === "1";
function bsqClientIP(request) {
  return bsqOnVercel
    ? String(
        request.headers["x-vercel-forwarded-for"] ||
          request.headers["x-forwarded-for"] ||
          request.socket?.remoteAddress ||
          "unknown",
      )
        .split(",")[0]
        .trim()
    : request.socket?.remoteAddress || "unknown";
}
function bsqIssueToken() {
  const value = Date.now() + ":" + randomUUID();
  return (
    value +
    ":" +
    createHmac("sha256", bsqTokenSecret).update(value).digest("hex")
  );
}
function bsqCheckToken(token) {
  if (
    typeof token !== "string" ||
    token.length > 150 ||
    bsqUsedTokens.has(token)
  )
    return false;
  const parts = token.split(":");
  if (parts.length !== 3 || !/^[a-f0-9]{64}$/.test(parts[2])) return false;
  const age = Date.now() - Number(parts[0]);
  if (!Number.isFinite(age) || age < 0 || age > 300000) return false;
  const signature = createHmac("sha256", bsqTokenSecret)
    .update(parts[0] + ":" + parts[1])
    .digest();
  return timingSafeEqual(signature, Buffer.from(parts[2], "hex"));
}

function bsqJson(response, status, body) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(JSON.stringify(body));
}

async function bsqCollectLead(request, response) {
  if (
    !String(request.headers["content-type"] || "").startsWith(
      "application/json",
    )
  )
    return bsqJson(response, 415, { error: "Please submit a JSON enquiry." });
  const bsqOrigin = request.headers.origin;
  if (bsqOrigin) {
    let bsqOriginHost;
    try {
      bsqOriginHost = new URL(bsqOrigin).host;
    } catch {
      return bsqJson(response, 403, { error: "Invalid origin." });
    }
    if (bsqOriginHost !== request.headers.host)
      return bsqJson(response, 403, {
        error: "Cross-site requests are not allowed.",
      });
  }
  const bsqIP = bsqClientIP(request);
  const bsqNow = Date.now();
  let bsqBucket = bsqRateLimit.get(bsqIP);
  if (!bsqBucket && bsqRateLimit.size >= 5000)
    return bsqJson(response, 429, { error: "Please try again shortly." });
  if (!bsqBucket || bsqBucket.reset <= bsqNow) {
    bsqBucket = { count: 0, reset: bsqNow + 60000 };
    bsqRateLimit.set(bsqIP, bsqBucket);
  }
  if (++bsqBucket.count > 8)
    return bsqJson(response, 429, {
      error: "Too many enquiries. Please wait a minute and try again.",
    });
  let bsqBody = "";
  try {
    if (request.body !== undefined)
      bsqBody =
        typeof request.body === "string"
          ? request.body
          : JSON.stringify(request.body);
    else
      for await (const bsqChunk of request) {
        bsqBody += bsqChunk;
        if (Buffer.byteLength(bsqBody) > 8192)
          return bsqJson(response, 413, {
            error: "Your enquiry is too large.",
          });
      }
  } catch {
    return bsqJson(response, 400, {
      error: "Invalid enquiry. Please try again.",
    });
  }
  if (Buffer.byteLength(bsqBody) > 8192)
    return bsqJson(response, 413, { error: "Your enquiry is too large." });
  let bsqInput;
  try {
    bsqInput = JSON.parse(bsqBody);
  } catch {
    return bsqJson(response, 400, {
      error: "Invalid enquiry. Please try again.",
    });
  }
  if (!bsqInput || typeof bsqInput !== "object" || Array.isArray(bsqInput))
    return bsqJson(response, 400, { error: "Invalid enquiry." });
  if (bsqInput.website) return bsqJson(response, 200, { ok: true });
  if (!bsqCheckToken(bsqInput.formToken))
    return bsqJson(response, 403, {
      error: "Please refresh the form and try again.",
    });
  const bsqName = typeof bsqInput.name === "string" ? bsqInput.name.trim() : "";
  const bsqEmail =
    typeof bsqInput.email === "string"
      ? bsqInput.email.trim().toLowerCase()
      : "";
  const bsqPhone =
    typeof bsqInput.phone === "string" ? bsqInput.phone.trim() : "";
  const bsqMessage =
    typeof bsqInput.message === "string" ? bsqInput.message.trim() : "";
  const bsqValidation = bsqValidateLead(bsqInput);
  const bsqCountry = bsqCountries.find(
    (country) => country.iso === bsqInput.country,
  );
  const bsqNormalized = bsqCountry
    ? bsqPhoneUtils.formatNumber(
        bsqPhone,
        bsqCountry.iso,
        bsqPhoneUtils.numberFormat.E164,
      )
    : "";
  if (
    bsqValidation ||
    !bsqCountry ||
    bsqInput.callingCode !== "+" + bsqCountry.dial ||
    !/^\+[1-9]\d{6,14}$/.test(bsqNormalized) ||
    !bsqNormalized.startsWith("+" + bsqCountry.dial) ||
    !bsqPhoneUtils.isValidNumber(bsqPhone, bsqCountry.iso) ||
    bsqInput.consent !== true
  ) {
    return bsqJson(response, 400, {
      error:
        bsqValidation ||
        "Please enter a valid phone number for your country and agree to be contacted.",
    });
  }
  const bsqDuplicateKey = createHash("sha256")
    .update(bsqEmail + ":" + bsqNormalized)
    .digest("hex");
  const bsqPrevious = bsqRecentLeads.get(bsqDuplicateKey);
  if (bsqPrevious && bsqPrevious.expires > Date.now()) {
    bsqUsedTokens.set(bsqInput.formToken, Date.now() + 300000);
    return bsqJson(response, 200, { ok: true, id: bsqPrevious.id });
  }
  const bsqAttribution = {};
  if (bsqInput.attribution && typeof bsqInput.attribution === "object") {
    for (const key of [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
    ])
      if (typeof bsqInput.attribution[key] === "string")
        bsqAttribution[key] = bsqInput.attribution[key].slice(0, 200);
  }
  const bsqLead = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    name: bsqName,
    email: bsqEmail,
    phone: bsqNormalized,
    consent: true,
    intent:
      typeof bsqInput.intent === "string"
        ? bsqInput.intent.slice(0, 120)
        : "General enquiry",
    source: ["hero", "brochure", "footer", "modal"].includes(bsqInput.source)
      ? bsqInput.source
      : "footer",
    attribution: bsqAttribution,
  };
  bsqLead.message = bsqMessage;
  bsqLead.project_interest = "Berkeley Square";
  bsqLead.referrer = bsqLeadReferrer(
    request.headers.referer || bsqInput.referrer,
  );
  bsqLead.country =
    typeof bsqInput.country === "string" && /^[a-z]{2}$/.test(bsqInput.country)
      ? bsqInput.country
      : null;
  bsqLead.callingCode =
    typeof bsqInput.callingCode === "string" &&
    /^\+\d{1,4}$/.test(bsqInput.callingCode)
      ? bsqInput.callingCode
      : null;
  bsqLead.consentPolicy = "https://prestigeone.ae/privacy-policy";
  if (bsqUsedTokens.size >= 5000)
    bsqUsedTokens.delete(bsqUsedTokens.keys().next().value);
  bsqUsedTokens.set(bsqInput.formToken, Date.now() + 300000);
  if (process.env.BSQ_LEAD_WEBHOOK_URL) {
    if (!process.env.BSQ_LEAD_WEBHOOK_TOKEN?.trim())
      return bsqJson(response, 503, {
        error:
          "Online enquiries are being configured. Please call 800 773 78443 or contact us on WhatsApp.",
      });
    const bsqDestination = new URL(process.env.BSQ_LEAD_WEBHOOK_URL);
    if (
      bsqDestination.protocol !== "https:" &&
      !(
        process.env.NODE_ENV === "test" &&
        bsqDestination.hostname === "127.0.0.1"
      )
    )
      throw new Error("Webhook must use HTTPS");
    const bsqHeaders = {
      "Content-Type": "application/json",
      "Idempotency-Key": bsqLead.id,
    };
    bsqHeaders.Authorization =
      "Bearer " +
      process.env.BSQ_LEAD_WEBHOOK_TOKEN.trim().replace(/^Bearer\s+/i, "");
    let bsqDelivery;
    try {
      bsqDelivery = await fetch(bsqDestination, {
        method: "POST",
        headers: bsqHeaders,
        body: JSON.stringify(bsqWebhookPayload(bsqLead)),
        signal: AbortSignal.timeout(10000),
        redirect: "manual",
      });
    } catch (bsqError) {
      console.error(
        JSON.stringify({
          event: "bsq-lead-delivery-failed",
          reference: bsqLead.id,
          reason: bsqError.name === "TimeoutError" ? "timeout" : "connection",
          transportCode: bsqError.cause?.code || null,
          host: bsqDestination.host,
        }),
      );
      return bsqJson(response, 502, {
        error:
          "Your enquiry could not be delivered. Please try again or call our team.",
        reference: bsqLead.id,
        deliveryCode:
          bsqError.name === "TimeoutError"
            ? "PORTAL_TIMEOUT"
            : "PORTAL_CONNECTION_FAILED",
      });
    }
    if (!bsqDelivery.ok) {
      // Log only status/configuration metadata, never tokens, payloads or response bodies.
      console.error(
        JSON.stringify({
          event: "bsq-lead-delivery-failed",
          reference: bsqLead.id,
          portalStatus: bsqDelivery.status,
          host: bsqDestination.host,
          path: bsqDestination.pathname,
          project: "Berkeley Square",
        }),
      );
      await bsqDelivery.body?.cancel();
      return bsqJson(response, 502, {
        error:
          "Your enquiry could not be delivered. Please try again or call our team.",
        reference: bsqLead.id,
        portalStatus: bsqDelivery.status,
      });
    }
    await bsqDelivery.body?.cancel();
  } else {
    return bsqJson(response, 503, {
      error:
        "Online enquiries are being configured. Please call 800 773 78443 or contact us on WhatsApp.",
    });
  }
  if (bsqRecentLeads.size >= 5000)
    bsqRecentLeads.delete(bsqRecentLeads.keys().next().value);
  if (bsqUsedTokens.size >= 5000)
    bsqUsedTokens.delete(bsqUsedTokens.keys().next().value);
  bsqRecentLeads.set(bsqDuplicateKey, {
    id: bsqLead.id,
    expires: Date.now() + 300000,
  });
  bsqUsedTokens.set(bsqInput.formToken, Date.now() + 300000);
  bsqJson(response, 201, { ok: true, id: bsqLead.id });
}

export async function bsqHandleRequest(request, response) {
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  response.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'",
  );
  try {
    const bsqURL = new URL(
      request.url,
      `http://${request.headers.host || "localhost"}`,
    );
    if (bsqURL.pathname === "/api/form-token") {
      if (bsqOnVercel && !process.env.BSQ_FORM_TOKEN_SECRET)
        return bsqJson(response, 503, {
          error:
            "Online enquiries are being configured. Please call 800 773 78443 or contact us on WhatsApp.",
        });
      if (
        request.method !== "GET" ||
        request.headers["sec-fetch-site"] === "cross-site"
      )
        return bsqJson(response, 403, { error: "Invalid form request." });
      const key = "token:" + bsqClientIP(request);
      const now = Date.now();
      let bucket = bsqRateLimit.get(key);
      if (!bucket && bsqRateLimit.size >= 5000)
        return bsqJson(response, 429, { error: "Please try again shortly." });
      if (!bucket || bucket.reset <= now) {
        bucket = { count: 0, reset: now + 60000 };
        bsqRateLimit.set(key, bucket);
      }
      if (++bucket.count > 30)
        return bsqJson(response, 429, {
          error: "Please try again in a minute.",
        });
      return bsqJson(response, 200, { token: bsqIssueToken() });
    }
    if (bsqURL.pathname === "/api/leads") {
      if (request.method !== "POST") {
        response.setHeader("Allow", "POST");
        return bsqJson(response, 405, { error: "Method not allowed." });
      }
      return await bsqCollectLead(request, response);
    }
    return bsqJson(response, 404, { error: "Not found." });
  } catch (error) {
    if (!response.headersSent)
      bsqJson(response, error.code === "ENOENT" ? 404 : 500, {
        error:
          error.code === "ENOENT"
            ? "Not found."
            : "Unable to save your enquiry. Please try again or call our team.",
      });
    else response.destroy();
  }
}

const bsqCleanup = setInterval(() => {
  const bsqNow = Date.now();
  for (const [key, value] of bsqRecentLeads)
    if (value.expires < bsqNow) bsqRecentLeads.delete(key);
  for (const [key, expires] of bsqUsedTokens)
    if (expires < bsqNow) bsqUsedTokens.delete(key);
  for (const [key, bucket] of bsqRateLimit)
    if (bucket.reset < bsqNow) bsqRateLimit.delete(key);
}, 60000);
bsqCleanup.unref();
