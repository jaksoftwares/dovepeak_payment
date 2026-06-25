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
  purposeOfPayment?: string | null;
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
  
  // Table Rows
  currentY += 8;
  const formattedAmount = `KES ${Number(data.amount).toFixed(2)}`;
  
  if (data.purposeOfPayment && data.purposeOfPayment.trim() !== '') {
    doc.setFontSize(8);
    doc.setTextColor(140, 140, 140);
    doc.setFont('helvetica', 'bold');
    doc.text('Purpose of Payment', 14, currentY);
    
    currentY += 5;
    doc.setTextColor(40, 40, 40);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    // Split long purposes to avoid overflowing into the amount column
    const splitPurpose = doc.splitTextToSize(data.purposeOfPayment, 120);
    doc.text(splitPurpose, 14, currentY);
    
    currentY += (splitPurpose.length * 5) + 4;
  }
  
  doc.setFontSize(8);
  doc.setTextColor(140, 140, 140);
  doc.setFont('helvetica', 'bold');
  doc.text('Payment Method', 14, currentY);
  
  currentY += 5;
  doc.setTextColor(40, 40, 40);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Safaricom M-Pesa', 14, currentY);
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
  
  // --- Footer / Signature Section ---
  const pageHeight = doc.internal.pageSize.height;
  const footerY = pageHeight - 55;
  
  doc.setDrawColor(230, 230, 230);
  doc.setLineWidth(0.5);
  doc.line(14, footerY, 196, footerY);

  // Corporate Stamp (Subtle / Watermark style)
  const stampCenterY = footerY + 20;
  const stampCenterX = 105;
  
  doc.setDrawColor(220, 225, 240); // Faint blue
  doc.setLineWidth(0.5);
  doc.circle(stampCenterX, stampCenterY, 18, 'S'); // Outer circle
  doc.circle(stampCenterX, stampCenterY, 11, 'S'); // Inner circle
  
  doc.setTextColor(200, 210, 235);
  
  // Draw circular text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5.5);
  const companyName = ' DOVEPEAK DIGITAL SOLUTIONS • DOVEPEAK DIGITAL SOLUTIONS •';
  const textRadius = 14.5;
  
  // Calculate raw character widths with visual kerning adjustments
  // Narrow characters like 'I' can look misaligned or cramped on a curve due to their
  // small bounding box. We artificially boost their width to give them optical breathing room.
  let rawTotalWidth = 0;
  const rawCharWidths: number[] = [];
  for (let i = 0; i < companyName.length; i++) {
    const char = companyName[i];
    let width = doc.getTextWidth(char);
    
    // Optical kerning adjustments for narrow letters
    if (char === 'I') width *= 1.8;
    if (char === 'L') width *= 1.3;
    if (char === ' ') width *= 1.5;
    if (char === 'T') width *= 1.2;
    
    rawCharWidths.push(width);
    rawTotalWidth += width;
  }
  
  // To prevent letters from being squished, we distribute the remaining 
  // circumference space EQUALLY among all characters (tracking)
  const circumference = 2 * Math.PI * textRadius;
  const remainingSpace = Math.max(0, circumference - rawTotalWidth);
  const trackingPerChar = remainingSpace / companyName.length;
  
  let currentAngle = -(Math.PI / 2); // Start at top (-90 degrees)
  
  for (let i = 0; i < companyName.length; i++) {
    const char = companyName[i];
    const charWidth = rawCharWidths[i] + trackingPerChar;
    
    // Calculate the angular span of this character (its adjusted width + equal padding)
    const charAngleSpan = (charWidth / circumference) * (2 * Math.PI);
    
    // Place the character at the center of its angular span
    const angleRad = currentAngle + (charAngleSpan / 2);
    
    const x = stampCenterX + textRadius * Math.cos(angleRad);
    const y = stampCenterY + textRadius * Math.sin(angleRad);
    
    // Text rotation: bottom of letters towards center
    const angleDeg = -(angleRad * (180 / Math.PI) + 90);
    
    doc.text(char, x, y, { align: 'center', angle: angleDeg });
    
    // Advance the angle for the next character
    currentAngle += charAngleSpan;
  }

  // Inner text
  doc.setFontSize(8);
  doc.text('OFFICIAL', stampCenterX, stampCenterY - 1, { align: 'center' });
  doc.setFontSize(5);
  doc.text('AUTHORIZED', stampCenterX, stampCenterY + 4, { align: 'center' });

  // Authorized Signature Block (Right aligned)
  const sigX = 145;
  
  // Draw a cursive-like signature using Times-Italic
  doc.setTextColor(25, 50, 110); // Dark blue pen color
  doc.setFont('times', 'italic');
  doc.setFontSize(24);
  doc.text('J. Kirika', sigX + 20, footerY + 18, { align: 'center' });
  
  // Signature line
  doc.setDrawColor(150, 150, 150);
  doc.setLineWidth(0.3);
  doc.line(sigX, footerY + 22, sigX + 40, footerY + 22);
  
  // Signature Labels
  doc.setTextColor(80, 80, 80);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Authorized Signature', sigX + 20, footerY + 28, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text('Dovepeak Digital Solutions', sigX + 20, footerY + 33, { align: 'center' });
  
  // Footer Note
  doc.setTextColor(150, 150, 150);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text('Thank you for your business. For support, contact info@dovepeakdigital.com', 105, pageHeight - 12, { align: 'center' });
  
  // Save PDF
  const filename = `Dovepeak_${data.type}_Receipt_${data.receiptNumber || data.reference}.pdf`;
  doc.save(filename);
};
