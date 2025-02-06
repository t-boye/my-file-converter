import React, { useState, useEffect } from 'react';
import '../styles.css';
import axios from 'axios'; 

function FileConverter() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [outputFormat, setOutputFormat] = useState('mp4');
  const [isConverting, setIsConverting] = useState(false);
  const [conversionError, setConversionError] = useState(null);
  const [conversionProgress, setConversionProgress] = useState(0); 

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setConversionError(null); 
  };

  const handleFormatChange = (event) => {
    setOutputFormat(event.target.value);
  };

  const handleConvert = async () => {
    if (!selectedFile) {
      setConversionError('Please select a file to convert.');
      return;
    }

    setIsConverting(true);
    setConversionError(null);
    setConversionProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile); 

      const apiKey = 'YOUR_API_KEY'; // Replace with your actual API key

      const response = await axios.post('https://api.cloudconvert.com/v2/jobs', formData, {
        headers: {
          'Authorization': `Bearer ${apiKey}` 
        }
      });

      const taskId = response.data.id; 

      const getTaskStatus = async () => {
        try {
          const taskResponse = await axios.get(`https://api.cloudconvert.com/v2/jobs/${taskId}`, {
            headers: {
              'Authorization': `Bearer ${apiKey}` 
            }
          });

          const task = taskResponse.data;

          if (task.status === 'finished') {
            setIsConverting(false); 

            const downloadUrl = task.result.files[0].url; 
            const downloadLink = document.createElement('a');
            downloadLink.href = downloadUrl; 
            downloadLink.download = `${selectedFile.name}.${outputFormat}`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink); 
          } else if (task.status === 'error') {
            setIsConverting(false);
            setConversionError('Conversion failed: ' + task.error);
          } else {
            if (task.progress) {
              setConversionProgress(Math.round(task.progress * 100));
            }
            setTimeout(getTaskStatus, 1000); // Check status every second
          }
        } catch (error) {
          console.error('Error fetching task status:', error);
          setIsConverting(false);
          setConversionError('An error occurred during conversion. Please try again.');
        }
      };

      getTaskStatus(); 

    } catch (error) {
      console.error('Error creating conversion task:', error);
      setIsConverting(false);
      setConversionError('An error occurred during conversion. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">File Converter</h1>
      <input 
        type="file" 
        onChange={handleFileChange} 
        disabled={isConverting} 
        className="border p-2" 
      /> 
      <br />
      <select 
        value={outputFormat} 
        onChange={handleFormatChange} 
        disabled={isConverting} 
        className="border p-2" 
      >
        <option value="mp4">MP4</option>
        <option value="mp3">MP3</option>
        <option value="mov">MOV</option> 
      </select>
      <br />
      <button 
        onClick={handleConvert} 
        disabled={isConverting} 
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
      >
        {isConverting ? `Converting... (${conversionProgress}%)` : 'Convert'} 
      </button>
      {conversionError && <p className="text-red-500">{conversionError}</p>}
    </div>
  );
}

export default FileConverter;