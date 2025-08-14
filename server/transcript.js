import axios from 'axios';

const ASSEMBLYAI_API_KEY = process.env.ASSEMBLY_KEY;
const assemblyaiAxios = axios.create({
  baseURL: "https://api.assemblyai.com/v2",
  headers: {
    authorization: ASSEMBLYAI_API_KEY,
    "Content-Type": "application/json",
  },
});

export async function getTranscript(file) {
  try {
    
    const uploadResponse = await assemblyaiAxios.post('/upload', file.buffer, {
      headers: {
        "Content-Type": file.mimetype, 
        "Transfer-Encoding": "chunked" 
      }
    });

    const upload_url = uploadResponse.data.upload_url;
    if (!upload_url) {
        throw new Error("File upload failed, no URL returned.");
    }

    const transcriptResponse = await assemblyaiAxios.post('/transcript', {
      audio_url: upload_url,
      speech_model: "universal",
    });

    const transcriptId = transcriptResponse.data.id;
    const pollingEndpoint = `/transcript/${transcriptId}`;

    while (true) {
      const pollingResponse = await assemblyaiAxios.get(pollingEndpoint);
      const transcriptionResult = pollingResponse.data;

      if (transcriptionResult.status === "completed") {
        return transcriptionResult.text;
      } else if (transcriptionResult.status === "error") {
        throw new Error(`Transcription failed: ${transcriptionResult.error}`);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }
  } catch (error) {
    console.error("Error occurred while getting transcript:", error.response ? error.response.data : error.message);
    throw new Error(error.response?.data?.error || "Transcription process failed.");
  }
}