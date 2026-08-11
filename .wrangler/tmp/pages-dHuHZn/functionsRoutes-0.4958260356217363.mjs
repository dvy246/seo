import { onRequestPost as __api_audit_ts_onRequestPost } from "/Users/divyyadav/Downloads/project/functions/api/audit.ts"
import { onRequestPost as __api_og_image_ts_onRequestPost } from "/Users/divyyadav/Downloads/project/functions/api/og-image.ts"
import { onRequest as __api_audit_ts_onRequest } from "/Users/divyyadav/Downloads/project/functions/api/audit.ts"
import { onRequest as __api_og_image_ts_onRequest } from "/Users/divyyadav/Downloads/project/functions/api/og-image.ts"

export const routes = [
    {
      routePath: "/api/audit",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_audit_ts_onRequestPost],
    },
  {
      routePath: "/api/og-image",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_og_image_ts_onRequestPost],
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