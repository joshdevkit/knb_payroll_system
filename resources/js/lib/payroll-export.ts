import * as XLSX from "xlsx-js-style";

type PayrollItem = {
    id: string;
    basic_earnings: number | string;
    tardy: number | string;
    holiday_pay: number | string;
    total_earnings: number | string;
    cash_advance: number | string;
    total_deductions: number | string;
    net_earnings: number | string;
    days_present: number;
    days_absent: number;
    tardy_minutes: number;

    employee: {
        id: string;
        employee_number: string;
        first_name: string;
        middle_name: string | null;
        last_name: string;
        suffix: string | null;
    };
};

type PayrollRun = {
    id: string;
    period_start: string;
    period_end: string;
    pay_date: string;
    items: PayrollItem[];
};

const employeeName = (
    employee: PayrollItem["employee"],
) =>
    [
        employee.first_name,
        employee.middle_name,
        employee.last_name,
    ]
        .filter(Boolean)
        .join(" ") +
    (employee.suffix
        ? `, ${employee.suffix}`
        : "");

const formatDate = (value: string) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleDateString(
        "en-PH",
        {
            month: "short",
            day: "numeric",
            year: "numeric",
        },
    );
};

export function exportPayrollToExcel(
    payrollRun: PayrollRun,
) {
    const headers = [
        "Employee No.",
        "Employee",
        "Days Present",
        "Days Absent",
        "Tardy Minutes",
        "Basic Earnings",
        "Tardy",
        "Holiday Pay",
        "Total Earnings",
        "Cash Advance",
        "Total Deductions",
        "Net Earnings",
    ];

    const rows: unknown[][] = [
        headers,
    ];

    /*
     * Data rows
     *
     * Excel formulas:
     *
     * Total Earnings
     * = Basic Earnings - Tardy + Holiday Pay
     *
     * Total Deductions
     * = Tardy + Cash Advance
     *
     * Net Earnings
     * = Total Earnings - Cash Advance
     */
    payrollRun.items.forEach((item, index) => {
        const row = index + 2;

        rows.push([
            item.employee.employee_number,

            employeeName(item.employee),

            item.days_present,

            item.days_absent,

            item.tardy_minutes,

            Number(item.basic_earnings),

            Number(item.tardy),

            Number(item.holiday_pay),

            {
                t: "n",
                f: `F${row}-G${row}+H${row}`,
            },

            Number(item.cash_advance),

            {
                t: "n",
                f: `G${row}+J${row}`,
            },

            {
                t: "n",
                f: `I${row}-J${row}`,
            },
        ]);
    });

    /*
     * Summary row
     */
    const firstDataRow = 2;
    const lastDataRow =
        payrollRun.items.length + 1;

    const summaryRow =
        lastDataRow + 2;

    rows.push([]);

    rows.push([
        "",
        "TOTAL",
        {
            t: "n",
            f: `SUM(C${firstDataRow}:C${lastDataRow})`,
        },
        {
            t: "n",
            f: `SUM(D${firstDataRow}:D${lastDataRow})`,
        },
        {
            t: "n",
            f: `SUM(E${firstDataRow}:E${lastDataRow})`,
        },
        {
            t: "n",
            f: `SUM(F${firstDataRow}:F${lastDataRow})`,
        },
        {
            t: "n",
            f: `SUM(G${firstDataRow}:G${lastDataRow})`,
        },
        {
            t: "n",
            f: `SUM(H${firstDataRow}:H${lastDataRow})`,
        },
        {
            t: "n",
            f: `SUM(I${firstDataRow}:I${lastDataRow})`,
        },
        {
            t: "n",
            f: `SUM(J${firstDataRow}:J${lastDataRow})`,
        },
        {
            t: "n",
            f: `SUM(K${firstDataRow}:K${lastDataRow})`,
        },
        {
            t: "n",
            f: `SUM(L${firstDataRow}:L${lastDataRow})`,
        },
    ]);

    const worksheet =
        XLSX.utils.aoa_to_sheet(rows);

    /*
     * Title / metadata
     */
    XLSX.utils.sheet_add_aoa(
        worksheet,
        [
            [
                "PAYROLL REGISTER",
            ],
            [
                `Period: ${formatDate(
                    payrollRun.period_start,
                )} - ${formatDate(
                    payrollRun.period_end,
                )}`,
            ],
            [
                `Pay Date: ${formatDate(
                    payrollRun.pay_date,
                )}`,
            ],
            [],
        ],
        {
            origin: "A1",
        },
    );

    /*
     * Move the actual table down.
     *
     * We rebuild the sheet so the header
     * starts at row 6.
     */
    const tableStartRow = 6;

    const tableRows: unknown[][] = [
        headers,
    ];

    payrollRun.items.forEach(
        (item, index) => {
            const row =
                tableStartRow +
                index +
                1;

            tableRows.push([
                item.employee
                    .employee_number,

                employeeName(
                    item.employee,
                ),

                item.days_present,

                item.days_absent,

                item.tardy_minutes,

                Number(
                    item.basic_earnings,
                ),

                Number(item.tardy),

                Number(
                    item.holiday_pay,
                ),

                {
                    t: "n",
                    f: `F${row}-G${row}+H${row}`,
                },

                Number(
                    item.cash_advance,
                ),

                {
                    t: "n",
                    f: `G${row}+J${row}`,
                },

                {
                    t: "n",
                    f: `I${row}-J${row}`,
                },
            ]);
        },
    );

    const actualLastRow =
        tableStartRow +
        payrollRun.items.length;

    const actualSummaryRow =
        actualLastRow + 2;

    tableRows.push([]);

    tableRows.push([
        "",
        "TOTAL",

        {
            t: "n",
            f: `SUM(C${tableStartRow + 1}:C${actualLastRow})`,
        },

        {
            t: "n",
            f: `SUM(D${tableStartRow + 1}:D${actualLastRow})`,
        },

        {
            t: "n",
            f: `SUM(E${tableStartRow + 1}:E${actualLastRow})`,
        },

        {
            t: "n",
            f: `SUM(F${tableStartRow + 1}:F${actualLastRow})`,
        },

        {
            t: "n",
            f: `SUM(G${tableStartRow + 1}:G${actualLastRow})`,
        },

        {
            t: "n",
            f: `SUM(H${tableStartRow + 1}:H${actualLastRow})`,
        },

        {
            t: "n",
            f: `SUM(I${tableStartRow + 1}:I${actualLastRow})`,
        },

        {
            t: "n",
            f: `SUM(J${tableStartRow + 1}:J${actualLastRow})`,
        },

        {
            t: "n",
            f: `SUM(K${tableStartRow + 1}:K${actualLastRow})`,
        },

        {
            t: "n",
            f: `SUM(L${tableStartRow + 1}:L${actualLastRow})`,
        },
    ]);

    const finalWorksheet =
        XLSX.utils.aoa_to_sheet(
            [
                ["PAYROLL REGISTER"],
                [
                    `Period: ${formatDate(
                        payrollRun.period_start,
                    )} - ${formatDate(
                        payrollRun.period_end,
                    )}`,
                ],
                [
                    `Pay Date: ${formatDate(
                        payrollRun.pay_date,
                    )}`,
                ],
                [],
                [],
                ...tableRows,
            ],
        );

    /*
     * Merge title / metadata cells.
     */
    finalWorksheet["!merges"] = [
        {
            s: {
                r: 0,
                c: 0,
            },
            e: {
                r: 0,
                c: 11,
            },
        },
        {
            s: {
                r: 1,
                c: 0,
            },
            e: {
                r: 1,
                c: 11,
            },
        },
        {
            s: {
                r: 2,
                c: 0,
            },
            e: {
                r: 2,
                c: 11,
            },
        },
    ];

    /*
     * Header style
     */
    const headerStyle = {
        fill: {
            fgColor: {
                rgb: "FBBF24",
            },
        },

        font: {
            bold: true,
            color: {
                rgb: "111827",
            },
        },

        alignment: {
            horizontal: "center",
            vertical: "center",
        },

        border: {
            top: {
                style: "thin",
                color: {
                    rgb: "D1D5DB",
                },
            },

            bottom: {
                style: "thin",
                color: {
                    rgb: "D1D5DB",
                },
            },

            left: {
                style: "thin",
                color: {
                    rgb: "D1D5DB",
                },
            },

            right: {
                style: "thin",
                color: {
                    rgb: "D1D5DB",
                },
            },
        },
    };

    /*
     * Title style
     */
    if (finalWorksheet["A1"]) {
        finalWorksheet["A1"].s = {
            font: {
                bold: true,
                sz: 18,
            },

            alignment: {
                horizontal: "center",
                vertical: "center",
            },
        };
    }

    /*
     * Table header = row 6
     */
    headers.forEach(
        (_, column) => {
            const address =
                XLSX.utils.encode_cell({
                    r: tableStartRow - 1,
                    c: column,
                });

            if (
                finalWorksheet[address]
            ) {
                finalWorksheet[address].s =
                    headerStyle;
            }
        },
    );

    /*
     * Currency columns:
     *
     * F = Basic Earnings
     * G = Tardy
     * H = Holiday Pay
     * I = Total Earnings
     * J = Cash Advance
     * K = Total Deductions
     * L = Net Earnings
     */
    const currencyColumns = [
        5,
        6,
        7,
        8,
        9,
        10,
        11,
    ];

    /*
     * Style data rows.
     */
    for (
        let row =
            tableStartRow;
        row <= actualLastRow - 1;
        row++
    ) {
        for (
            let column = 0;
            column < headers.length;
            column++
        ) {
            const address =
                XLSX.utils.encode_cell({
                    r: row,
                    c: column,
                });

            const cell =
                finalWorksheet[address];

            if (!cell) {
                continue;
            }

            cell.border = {
                bottom: {
                    style: "thin",
                    color: {
                        rgb: "E5E7EB",
                    },
                },
            };

            if (
                currencyColumns.includes(
                    column,
                )
            ) {
                cell.z =
                    '₱#,##0.00';

                cell.alignment = {
                    horizontal: "right",
                };
            }

            if (
                column >= 2 &&
                column <= 4
            ) {
                cell.alignment = {
                    horizontal: "right",
                };
            }
        }
    }

    /*
     * Highlight formula columns.
     */
    for (
        let row =
            tableStartRow;
        row <= actualLastRow - 1;
        row++
    ) {
        [8, 10, 11].forEach(
            (column) => {
                const address =
                    XLSX.utils.encode_cell({
                        r: row,
                        c: column,
                    });

                const cell =
                    finalWorksheet[
                        address
                    ];

                if (cell) {
                    cell.font = {
                        bold: true,
                    };
                }
            },
        );
    }

    /*
     * Summary row
     */
    for (
        let column = 0;
        column < headers.length;
        column++
    ) {
        const address =
            XLSX.utils.encode_cell({
                r: actualSummaryRow - 1,
                c: column,
            });

        const cell =
            finalWorksheet[address];

        if (!cell) {
            continue;
        }

        cell.font = {
            bold: true,
        };

        cell.fill = {
            fgColor: {
                rgb: "FEF3C7",
            },
        };

        if (
            currencyColumns.includes(
                column,
            )
        ) {
            cell.z =
                '₱#,##0.00';
        }
    }

    /*
     * Column widths
     */
    finalWorksheet["!cols"] = [
        {
            wch: 16,
        },
        {
            wch: 30,
        },
        {
            wch: 14,
        },
        {
            wch: 13,
        },
        {
            wch: 16,
        },
        {
            wch: 18,
        },
        {
            wch: 14,
        },
        {
            wch: 18,
        },
        {
            wch: 18,
        },
        {
            wch: 18,
        },
        {
            wch: 19,
        },
        {
            wch: 18,
        },
    ];

    finalWorksheet["!rows"] = [
        {
            hpt: 30,
        },
    ];

    const workbook =
        XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        workbook,
        finalWorksheet,
        "Payroll Register",
    );

    XLSX.writeFile(
        workbook,
        `Payroll Register - ${formatDate(
            payrollRun.pay_date,
        )}.xlsx`,
    );
}