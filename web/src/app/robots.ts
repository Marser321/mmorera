import type { MetadataRoute } from "next";
import { SITE_IDENTITY } from "@/config/site";
export default function robots(): MetadataRoute.Robots { return { rules: { userAgent: "*", allow: "/", disallow: ["/api/"] }, sitemap: `${SITE_IDENTITY.canonical}/sitemap.xml`, host: SITE_IDENTITY.canonical }; }
