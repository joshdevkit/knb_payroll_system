import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import type { Employee, EmployeeFormData } from "@/types/employee";
import { formatDateInput } from "@/lib/utils";

const emptyForm: EmployeeFormData = {
    category_id: "",
    employee_number: "",
    biometric_id: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    suffix: "",
    birthday: "",
    place_of_birth: "",
    sex: "",
    civil_status: "",
    nationality: "Filipino",
    home_address: "",
    contact_number: "",
    email_address: "",
    hire_date: "",
    employment_type: "regular",
    rate_type: "daily",
    rate: "0",
    status: "active",
};

const toForm = (employee: Employee): EmployeeFormData => ({
    category_id: employee.category_id ?? "",
    employee_number: employee.employee_number,
    biometric_id: employee.biometric_id ?? "",
    first_name: employee.first_name,
    middle_name: employee.middle_name ?? "",
    last_name: employee.last_name,
    suffix: employee.suffix ?? "",
    birthday: formatDateInput(employee.birthday),
    place_of_birth: employee.place_of_birth ?? "",
    sex: employee.sex ?? "",
    civil_status: employee.civil_status ?? "",
    nationality: employee.nationality ?? "",
    home_address: employee.home_address ?? "",
    contact_number: employee.contact_number ?? "",
    email_address: employee.email_address ?? "",
    hire_date: formatDateInput(employee.hire_date),
    employment_type: employee.employment_type,
    rate_type: employee.rate_type,
    rate: String(employee.rate),
    status: employee.status,
});

type Props = {
    employee: Employee | null;
    open: boolean;
    onSuccess?: () => void;
};

export function useEmployeeForm({ employee, open, onSuccess }: Props) {
    const [data, setData] = useState<EmployeeFormData>(emptyForm);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (open) {
            setData(employee ? toForm(employee) : { ...emptyForm });
        }
    }, [employee, open]);

    const setField = <K extends keyof EmployeeFormData>(
        field: K,
        value: EmployeeFormData[K],
    ) => {
        setData((current) => ({ ...current, [field]: value }));
    };

    const submit = () => {
        setProcessing(true);

        const options = {
            preserveScroll: true,
            onSuccess: () => onSuccess?.(),
            onFinish: () => setProcessing(false),
        };

        if (employee) {
            router.put(`/employees/${employee.id}`, data, options);
        } else {
            router.post("/employees", data, options);
        }
    };

    return { data, processing, setField, submit };
}
