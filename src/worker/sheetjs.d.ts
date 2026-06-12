interface SheetJsWorkbook {
  SheetNames: string[];
  Sheets: Record<string, unknown>;
}

interface SheetJsGlobal {
  read(data: ArrayBuffer, options: Record<string, unknown>): SheetJsWorkbook;
  utils: {
    sheet_to_json(
      sheet: unknown,
      options: Record<string, unknown>,
    ): Array<Array<import("./types").CellValue>>;
  };
  SSF: {
    parse_date_code(value: number): { y: number; m: number; d: number } | null;
  };
}

declare const XLSX: SheetJsGlobal;
