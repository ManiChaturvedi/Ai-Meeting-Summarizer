# AI Meeting Summarizer

AI Meeting Summarizer is a web application that leverages advanced machine learning services to convert meeting recordings into a clear, structured summary. It uses AssemblyAI for transcription and Google's Gemini API for generating concise summaries in GitHub-Flavored Markdown.

## Features

- **Automated Transcription**  
  Uses AssemblyAI to convert audio/video recordings into text.

- **Intelligent Summarization**  
  Integrates with a generative AI model to produce structured summaries in a consistent format.
  
- **PDF Download**  
  Generate a downloadable PDF version of your summary with a single click.
  
- **User-Friendly Interface**  
  Built with React and styled with Tailwind CSS for a modern, responsive design.

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/Ai-Meeting-Summarizer.git
   cd Ai-Meeting-Summarizer
   ```

2. **Backend Setup**

   - Navigate to the `server` directory:
     
     ```bash
     cd server
     ```
     
   - Install the dependencies:

     ```bash
     npm install
     ```
     
   - Create a `.env` file with the following environment variables:

     ```env
     PORT=3000
     ASSEMBLY_KEY=your_assemblyai_api_key
     GEMINI_KEY=your_gemini_api_key
     ```
     
   - Start the server:

     ```bash
     npm start
     ```

3. **Frontend Setup**

   - Navigate to the `client` directory:

     ```bash
     cd ../client
     ```
     
   - Install the dependencies:

     ```bash
     npm install
     ```
     
   - Start the development server:

     ```bash
     npm run dev
     ```

## Usage

1. Open the web application in your browser.
2. Drag and drop your MP3 or MP4 meeting recording or click "Choose file" to upload.
3. Click the **Summarize** button to generate a structured summary.
4. Once complete, review the summary displayed on the page.
5. Optionally, download the summary as a PDF.

## Insights & Future Enhancements

- **Improved Accuracy:**  
  Future versions can integrate additional Natural Language Processing (NLP) models to further enhance transcription accuracy and the quality of summaries.
  
- **Customization Options:**  
  Allow users to customize the summary output, including options for different summary lengths, styles, or additional detail levels.
  
- **Collaboration Features:**  
  Implement features allowing teams to share and annotate summaries, supporting team collaboration on meeting outcomes.
  
- **Accessibility:**  
  Enhance accessibility features ensuring the platform is usable by people with a varying range of abilities.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to help improve the project.

## License

This project is licensed under the MIT License.

## Acknowledgments

- [AssemblyAI](https://www.assemblyai.com) for their robust transcription API.
- [Google Gemini](https://developers.generativelanguage.googleapis.com) for the advanced AI summarization model.
- The vibrant open-source community for tools and resources that made this project possible.