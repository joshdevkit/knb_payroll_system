import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import type {
    Attendance,
    AttendanceFormData,
} from "@/types/attendance";
import { formatDateInput } from "@/lib/utils";

const emptyForm: AttendanceFormData = {
    attendance_date: "",
    time_in: "",
    time_out: "",
    tardy_minutes: "0",
    status: "present",
    source: "manual",
    biometric_reference: "",
    remarks: "",
};

function toTimeInput(value: string | null): string {
    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes}`;
}

function toForm(attendance: Attendance): AttendanceFormData {
    return {
        attendance_date: formatDateInput(attendance.attendance_date),
        time_in: toTimeInput(attendance.time_in),
        time_out: toTimeInput(attendance.time_out),
        tardy_minutes: String(attendance.tardy_minutes ?? 0),
        status: attendance.status,
        source: attendance.source,
        biometric_reference: attendance.biometric_reference ?? "",
        remarks: attendance.remarks ?? "",
    };
}

type Props = {
    employeeId: string;
    attendance: Attendance | null;
    open: boolean;
    onSuccess?: () => void;
};

export function useAttendanceForm({
    employeeId,
    attendance,
    open,
    onSuccess,
}: Props) {
    const [data, setData] =
        useState<AttendanceFormData>(emptyForm);

    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (!open) {
            return;
        }

        setData(
            attendance
                ? toForm(attendance)
                : { ...emptyForm },
        );
    }, [attendance, open]);

    const setField = <
        K extends keyof AttendanceFormData,
    >(
        field: K,
        value: AttendanceFormData[K],
    ) => {
        setData((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const submit = () => {
        setProcessing(true);

        const options = {
            preserveScroll: true,

            onSuccess: () => {
                setData({ ...emptyForm });
                onSuccess?.();
            },

            onFinish: () => {
                setProcessing(false);
            },
        };

        if (attendance) {
            router.put(
                `/employees/${employeeId}/attendance/${attendance.id}`,
                data,
                options,
            );
        } else {
            router.post(
                `/employees/${employeeId}/attendance`,
                data,
                options,
            );
        }
    };

    return {
        data,
        processing,
        setField,
        submit,
    };
}