import { bsqHandleRequest } from "../../lib/lead-handler.mjs";
export const config = { api: { bodyParser: { sizeLimit: "8kb" } } };
export default function handler(req, res) {
  req.url = "/api/form-token";
  return bsqHandleRequest(req, res);
}
