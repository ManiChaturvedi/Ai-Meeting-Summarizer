import 'dotenv/config';
import express from 'express'
import multer from'multer'
import {getTranscript} from './transcript.js'
import {getAIResponse} from './summarize.js'
import cors from 'cors'
import PDFDocument from 'pdfkit';


const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(), 
  limits: {
    fileSize: 50 * 1024 * 1024, 
  },

  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['video/mp4', 'audio/mpeg', 'audio/mp3'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only MP4 and MP3 files are allowed'), false);
    }
  },
});
app.post('/download-pdf', async (req, res) => {
  try {
    const { airesponse } = req.body;

    if (!airesponse) {
      return res.status(400).json({ error: 'AI response text is required' });
    }

    const doc = new PDFDocument();
    const chunks = [];

    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(chunks);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="summary.pdf"');
      res.send(pdfBuffer);
    });

    doc.fontSize(18).text('AI Meeting Summary', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(airesponse, { align: 'left' });
    doc.end();
  } catch (err) {
    console.error('Error generating PDF:', err);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});
app.post('/chat',upload.single('File'),async (req,res)=>{
    try{
        const file=req.file;
        if(!file){
            res.status(400).json({error: 'No file uploaded or file type not supported'});
            return;
        }
        const transcript = await getTranscript(file);
        if(!transcript) {
            res.status(500).json({error: 'Failed to generate transcript'});
            return;
        }
        const airesponse=await getAIResponse(transcript);

        res.status(200).json({
            airesponse: airesponse
        });
    } catch (error) {
        console.error("Error in /chat endpoint:", error);
        res.status(500).json({error: 'An error occurred while processing the file'});
    }
});

app.listen(port,'0.0.0.0', () => {
  console.log(`Server is running at http://localhost:${port}`)
})
