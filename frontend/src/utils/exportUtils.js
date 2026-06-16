import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const exportToCSV = (complaints) => {
  if (!complaints || !complaints.length) return;

  const headers = ['Ticket ID', 'Status', 'Priority', 'Location', 'Reported At', 'Resolved At', 'Description'];
  
  const csvRows = [
    headers.join(','),
    ...complaints.map(c => {
      const resolvedAt = c.status === 'Resolved' ? new Date(c.updatedAt).toLocaleString() : 'N/A';
      const createdAt = new Date(c.createdAt).toLocaleString();
      // Escape quotes and commas in strings
      const description = `"${c.description.replace(/"/g, '""')}"`;
      const location = `"${c.location.replace(/"/g, '""')}"`;
      
      return [c.ticketId, c.status, c.priority, location, createdAt, resolvedAt, description].join(',');
    })
  ];

  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Sanitation_Report_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = (complaints) => {
  if (!complaints || !complaints.length) return;

  const doc = new jsPDF('landscape');
  
  // Title
  doc.setFontSize(20);
  doc.setTextColor(40);
  doc.text('City Sanitation Operations Report', 14, 22);
  
  // Subtitle / Date
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
  
  // Summary Stats
  const total = complaints.length;
  const resolved = complaints.filter(c => c.status === 'Resolved').length;
  const highPriority = complaints.filter(c => c.priority === 'High').length;
  
  doc.setFontSize(10);
  doc.text(`Total Tickets: ${total}   |   Resolved: ${resolved}   |   High Priority: ${highPriority}`, 14, 38);

  // Table Data
  const tableColumn = ["ID", "Status", "Priority", "Location", "Created", "Description"];
  const tableRows = [];

  complaints.forEach(c => {
    const ticketData = [
      c.ticketId,
      c.status,
      c.priority,
      c.location.substring(0, 40) + (c.location.length > 40 ? '...' : ''),
      new Date(c.createdAt).toLocaleDateString(),
      c.description.substring(0, 60) + (c.description.length > 60 ? '...' : '')
    ];
    tableRows.push(ticketData);
  });

  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 45,
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [14, 165, 233] }, // brand-500 color
    alternateRowStyles: { fillColor: [248, 250, 252] }, // slate-50
  });

  doc.save(`Sanitation_Report_${new Date().toISOString().split('T')[0]}.pdf`);
};
