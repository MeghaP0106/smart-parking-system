import jsPDF from 'jspdf';

export const generatePDF = (reservation) => {
  const doc = new jsPDF();
  
  // Set colors
  const darkBg = [10, 10, 10];
  const silver = [168, 168, 168];
  const silverLight = [192, 192, 192];

  // Add background
  doc.setFillColor(...darkBg);
  doc.rect(0, 0, 210, 297, 'F');

  // Add border
  doc.setDrawColor(...silver);
  doc.setLineWidth(0.5);
  doc.rect(10, 10, 190, 277);

  // Title
  doc.setTextColor(...silverLight);
  doc.setFontSize(24);
  doc.setFont(undefined, 'bold');
  doc.text('SMARTPARK', 105, 30, { align: 'center' });
  
  doc.setFontSize(18);
  doc.text('Parking Reservation Ticket', 105, 42, { align: 'center' });

  // Draw line
  doc.setDrawColor(...silver);
  doc.line(20, 50, 190, 50);

  // Reservation ID
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(...silver);
  doc.text('Reservation ID:', 20, 65);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(...silverLight);
  doc.text(reservation.reservationId, 70, 65);

  // Status badge
  doc.setFillColor(34, 197, 94);
  doc.roundedRect(150, 60, 40, 8, 2, 2, 'F');
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.text('CONFIRMED', 170, 66, { align: 'center' });

  // Details section
  let yPos = 85;
  const lineHeight = 12;

  const addDetail = (label, value) => {
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...silver);
    doc.text(label, 20, yPos);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(...silverLight);
    doc.text(String(value), 70, yPos);
    yPos += lineHeight;
  };

  // Location details
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(...silverLight);
  doc.text('Parking Details', 20, yPos);
  yPos += 10;

  addDetail('Location:', reservation.location.name);
  addDetail('Address:', reservation.location.address);
  addDetail('Slot Number:', reservation.slot.slotNumber);
  addDetail('Floor:', `Floor ${reservation.slot.floor}`);

  // Time details
  yPos += 5;
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(...silverLight);
  doc.text('Time Details', 20, yPos);
  yPos += 10;

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  addDetail('Start Time:', formatDate(reservation.startTime));
  addDetail('End Time:', formatDate(reservation.endTime));
  addDetail('Duration:', `${reservation.duration} hours`);

  // User details
  yPos += 5;
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(...silverLight);
  doc.text('User Details', 20, yPos);
  yPos += 10;

  addDetail('Name:', reservation.user.name);
  addDetail('Phone:', reservation.user.phone);
  addDetail('License Plate:', reservation.user.licensePlate);

  // Payment section
  yPos += 5;
  doc.setDrawColor(...silver);
  doc.line(20, yPos, 190, yPos);
  yPos += 10;

  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(...silverLight);
  doc.text('Payment Summary', 20, yPos);
  yPos += 10;

  doc.setFontSize(10);
  addDetail('Rate per Hour:', `₹${reservation.slot.pricePerHour}`);
  
  yPos += 5;
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(...silver);
  doc.text('Total Amount:', 20, yPos);
  doc.setTextColor(...silverLight);
  doc.setFontSize(18);
  doc.text(`₹${reservation.totalPrice}`, 70, yPos);

  // QR Code placeholder (you can integrate a QR library if needed)
  yPos += 15;
  doc.setDrawColor(...silver);
  doc.setLineWidth(0.5);
  doc.rect(75, yPos, 60, 60);
  doc.setFontSize(10);
  doc.setTextColor(...silver);
  doc.text('QR Code', 105, yPos + 32, { align: 'center' });

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(...silver);
  doc.text('Please show this ticket at the parking entrance', 105, 270, { align: 'center' });
  doc.text('For support, contact: support@smartpark.com', 105, 276, { align: 'center' });
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 282, { align: 'center' });

  // Save the PDF
  doc.save(`parking-ticket-${reservation.reservationId}.pdf`);
};