import jsPDF from 'jspdf';

interface ReceiptData {
  type: 'Payment' | 'Donation';
  amount: string | number;
  fullName?: string | null;
  phone: string;
  receiptNumber: string;
  reference: string;
  date: string;
  status?: string;
}

const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = url;
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
  });
};

export const downloadReceiptPDF = async (data: ReceiptData) => {
  const doc = new jsPDF();
  
  // Set primary color
  const primaryColor = [28, 28, 30]; // Dark grey/black for corporate look
  const accentColor = data.type === 'Donation' ? [71, 44, 227] : [39, 24, 125]; 
  
  // --- Header ---
  doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.rect(0, 0, 210, 4, 'F'); // Thin corporate accent bar
  
  try {
    const logoImg = await loadImage('/logo.png');
    doc.addImage(logoImg, 'PNG', 14, 12, 18, 18); 
    
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('Dovepeak Digital Solutions', 36, 18);
    
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('off-Thika Road Juja, Kenya', 36, 23);
    doc.text('+254 115 749 711 | info@dovepeakdigital.com', 36, 28);
  } catch (error) {
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('Dovepeak Digital Solutions', 14, 18);
    
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('off-Thika Road Juja, Kenya', 14, 23);
    doc.text('+254 115 749 711 | info@dovepeakdigital.com', 14, 28);
  }
  
  // Receipt Title
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.text('RECEIPT', 196, 22, { align: 'right' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(`No: ${data.receiptNumber || data.reference}`, 196, 28, { align: 'right' });

  // Divider
  doc.setDrawColor(230, 230, 230);
  doc.line(14, 38, 196, 38);
  
  // --- Body ---
  
  // Billed To
  let currentY = 50;
  doc.setFontSize(9);
  doc.setTextColor(140, 140, 140);
  doc.text('BILLED TO', 14, currentY);
  
  doc.setTextColor(40, 40, 40);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  currentY += 6;
  
  if (data.fullName && data.fullName !== 'N/A' && data.fullName.trim() !== '') {
    doc.text(data.fullName.toUpperCase(), 14, currentY);
    currentY += 5;
  }
  
  doc.setFont('helvetica', 'normal');
  doc.text(data.phone, 14, currentY);
  
  // Transaction Metadata
  doc.setFontSize(9);
  doc.setTextColor(140, 140, 140);
  doc.text('TRANSACTION DATE', 120, 50);
  doc.setTextColor(40, 40, 40);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(data.date, 120, 56);
  
  doc.setFontSize(9);
  doc.setTextColor(140, 140, 140);
  doc.text('REFERENCE', 120, 66);
  doc.setTextColor(40, 40, 40);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(data.reference, 120, 72);

  // Status Badge
  const statusText = (data.status || 'COMPLETED').toUpperCase();
  const isCompleted = statusText === 'COMPLETED' || statusText === 'PAID';
  doc.setFillColor(isCompleted ? 230 : 253, isCompleted ? 245 : 237, isCompleted ? 236 : 237); // Light green or light red
  doc.rect(196 - 28, 45, 28, 6, 'F');
  doc.setTextColor(isCompleted ? 15 : 210, isCompleted ? 157 : 40, isCompleted ? 88 : 40);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(statusText, 196 - 14, 49.2, { align: 'center' });
  
  // Table Header
  currentY = 95;
  doc.setDrawColor(230, 230, 230);
  doc.line(14, currentY, 196, currentY);
  currentY += 6;
  
  doc.setFontSize(8);
  doc.setTextColor(140, 140, 140);
  doc.setFont('helvetica', 'bold');
  doc.text('DESCRIPTION', 14, currentY);
  doc.text('AMOUNT', 196, currentY, { align: 'right' });
  
  currentY += 3;
  doc.line(14, currentY, 196, currentY);
  
  // Table Row
  currentY += 7;
  doc.setTextColor(40, 40, 40);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`${data.type} - Safaricom M-Pesa`, 14, currentY);
  
  const formattedAmount = `KES ${Number(data.amount).toFixed(2)}`;
  doc.text(formattedAmount, 196, currentY, { align: 'right' });
  
  // Table Footer / Summary
  currentY += 6;
  doc.setDrawColor(230, 230, 230);
  doc.line(14, currentY, 196, currentY);
  
  currentY += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Total', 120, currentY);
  doc.text(formattedAmount, 196, currentY, { align: 'right' });
  
  // --- Digital Certification Section ---
  const pageHeight = doc.internal.pageSize.height;
  const certY = pageHeight - 65;
  
  doc.setDrawColor(230, 230, 230);
  doc.setLineWidth(0.5);
  doc.line(14, certY, 196, certY);
  
  // Digital Stamp Graphic
  doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.setLineWidth(0.5);
  doc.roundedRect(14, certY + 8, 38, 14, 1.5, 1.5);
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('SECURE', 33, certY + 13.5, { align: 'center' });
  doc.text('ELECTRONIC RECORD', 33, certY + 17.5, { align: 'center' });
  
  // Certification Details
  doc.setTextColor(80, 80, 80);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Digital Certification', 60, certY + 11.5);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
  doc.text(`Authorized Electronic Receipt - Dovepeak Digital Solutions`, 60, certY + 16.5);
  doc.text(`Timestamp: ${timestamp}`, 60, certY + 21);
  doc.text(`Verification Ref: ${data.receiptNumber || data.reference}`, 60, certY + 25.5);
  
  // Footer
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(7);
  doc.text('This document serves as an official financial record. For support inquiries, contact info@dovepeakdigital.com', 105, pageHeight - 12, { align: 'center' });
  
  // Save PDF
  const filename = `Dovepeak_${data.type}_Receipt_${data.receiptNumber || data.reference}.pdf`;
  doc.save(filename);
};
