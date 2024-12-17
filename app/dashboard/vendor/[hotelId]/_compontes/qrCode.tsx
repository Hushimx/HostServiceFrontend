import React, { useEffect, useState } from "react";
import QRCode from "qrcode";

const QrCode = ({ link, roomName }: { link: string; roomName: string }) => {
  const [qrImage, setQrImage] = useState<string | null>(null);

  useEffect(() => {
    if (!link) return;

    QRCode.toDataURL(link, { width: 300 })
      .then((qrCode) => setQrImage(qrCode))
      .catch((error) => console.error("QR Code generation failed:", error));
  }, [link]);

  const downloadImage = () => {
    if (!qrImage) return;

    const sanitizedRoomName = roomName?.replace(/\s+/g, "-") || "qr-code"; // Ensure no undefined error
    const linkElement = document.createElement("a");
    linkElement.href = qrImage; // Use the QR code image as the link's href
    linkElement.download = `${sanitizedRoomName}-qrcode.png`; // Set the desired file name
    linkElement.click(); // Simulate a click to trigger the download
  };

  const printImage = () => {
    if (!qrImage) return;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print QR Code</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                text-align: center;
                margin: 20px;
              }
              .qr-container {
                margin-top: 50px;
              }
              .qr-image {
                margin-top: 20px;
                width: 300px;
                height: 300px;
              }
              .room-name {
                font-size: 24px;
                margin-bottom: 20px;
                font-weight: bold;
              }
            </style>
          </head>
          <body>
            <div class="qr-container">
              <div class="room-name">Room: ${roomName || "Unknown Room"}</div>
              <img src="${qrImage}" alt="QR Code" class="qr-image" />
            </div>
            <script>
              window.onload = function() {
                window.print();
                window.close();
              }
            </script>
          </body>
        </html>
      `);
    }
  };

  return (
    <div className="text-center">
      {qrImage ? (
        <>
          <img src={qrImage} alt="QR Code" className="mx-auto mb-4" />
          <div className="space-x-4">
            <button
              onClick={downloadImage}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Download QR Code
            </button>
            <button
              onClick={printImage}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Print QR Code
            </button>
          </div>
        </>
      ) : (
        <p>Generating QR Code...</p>
      )}
    </div>
  );
};

export default QrCode;
