import { useCallback, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function App() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const isValidFile = useCallback((f) => {
    if (!f) return false;
    const allowed = [
      'audio/mpeg',
      'audio/mp3',
      'video/mp4'
    ];
    return allowed.includes(f.type);
  }, []);

  const handleFileChange = (event) => {
    const selected = event.target.files?.[0];
    if (!selected) return;
    if (!isValidFile(selected)) {
      setError('Only MP3 or MP4 files are allowed.');
      setFile(null);
      return;
    }
    setError("");
    setFile(selected);
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert("Please upload a file first.");
      return;
    }
    setLoading(true);
    setSummary(null);
    setError("");

    const formData = new FormData();
    formData.append("File", file);

    try {
      const response = await axios.post("http://localhost:3000/chat", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSummary(response.data.airesponse);
    } catch (error) {
      console.error("Error uploading file:", error);
      setError(error.response?.data?.error || 'Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (!dropped) return;
    if (!isValidFile(dropped)) {
      setError('Only MP3 or MP4 files are allowed.');
      setFile(null);
      return;
    }
    setError("");
    setFile(dropped);
  }, [isValidFile]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const selectedFileLabel = useMemo(() => {
    if (!file) return 'No file selected';
    const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
    return `${file.name} • ${sizeMb} MB`;
  }, [file]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-10 px-4">
      <div className="mx-auto max-w-3xl">
        <div className="bg-white/80 backdrop-blur shadow-lg rounded-2xl p-8 border border-slate-200">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-800">AI Meeting Summarizer</h1>
            <p className="text-slate-600 mt-2">Upload an MP3 or MP4 meeting recording to generate a structured summary.</p>
          </div>

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`mt-8 rounded-xl border-2 border-dashed p-8 text-center transition ${
              isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-slate-400'
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xl">⬆️</div>
              <p className="text-slate-700 font-medium">Drag and drop your file here</p>
              <p className="text-slate-500 text-sm">MP3 or MP4 up to 50 MB</p>
              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
                  disabled={loading}
                >
                  Choose file
                </button>
                <input
                  ref={inputRef}
                  type="file"
                  accept="audio/mpeg, audio/mp3, video/mp4"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
              <p className="text-slate-600 text-sm mt-2">{selectedFileLabel}</p>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="mt-6 flex justify-center">
            <button
              onClick={handleFileUpload}
              disabled={loading || !file}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent"></span>
                  Summarizing...
                </span>
              ) : (
                'Summarize'
              )}
            </button>
          </div>

          {summary && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-slate-800">Summary</h2>
              <div className="prose prose-slate max-w-none mt-4">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{summary}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
