import jsPDF from "jspdf";

// Function to generate and download PDF
export const handleDownloadPDF = (quiz) => {
    const doc = new jsPDF();
  
    // Set up styles
    const titleFontSize = 18;
    const headerFontSize = 12;
    const questionFontSize = 14;
    const answerFontSize = 12;
    const lineHeight = 7;
    const margin = 15; // Increased margin for padding
    const columnWidth = 85; // Width of each column
    const checkboxSize = 5; // Size of the checkbox
    const pageWidth = doc.internal.pageSize.getWidth(); // Get page width
  
    // Add header
    doc.setFontSize(titleFontSize);
    doc.text("Quiz Sheet", margin, margin);
    doc.setFontSize(headerFontSize);
  
    // Add student name and date
    doc.text(`Student Name: ________________________`, margin, margin + 10);
    doc.text(`Date: ________________________`, margin, margin + 20);
  
    // Add quiz title with wrapping
    const quizTitle = `Quiz Title: ${quiz.title}`;
    const splitTitle = doc.splitTextToSize(quizTitle, pageWidth - 2 * margin); // Wrap text
    doc.text(splitTitle, margin, margin + 30);
  
    // Add time limit
    doc.text(`Time Limit: ${quiz.timeLimit} minutes`, margin, margin + 30 + splitTitle.length * lineHeight);
  
    // Add a horizontal divider line after the header
    const headerEndY = margin + 40 + splitTitle.length * lineHeight;
    doc.setLineWidth(0.5);
    doc.line(margin, headerEndY, pageWidth - margin, headerEndY);
  
    // Initialize variables for layout
    let yOffset = headerEndY + 25; // Increased top margin for questions (from 15 to 25)
    let column = 0; // 0 for left column, 1 for right column
    let xOffset = margin + column * (columnWidth + margin);
  
    // Add a vertical divider between columns
    const verticalDividerX = margin + columnWidth + margin / 2;
    doc.setLineWidth(0.2);
    doc.line(verticalDividerX, yOffset, verticalDividerX, 280); // Vertical line from top to bottom
  
    // Add questions and answers in two columns
    quiz.questions.forEach((question, index) => {
      // Check if we need to move to the next column
      if (yOffset > 250) { // If the current column is full, move to the next column
        column++;
        yOffset = headerEndY + 25; // Reset yOffset for the new column (increased top margin)
        xOffset = margin + column * (columnWidth + margin);
  
        // If both columns are full, add a new page
        if (column > 1) {
          doc.addPage();
          column = 0;
          yOffset = margin;
          xOffset = margin + column * (columnWidth + margin);
  
          // Add a horizontal divider line at the top of the new page
          doc.setLineWidth(0.5);
          doc.line(margin, yOffset - 5, pageWidth - margin, yOffset - 5);
  
          // Add a vertical divider between columns on the new page
          doc.setLineWidth(0.2);
          doc.line(verticalDividerX, yOffset, verticalDividerX, 280); // Vertical line from top to bottom
        }
      }
  
      // Add question text with wrapping
      doc.setFontSize(questionFontSize);
      const questionText = `${index + 1}. ${question.text}`;
      const splitQuestion = doc.splitTextToSize(questionText, columnWidth); // Wrap text
      doc.text(splitQuestion, xOffset, yOffset);
      yOffset += splitQuestion.length * lineHeight;
  
      // Add answers with checkboxes
      question.answers.forEach((answer, ansIndex) => {
        doc.setFontSize(answerFontSize);
        const answerText = `${String.fromCharCode(65 + ansIndex)}. ${answer.text}`;
        const splitAnswer = doc.splitTextToSize(answerText, columnWidth - 10); // Wrap text
        doc.text(splitAnswer, xOffset + 10, yOffset); // Add answer text
        doc.rect(xOffset, yOffset - 4, checkboxSize, checkboxSize); // Add checkbox
        yOffset += splitAnswer.length * lineHeight + 2; // Add spacing between answers
      });
  
      yOffset += 10; // Add spacing between questions (increased spacing)
    });
  
    // Save the PDF
    doc.save(`${quiz.title.replace(/ /g, "_")}_quiz_sheet.pdf`);
  };