import JSZip from "jszip";
import { saveAs } from "file-saver";
import { handleDownloadHTML } from "@/functions/generateHTML"; // Import HTML generator
import { handleDownloadPDF } from "@/functions/generatePDF"; // Import PDF generator

export const handleDownloadSCORM = async (quiz) => {
  const zip = new JSZip();

  // Create the SCORM folder structure
  const scormFolder = zip.folder("scorm");

  // Add the imsmanifest.xml file
  const imsmanifestContent = `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="quiz_${quiz.id}" version="1.0" xmlns="http://www.imsglobal.org/xsd/imscp_v1p1">
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>1.2</schemaversion>
  </metadata>
  <organizations default="quiz_org">
    <organization identifier="quiz_org">
      <title>${quiz.title}</title>
      <item identifier="item_1" identifierref="resource_1">
        <title>Quiz</title>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="resource_1" type="webcontent" href="index.html">
      <file href="index.html" />
      <file href="quiz.pdf" />
      <file href="quiz.html" />
    </resource>
  </resources>
</manifest>`;
  scormFolder.file("imsmanifest.xml", imsmanifestContent);

  // Add the quiz HTML file
  const quizHTMLContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${quiz.title}</title>
</head>
<body>
  <h1>${quiz.title}</h1>
  <p>${quiz.description}</p>
  <!-- Add your quiz content here -->
</body>
</html>`;
  scormFolder.file("index.html", quizHTMLContent);

  // Generate and add the HTML file
  const htmlBlob = await handleDownloadHTML(quiz, true); // Pass `true` to return the blob instead of downloading
  scormFolder.file("quiz.html", htmlBlob);

  // Generate and add the PDF file
  const pdfBlob = await handleDownloadPDF(quiz, true); // Pass `true` to return the blob instead of downloading
  scormFolder.file("quiz.pdf", pdfBlob);

  // Generate the .zip file
  zip.generateAsync({ type: "blob" }).then((content) => {
    saveAs(content, `${quiz.title}_scorm.zip`);
  });
};