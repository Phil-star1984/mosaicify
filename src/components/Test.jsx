import React, { useEffect, useState, useRef } from "react";
import { GuardSpinner } from "react-spinners-kit";
import heic2any from "heic2any";
import "../components/HomeStyle.css";
import { Link } from "react-router-dom";

function Home() {
  const [mosaicSize, setMosaicSize] = useState("1200x1200px");
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const downloadLinkRef = useRef(null);

  useEffect(() => {
    if (images.length > 0) {
      setIsLoading(true);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      const [canvasWidth, canvasHeight] = mosaicSize
        .split("x")
        .map((dim) => parseInt(dim, 10));
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // Die Größe für einzelne Kacheln basierend auf der Gesamtanzahl der Bilder berechnen
      const tileWidth = canvasWidth / Math.ceil(Math.sqrt(images.length));
      const tileHeight =
        canvasHeight /
        Math.ceil(images.length / Math.ceil(Math.sqrt(images.length)));

      let loadedImages = 0; // Zähler für geladene Bilder

      images.forEach((file, index) => {
        const img = new Image();
        img.onload = () => {
          // Berechnung, um das Bild proportional zu skalieren und es in der Kachel zu zentrieren
          const scale = Math.max(
            tileWidth / img.width,
            tileHeight / img.height
          );
          const scaledWidth = img.width * scale;
          const scaledHeight = img.height * scale;

          // Startpunkt des Bildausschnitts
          const sx =
            scaledWidth - tileWidth > 0
              ? (img.width - tileWidth / scale) / 2
              : 0;
          const sy =
            scaledHeight - tileHeight > 0
              ? (img.height - tileHeight / scale) / 2
              : 0;

          // Berechnung der x und y Position für die Kachel
          const x = (index % Math.ceil(Math.sqrt(images.length))) * tileWidth;
          const y =
            Math.floor(index / Math.ceil(Math.sqrt(images.length))) *
            tileHeight;

          // Zeichnen des Bildes im Canvas an der berechneten Position
          ctx.drawImage(
            img,
            sx,
            sy,
            tileWidth / scale,
            tileHeight / scale,
            x,
            y,
            tileWidth,
            tileHeight
          );

          loadedImages++;

          if (loadedImages === images.length) {
            setIsLoading(false);
          }
        };

        // Object URL erstellen und bereinigen
        img.src = URL.createObjectURL(file);
        img.addEventListener("load", () => {
          URL.revokeObjectURL(img.src); // Speicher freigeben
        });
      });
    }
  }, [images, mosaicSize]);

  //Logik um aus den ausgewählten Bildern ein Mosaik in der gewünschten Größe zu erstellen
  const downloadMosaic = (e) => {
    e.preventDefault();
    // Überprüfen Sie, ob der Canvas vorhanden ist
    if (canvasRef.current) {
      // Erstellen Sie eine Data URL für das Canvas
      const imageDataURL = canvasRef.current.toDataURL("image/jpeg", 1.0);

      // Verwenden der Ref, um auf das <a>-Element zuzugreifen und den Download zu initiieren
      const downloadLink = downloadLinkRef.current;
      downloadLink.href = imageDataURL;
      downloadLink.download = "mosaic.jpg"; // Der Dateiname für das heruntergeladene Bild

      // Download auslösen
      downloadLink.click();
    }
  };

  const handleUploadClick = () => {
    alert(
      "Für ein optimales Mosaik-Ergebnis, wähle bitte 2,4,6,9,12,16,25 oder 36 Bilder"
    );
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // für Convertierung von z.B. iPhone Bildern
  const convertHEICToJPEG = async (file) => {
    try {
      const convertedBlob = await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality: 1,
      });
      return convertedBlob;
    } catch (e) {
      console.error(e);
      return file; // Rückgabe des ursprünglichen Dateiobjekts bei einem Fehler
    }
  };

  const handleImageChange = async (e) => {
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB in Bytes

    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => file.size <= MAX_SIZE);

    if (validFiles.length !== files.length) {
      alert(
        "Einige Dateien wurden nicht hinzugefügt, da sie größer als 10MB sind."
      );
    }

    const convertedImages = await Promise.all(
      validFiles.map(async (file) => {
        if (file.type === "image/heic") {
          return convertHEICToJPEG(file);
        }
        console.log("File size: ", file.size);
        return file;
      })
    );

    setImages(convertedImages);
  };

  return (
    <main>
      <nav className="mosaicify_navbar">
        <ul>
          <li>
            <Link to="/">
              <h1>Mosaicify</h1>
            </Link>
          </li>
          <li>
            <Link to="/nothing">Link 1</Link>
          </li>
          <li>
            <Link to="/something">Link 2</Link>
          </li>
        </ul>
      </nav>
      <header>
        <h1>Erstelle schnell und kostenlos Mosaike für Social Media</h1>
      </header>

      <div className="weekten_inner_container">
        <form className="weekten_input" type="submit">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
            ref={fileInputRef}
          ></input>

          <button type="button" onClick={handleUploadClick}>
            Upload Images
          </button>
          <br />
          <label>
            <select
              className="choose_size"
              name="mosaicSize"
              id="mosaic_size"
              onChange={(e) => setMosaicSize(e.target.value)}
            >
              <option value="1200x1200px">Choose Mosaic size</option>
              <option value="1200x1200px">Insta Square 1200 x 1200 px</option>
              <option value="1080x1920px">Insta Story 1080 x 1920 px</option>
              <option value="1584x396px">LinkedIn Cover 1584 x 396 px</option>
            </select>
          </label>

          <button type="button" onClick={downloadMosaic}>
            Download Mosaic
          </button>
        </form>
        {isLoading && (
          <div className="weekten_loading_container">
            <GuardSpinner />
          </div>
        )}

        {images.length > 0 && (
          <canvas className="weekten_mosaic_canvas" ref={canvasRef}></canvas>
        )}
      </div>
      <a ref={downloadLinkRef} style={{ display: "none" }}></a>
    </main>
  );
}

export default Home;
