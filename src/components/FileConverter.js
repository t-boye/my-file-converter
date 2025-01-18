import React, { useState } from 'react';
import '../App.css'; // Import your CSS file for styling (optional)

function FileConverter() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [outputFormat, setOutputFormat] = useState('mp4');
  const [isConverting, setIsConverting] = useState(false); // Track conversion state
  const [conversionError, setConversionError] = useState(null); // Store any conversion errors

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setConversionError(null); // Reset error message on file selection
  };

  const handleFormatChange = (event) => {
    setOutputFormat(event.target.value);
  };

  const handleConvert = async () => {
    if (!selectedFile) {
      setConversionError('Please select a file to convert.');
      return;
    }

    setIsConverting(true); // Indicate conversion in progress

    try {
      const reader = new FileReader();

      reader.onload = (e) => {
        const arrayBuffer = e.target.result;
        const blob = new Blob([arrayBuffer], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `${selectedFile.name}.${outputFormat}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
        setIsConverting(false); // Conversion complete
        setConversionError(null); // Clear error message
      };

      reader.readAsArrayBuffer(selectedFile);
    } catch (error) {
      console.error('Error during conversion:', error);
      setConversionError('An error occurred during conversion. Please try again.');
      setIsConverting(false); // Reset conversion state
    }
  };

  return (
    <div className="App">
      <h1>File Converter</h1>
      <input type="file" onChange={handleFileChange} disabled={isConverting} />
      <br />
      <select value={outputFormat} onChange={handleFormatChange} disabled={isConverting}>
        <option value="mp4">MP4</option>
        <option value="mp3">MP3</option>
        {/* Add more options for supported formats */}
      </select>
      <br />
      <button onClick={handleConvert} disabled={isConverting}>
        {isConverting ? 'Converting...' : 'Convert'}
      </button>
      {conversionError && <p className="error-message">{conversionError}</p>}
    </div>
  );
}

export default FileConverter;