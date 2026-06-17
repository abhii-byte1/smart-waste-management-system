import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportToCSV = (complaints) => {
  if (!complaints || !complaints.length) return;

  const headers = ['Ticket ID', 'Status', 'Priority', 'Location', 'Reported At', 'Resolved At', 'Description'];
  
  const csvRows = [
    headers.join(','),
    ...complaints.map(c => {
      const resolvedAt = c.status === 'Resolved' ? new Date(c.updatedAt).toLocaleString() : 'N/A';
      const createdAt = new Date(c.createdAt).toLocaleString();
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
  
  doc.setFontSize(20);
  doc.setTextColor(40);
  doc.text('City Sanitation Operations Report', 14, 22);
  
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
  
  const total = complaints.length;
  const resolved = complaints.filter(c => c.status === 'Resolved').length;
  const highPriority = complaints.filter(c => c.priority === 'High').length;
  
  doc.setFontSize(10);
  doc.text(`Total Tickets: ${total}   |   Resolved: ${resolved}   |   High Priority: ${highPriority}`, 14, 38);

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

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 45,
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [14, 165, 233] }, // brand-500 color
    alternateRowStyles: { fillColor: [248, 250, 252] }, // slate-50
  });

  doc.save(`Sanitation_Report_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const exportSingleComplaintPDF = (complaint) => {
  if (!complaint) return;

  const doc = new jsPDF();
  
  doc.setFontSize(22);
  doc.setTextColor(40);
  doc.text(`Ticket Report: #${complaint.ticketId}`, 14, 22);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

  // Status & Priority
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text(`Priority: ${complaint.priority}`, 14, 45);
  doc.text(`Status: ${complaint.status}`, 100, 45);
  
  // Reporter & Dates
  doc.text(`Reported By: ${complaint.reportedBy?.email || 'Anonymous'}`, 14, 55);
  doc.text(`Date Filed: ${new Date(complaint.createdAt).toLocaleString()}`, 14, 65);
  
  if (complaint.status === 'Resolved') {
    doc.text(`Date Resolved: ${new Date(complaint.updatedAt).toLocaleString()}`, 14, 75);
  }

  // Location
  doc.setFontSize(14);
  doc.text('Location:', 14, 90);
  doc.setFontSize(12);
  doc.setTextColor(80);
  doc.text(complaint.location, 14, 98, { maxWidth: 180 });

  // Description
  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text('Description:', 14, 115);
  doc.setFontSize(12);
  doc.setTextColor(80);
  doc.text(complaint.description, 14, 123, { maxWidth: 180 });

  // If there's an image, we can't easily embed cross-origin Cloudinary URLs in jsPDF directly 
  // without fetching it as base64 first. So we just output the URL.
  if (complaint.image) {
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text('Attached Image URL:', 14, 160);
    doc.setFontSize(10);
    doc.setTextColor(14, 165, 233); // Brand color link
    doc.textWithLink(complaint.image, 14, 168, { url: complaint.image });
  }

  doc.save(`Ticket_${complaint.ticketId}_Report.pdf`);
};
