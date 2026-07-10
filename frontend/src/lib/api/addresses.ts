import type { Address, CreateAddressInput, UpdateAddressInput } from "@/types/address";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const errorBody = (await response.json()) as {
        message?: string | string[];
      };

      if (Array.isArray(errorBody.message)) {
        message = errorBody.message.join(", ");
      } else if (errorBody.message) {
        message = errorBody.message;
      }
    } catch {
      // Response body is not JSON — keep default message.
    }

    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function getAddresses(): Promise<Address[]> {
  return request<Address[]>("/addresses");
}

export async function getAddress(id: string): Promise<Address> {
  return request<Address>(`/addresses/${id}`);
}

export async function createAddress(
  data: CreateAddressInput,
): Promise<Address> {
  return request<Address>("/addresses", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateAddress(
  id: string,
  data: UpdateAddressInput,
): Promise<Address> {
  return request<Address>(`/addresses/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteAddress(id: string): Promise<void> {
  return request<void>(`/addresses/${id}`, {
    method: "DELETE",
  });
}
