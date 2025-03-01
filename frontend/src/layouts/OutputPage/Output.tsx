import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Box, Paper, Stack, Button, Typography } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import { jsPDF } from 'jspdf';
import { QASection } from "./Components/QASection";
import { OutputSection } from "./Components/OutputSection";

export const Output: React.FC = () => {
  const location = useLocation();
  const data = (location.state && location.state.data) || {};

  const qAndA = data?.qa || null;
  const transcript = data?.transcripts || null;
  const notes = data?.notes || null;
  const summary = data?.summary || null;
  
  const learning_objectives = data?.learning_objectives || null;
  
  const action_items = data?.action_items || null;

  // Function to download output as a PDF file
  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      unit: 'pt',
      format: 'letter'
    });
    let currentY = 40; // Initial vertical position

    // Helper function to add a section to the PDF
    const addText = (title: string, content: string, addNewPage: boolean = false) => {
      if (addNewPage) {
        doc.addPage();
        currentY = 40;
      }
      doc.setFontSize(16);
      doc.text(title, 40, currentY);
      currentY += 25;
      doc.setFontSize(12);
      // Split long text into lines that fit the page width:
      const textLines = doc.splitTextToSize(content, 500);
      doc.text(textLines, 40, currentY);
      currentY += textLines.length * 15 + 20;
    };

    if (qAndA) {
      let qaContent = "";
      qAndA.forEach((qaItem: { question: string; answer: string }, index: number) => {
        qaContent += `Q${index + 1}: ${qaItem.question}\nA${index + 1}: ${qaItem.answer}\n\n`;
      });
      addText("Q&A", qaContent);
    }
    if (learning_objectives) {
      addText("Learning Objectives", learning_objectives, true);
    }
    if (transcript) {
      addText("Transcript", transcript, true);
    }
    if (notes) {
      addText("Notes", notes, true);
    }
    if (summary) {
      addText("Summary", summary, true);
    }
    if (action_items) {
      addText("Action Items", action_items, true);
    }
    doc.save("output.pdf");
  };

  // Function to download output as a plain text file
  const handleDownloadTXT = () => {
    let textToSave = "";
    if (qAndA) {
      textToSave += "Q&A\n";
      qAndA.forEach((qaItem: { question: string; answer: string }, index: number) => {
        textToSave += `Q${index + 1}: ${qaItem.question}\nA${index + 1}: ${qaItem.answer}\n\n`;
      });
    }
    if (learning_objectives) {
      textToSave += "\nLearning Objectives\n" + learning_objectives + "\n";
    }
    if (transcript) {
      textToSave += "\nTranscript\n" + transcript + "\n";
    }
    if (notes) {
      textToSave += "\nNotes\n" + notes + "\n";
    }
    if (summary) {
      textToSave += "\nSummary\n" + summary + "\n";
    }
    if (action_items) {
      textToSave += "\nAction Items\n" + action_items + "\n";
    }

    const blob = new Blob([textToSave], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = "output.txt";
    // Append link to trigger the download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Output Data
          </Typography>
          {qAndA && <QASection title="Q&A" qAndA={qAndA} />}
          {learning_objectives && <OutputSection title="Learning Objectives" text={learning_objectives} />}
          {transcript && <OutputSection title="Transcript" text={transcript} />}
          {notes && <OutputSection title="Notes" text={notes} />}
          {summary && <OutputSection title="Summary" text={summary} />}
          {action_items && <OutputSection title="Action Items" text={action_items} />}
        </Paper>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<PictureAsPdfIcon />}
            sx={{ px: 3 }}
            onClick={handleDownloadPDF}
            aria-label="Download output as PDF"
          >
            Download PDF
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            startIcon={<TextSnippetIcon />}
            sx={{ px: 3 }}
            onClick={handleDownloadTXT}
            aria-label="Download output as TXT"
          >
            Download TXT
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};