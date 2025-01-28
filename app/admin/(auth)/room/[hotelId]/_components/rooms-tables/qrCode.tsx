import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { useLanguage } from "@/contexts/LanguageContext";

const QrCode = ({ link, roomName }: { link: string; roomName: string }) => {
  const [qrImage, setQrImage] = useState<string | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    if (!link) return;

    // Generate QR code with custom colors (yellow and purple)
    QRCode.toDataURL(link, {
      width: 300,
      color: {
        dark: "#4b0a53", // Purple for the QR code
      },
    })
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
            <title>${t("qr.printTitle")}</title>
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
                color: #4b0a53; /* Purple text */
              }
            </style>
          </head>
          <body>
            <div class="qr-container">
              <div class="room-name">${t("qr.roomName")}: ${roomName || t("qr.unknownRoom")}</div>
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
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              {t("qr.downloadButton")}
            </button>
            <button
              onClick={printImage}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              {t("qr.printButton")}
            </button>
          </div>
        </>
      ) : (
        <p>{t("qr.generating")}</p>
      )}
    </div>
  );
};

export default QrCode;