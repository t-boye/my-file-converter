import React, { useState } from 'react';
import '../styles.css';
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">File Converter</h1>
      <input
        type="file"
        onChange={handleFileChange}
        disabled={isConverting}
        className="block w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
      />
      <br />
      <select
        value={outputFormat}
        onChange={handleFormatChange}
        disabled={isConverting}
        className="block w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
      >
        <option value="mp4">MP4</option>
        <option value="mp3">MP3</option>
        {/* Add more options for supported formats */}
      </select>
      <br />
      <button
        onClick={handleConvert}
        disabled={isConverting}
        className="inline-flex items-center px-4 py-2 rounded-md bg-blue-500 text-white font-bold disabled:opacity-50 hover:bg-blue-700"
      >
        {isConverting ? 'Converting...' : 'Convert'}
      </button>
      {conversionError && <p className="text-red-500">{conversionError}</p>}
    </div>
  );
}

export default FileConverter;