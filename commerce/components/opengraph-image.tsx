import { ImageResponse } from "next/og";

export type Props = {
  title?: string;
};

export default async function OpengraphImage(
  props?: Props,
): Promise<ImageResponse> {
  const { title } = {
    ...{
      title: process.env.SITE_NAME || "Khải Nguyên Pharma",
    },
    ...props,
  };

  return new ImageResponse(
    (
      <div tw="flex h-full w-full flex-col items-center justify-center bg-white">
        <div tw="flex flex-col items-center justify-center">
          <p tw="text-6xl font-bold text-blue-600 tracking-tight">{title}</p>
          <p tw="mt-4 text-2xl text-gray-500">Dược phẩm & Thiết bị y tế</p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
