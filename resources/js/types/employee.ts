import type { Category } from "@/types/category";

export type EmploymentType = "regular" | "probationary" | "contractual";
export type RateType = "daily" | "monthly";
export type EmployeeStatus = "active" | "inactive";
export type Sex = "male" | "female";
export type CivilStatus = "single" | "married" | "widowed" | "separated";

export type Employee = {
    id: string;
    category_id: string | null;
    category?: Category | null;
    employee_number: string;
    biometric_id: string | null;
    first_name: string;
    middle_name: string | null;
    last_name: string;
    suffix: string | null;
    birthday: string | null;
    place_of_birth: string | null;
    sex: string | null;
    civil_status: string | null;
    nationality: string | null;
    home_address: string | null;
    contact_number: string | null;
    email_address: string | null;
    hire_date: string | null;
    employment_type: string;
    rate_type: string;
    rate: number | string;
    status: string;
};

export type EmployeeFormData = {
    category_id: string;
    employee_number: string;
    biometric_id: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    suffix: string;
    birthday: string;
    place_of_birth: string;
    sex: string;
    civil_status: string;
    nationality: string;
    home_address: string;
    contact_number: string;
    email_address: string;
    hire_date: string;
    employment_type: string;
    rate_type: string;
    rate: string;
    status: string;
};

export type EmployeePageProps = {
    employees: Employee[];
    categories: Category[];
};
