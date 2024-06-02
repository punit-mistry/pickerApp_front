import React, { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import dayjs from 'dayjs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Location {
  latitude: number;
  longitude: number;
}

const CameraComponent: React.FC = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [loadingLocation, setLoadingLocation] = useState<boolean>(true);
  const [loadingConfirm, setLoadingConfirm] = useState<boolean>(false);
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate token and set expiration
  const generateToken = () => {
    setTimeout(() => {
      window.close();
    }, 120000); // 2 minutes
  };

  // Fetch user location with a Promise
  const fetchLocation = (): Promise<Location | null> => {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const loc = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            setLocation(loc);
            resolve(loc);
          },
          (error) => {
            console.error('Error fetching location:', error);
            resolve(null); // Resolve with null to handle gracefully
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );
      } else {
        alert('Geolocation is not supported by this browser.');
        resolve(null); // Resolve with null to handle gracefully
      }
    });
  };

  // Capture the photo with overlayed location, date, and time
  const capturePhoto = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    const img = new Image();
    img.onload = () => {
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
      const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss') + ' ✅';
      const locationText = location
        ? `Lat: ${location.latitude}, Lon: ${location.longitude}`
        : 'Location: not available';

      context.font = '16px Arial';
      context.fillStyle = 'white';
      context.fillText(timestamp, 10, canvas.height - 30);
      context.fillText(locationText, 10, canvas.height - 10);

      const finalImage = canvas.toDataURL('image/jpeg');
      setCapturedImage(finalImage);
    };

    img.src = imageSrc;
  };

  const handleReject = () => {
    setCapturedImage(null);
  };

  const handleConfirm = async () => {
    if (capturedImage) {
      setLoadingConfirm(true);
      const fileName = `image_${dayjs().format('YYYYMMDD_HHmmss')}.jpg`;
      const base64Image = capturedImage.split(',')[1]; // Remove the data URL part

      try {
        const response = await fetch('http://localhost:3000/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: base64Image,
            fileName,
          }),
        });

        if (response.ok) {
          toast.success('Image uploaded successfully');
        } else {
          toast.error('Error uploading image');
        }
      } catch (error:any) {
        toast.error('Error uploading image:', error.message);
      } finally {
        setLoadingConfirm(false);
      }
    }
  };

  useEffect(() => {
    generateToken();
    fetchLocation().then(() => {
      setLoadingLocation(false);
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="rounded-lg shadow-2xl p-6 max-w-lg w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Camera and Location Capture</h1>
        <div className="mb-4">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-full rounded-md"
          />
          <canvas ref={canvasRef} className="hidden" width={640} height={480}></canvas>
          <button
            onClick={capturePhoto}
            className="mt-2 w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition duration-300"
          >
            Capture Photo
          </button>
        </div>
        {loadingLocation && (
          <div className="text-gray-300 mb-4">Fetching location...</div>
        )}
        {capturedImage && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold">Captured Image</h2>
            <img src={capturedImage} alt="Captured" className="mt-2 rounded-md" />
            <div className="flex mt-4 space-x-4">
              <button
                onClick={handleReject}
                className="w-full bg-gray-700 text-white py-2 rounded-md hover:bg-gray-800 transition duration-300"
              >
                Reject
              </button>
              <button
                onClick={handleConfirm}
                className={`w-full bg-red-700 text-white py-2 rounded-md transition duration-300 ${loadingConfirm ? 'cursor-not-allowed opacity-50' : 'hover:bg-red-600'}`}
                disabled={loadingConfirm}
              >
                {loadingConfirm ? 'Loading...' : 'Confirm'}
              </button>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default CameraComponent;
