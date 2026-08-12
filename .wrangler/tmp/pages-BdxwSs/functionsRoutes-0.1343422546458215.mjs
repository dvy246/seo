import { onRequestPost as __api_ai_consultant_ts_onRequestPost } from "/Users/divyyadav/Downloads/project/functions/api/ai-consultant.ts"
import { onRequestPost as __api_audit_ts_onRequestPost } from "/Users/divyyadav/Downloads/project/functions/api/audit.ts"
import { onRequestOptions as __api_beta_signup_ts_onRequestOptions } from "/Users/divyyadav/Downloads/project/functions/api/beta-signup.ts"
import { onRequestPost as __api_beta_signup_ts_onRequestPost } from "/Users/divyyadav/Downloads/project/functions/api/beta-signup.ts"
import { onRequestPost as __api_og_image_ts_onRequestPost } from "/Users/divyyadav/Downloads/project/functions/api/og-image.ts"
import { onRequestOptions as __api_release_diff_ts_onRequestOptions } from "/Users/divyyadav/Downloads/project/functions/api/release-diff.ts"
import { onRequestPost as __api_release_diff_ts_onRequestPost } from "/Users/divyyadav/Downloads/project/functions/api/release-diff.ts"
import { onRequest as __api_audit_ts_onRequest } from "/Users/divyyadav/Downloads/project/functions/api/audit.ts"
import { onRequest as __api_og_image_ts_onRequest } from "/Users/divyyadav/Downloads/project/functions/api/og-image.ts"

export const routes = [
    {
      routePath: "/api/ai-consultant",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_ai_consultant_ts_onRequestPost],
    },
  {
      routePath: "/api/audit",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_audit_ts_onRequestPost],
    },
  {
      routePath: "/api/beta-signup",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_beta_signup_ts_onRequestOptions],
    },
  {
      routePath: "/api/beta-signup",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_beta_signup_ts_onRequestPost],
    },
  {
      routePath: "/api/og-image",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_og_image_ts_onRequestPost],
    },
  {
      routePath: "/api/release-diff",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_release_diff_ts_onRequestOptions],
    },
  {
      routePath: "/api/release-diff",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_release_diff_ts_onRequestPost],
    },
  {
      routePath: "/api/audit",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_audit_ts_onRequest],
    },
  {
      routePath: "/api/og-image",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_og_image_ts_onRequest],
    },
  ]