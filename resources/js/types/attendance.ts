import type { Employee } from "@/types/employee";

export type AttendanceStatus =
    | "present"
    | "absent"
    | "late"
    | "rest_day";

export type AttendanceSource = "manual" | "biometric";

export type Attendance = {
    id: string;
    employee_id: string;
    attendance_date: string;
    time_in: string | null;
    time_out: string | null;
    tardy_minutes: number;
    status: AttendanceStatus;
    source: AttendanceSource;
    biometric_reference: string | null;
    remarks: string | null;
    created_at: string;
    updated_at: string;
};

export type AttendanceFormData = {
    attendance_date: string;
    time_in: string;
    time_out: string;
    tardy_minutes: string;
    status: AttendanceStatus;
    source: AttendanceSource;
    biometric_reference: string;
    remarks: string;
};

export type AttendancePageProps = {
    employee: Employee;
    attendances: Attendance[];
};