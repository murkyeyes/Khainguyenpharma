import { ReadonlyURLSearchParams } from "next/navigation";

export const baseUrl = (typeof process !== 'undefined' && process.env?.VERCEL_PROJECT_PRODUCTION_URL)
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const createUrl = (
  pathname: string,
  params: URLSearchParams | ReadonlyURLSearchParams,
) => {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? "?" : ""}${paramsString}`;

  return `${pathname}${queryString}`;
};

export const ensureStartsWith = (stringToCheck: string, startsWith: string) =>
  stringToCheck.startsWith(startsWith)
    ? stringToCheck
    : `${startsWith}${stringToCheck}`;

export const validateEnvironmentVariables = () => {
  const requiredEnvironmentVariables = [
    "NEXT_PUBLIC_API_URL",
  ];
  const missingEnvironmentVariables = [] as string[];

  requiredEnvironmentVariables.forEach((envVar) => {
    if (!process.env[envVar]) {
      missingEnvironmentVariables.push(envVar);
    }
  });

  if (missingEnvironmentVariables.length) {
    // throw new Error(
    //   `The following environment variables are missing: ${missingEnvironmentVariables.join(
    //     ", ",
    //   )}`,
    // );
    console.warn(`Missing env vars: ${missingEnvironmentVariables.join(", ")}`);
  }
};
