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
    const data = err.data as ApiErrorShape & {
      title?: string;
      errors?: string[] | Record<string, string[]>;
    };

    if (data.errors) {
      if (Array.isArray(data.errors) && data.errors.length > 0) {
        return data.errors.join(" ");
      }

      if (!Array.isArray(data.errors)) {
        const messages = Object.values(data.errors).flat();
        if (messages.length > 0) {
          return messages.join(" ");
        }
      }
    }

    if (data.message) {
      return data.message;
    }

    if (data.title) {
      return data.title;
    }
  }

  if (err instanceof Error) {
    return err.message;
  }

  return "Something went wrong. Please try again.";
}
