export interface Address {
  id: string;
  firstName: string;
  lastName: string;
  houseNumber: string;
  street: string;
  subDistrict: string;
  district: string;
  province: string;
  postalCode: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateAddressInput = Omit<
  Address,
  "id" | "createdAt" | "updatedAt"
>;

export type UpdateAddressInput = Partial<CreateAddressInput>;
