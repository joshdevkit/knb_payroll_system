export type Category = {
    id: string;
    name: string;
    description: string | null;
    is_active: boolean;
};

export type CategoryFormData = {
    name: string;
    description: string;
    is_active: boolean;
};
