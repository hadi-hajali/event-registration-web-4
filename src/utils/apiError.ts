import type { ApiErrorShape } from "../types/common";


interface ThrownApiError {
  status: number;
  data: ApiErrorShape;
}

function isThrownApiError(err: unknown): err is ThrownApiError {
  return (
    typeof err === "object" &&
    err !== null &&
    "status" in err &&
    "data" in err
  );
}

export function getErrorMessage(err: unknown): string {
  if (isThrownApiError(err)) {
    if (err.data.errors && err.data.errors.length > 0) {
      return err.data.errors.join(" ");
    }
    if (err.data.message) {
      return err.data.message;
    }
  }

  if (err instanceof Error) {
    return err.message;
  }

  return "Something went wrong. Please try again.";
}