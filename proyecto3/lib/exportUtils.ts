// lib/exportUtils.ts
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export function exportToPDF(headers: string[], rows: any[], title: string) {
  const doc = new jsPDF();
  doc.text(title, 14, 15);
  autoTable(doc, {
    head: [headers],
    body: rows.map(row => headers.map(h => row[h])),
    startY: 20,
  });
  doc.save(`${title}.pdf`);
}

export function exportToExcel(headers: string[], rows: any[], title: string) {
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte');
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(blob, `${title}.xlsx`);
}