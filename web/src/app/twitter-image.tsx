import { ImageResponse } from "next/og";

import { SOCIAL_IMAGE_SIZE, SocialShareImage } from "./_components/SocialShareImage";

export const alt = "MMorera Agency";
export const size = SOCIAL_IMAGE_SIZE;
export const contentType = "image/png";

export default function TwitterImage() {
    return new ImageResponse(<SocialShareImage />, size);
}
