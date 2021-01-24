import { OncostsItem } from "./oncosts-item";

export interface OncostsAdmin {
  casualLoading: number;
  superannuation: number;
  taxes: OncostsItem[];
  insurances: OncostsItem[];
  other: OncostsItem[];
}
