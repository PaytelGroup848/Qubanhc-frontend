import html2pdf from 'html2pdf.js';

export const downloadInvoicePdf = async (element, fileName = 'invoice.pdf') => {
  if (!element) {
    throw new Error('Invoice element not found');
  }

  const options = {
    margin: [0, 0, 0, 0],
    filename: fileName,
    image: {
      type: 'jpeg',
      quality: 0.98,
    },
    html2canvas: {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      scrollX: 0,
      scrollY: 0,
      windowWidth: 794,
      windowHeight: 1123,
    },
    jsPDF: {
      unit: 'px',
      format: [794, 1123],
      orientation: 'portrait',
      compress: true,
    },
  };

  return html2pdf().set(options).from(element).save();
};