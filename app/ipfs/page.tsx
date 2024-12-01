"use client";
import React, { useState } from 'react';
import axios from 'axios';

const UploadImage: React.FC = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [ipfsHash, setHash] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  

  const handleUpload = async () => {
    if (!imageUrl) {
      alert('Please enter an image URL');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error('Failed to fetch the image');

      const blobData = await response.blob();
      const formData = new FormData();

      formData.append('file', blobData);

      const pinataMetadata = JSON.stringify({ name: 'IMAGE' });
      formData.append('pinataMetadata', pinataMetadata);

      const pinataOptions = JSON.stringify({ cidVersion: 0 });
      formData.append('pinataOptions', pinataOptions);

      const res = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        formData,
        {
          maxBodyLength: 'Infinity',
          headers: {
            'Content-Type': `multipart/form-data; boundary=${(formData as any)._boundary}`,
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
          },
        }
      );

      const helloIMG = `https://ipfs.io/ipfs/${res.data.IpfsHash}`;
      setHash(res.data.IpfsHash);
      setUploadedUrl(helloIMG);

      console.log('IPFS Hash:', res.data.IpfsHash);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Upload Image to IPFS</h1>
      <input
        type="text"
        placeholder="Enter image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        style={{
          width: '300px',
          padding: '10px',
          marginBottom: '10px',
        }}
      />
      <button
        onClick={handleUpload}
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: '#0070f3',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        {loading ? 'Uploading...' : 'Upload to IPFS'}
      </button>
      {ipfsHash && (
        <div style={{ marginTop: '20px' }}>
          <h2>Uploaded Image</h2>
          <p>IPFS Hash: {ipfsHash}</p>
          <a href={uploadedUrl!} target="_blank" rel="noopener noreferrer">
            View Image on IPFS
          </a>
        </div>
      )}
    </div>
  );
};

export default UploadImage;
