import React, { ChangeEventHandler, FormEventHandler, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  CircularProgress,
  Box,
} from "@mui/material";
import { OutputSelectorChips } from "./OutputSelectorChips";

export const UploadForm: React.FC = () => {
  const navigate = useNavigate();
  const [selectedOutputs, setSelectedOutputs] = useState<string[]>([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [isTextApiPending, setIsTextApiPending] = useState(false);
  const [isExtractApiPending, setIsExtractApiPending] = useState(false);

  const outputOptions = [
    { value: "qa", label: "Q & A" },
    { value: "transcripts", label: "Transcripts" },    
    { value: "learning_objectives", label: "Learning Obj" },
    { value: "notes", label: "Notes" },
    { value: "summary", label: "Summary" },
    { value: "action_items", label: "Action Items" },
  ];

  // Validate that at least one output type is selected.
  useEffect(() => {
    if (selectedOutputs.length === 0) {
      setError("Please select at least one output type.");
    } else {
      setError("");
    }
  }, [selectedOutputs]);

  const postText: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (selectedOutputs.length === 0) {
      setError("Please select at least one output type.");
      return;
    }

    if (!text.trim()) {
      alert("Please provide text to process.");
      return;
    }

    try {
      setIsTextApiPending(true);
      const response = await fetch("http://127.0.0.1:5000/api/process-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: text, data_types: selectedOutputs }),
      });

      if (!response.ok) throw new Error("Failed to post data");

      const data = await response.json();
      console.log("Data submitted successfully:", data);

      navigate("/output", { state: { data } });
    } catch (error) {
      console.error("Error posting data:", error);
    } finally {
      setIsTextApiPending(false);
    }
  };

  const handleUpload: ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      setIsExtractApiPending(true);
      fetch("http://127.0.0.1:5000/api/extract-text", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          setText(data.text);
        })
        .catch((error) => {
          console.error("Error:", error);
        })
        .finally(() => {
          setIsExtractApiPending(false);
        });
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <form onSubmit={postText}>
        <Card sx={{ bgcolor: "background.paper", border: 1, borderColor: "divider" }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Select the content you want to generate
            </Typography>
            <OutputSelectorChips
              options={outputOptions}
              selected={selectedOutputs}
              onChange={setSelectedOutputs}
            />
            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Select a media file
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Supported types: pdf, .mp3, and .mp4, maximum 1GB
              </Typography>
              <Button
                variant="outlined"
                component="label"
                sx={{ mt: 1, mb: 2 }}
                disabled={isExtractApiPending}
              >
                {isExtractApiPending ? <CircularProgress size={20} /> : "Upload File"}
                <input
                  hidden
                  type="file"
                  onChange={handleUpload}
                  aria-label="Upload your media file"
                />
              </Button>
              <TextField
                label="Or paste your text here"
                multiline
                rows={5}
                variant="outlined"
                fullWidth
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </Box>
            <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={isTextApiPending}
                startIcon={isTextApiPending ? <CircularProgress size={20} /> : null}
              >
                {isTextApiPending ? "Processing..." : "Generate a response"}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </form>
    </Box>
  );
};
