import { useState } from "react";

export default function Page() {
  const [image_info, setImage_info] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bannedAttributes, setBannedAttributes] = useState([]);

  async function blastoff() {
    const response = await fetch(
      `https://images-api.nasa.gov/search?media_type=image`
    );
    const data = await response.json();
    const images = data.collection.items;

    if (images.length === 0) {
      console.log("No images found!");
      return;
    }

    const validImages = images.filter((image) => {
      const title = image.data[0].title;
      const description = image.data[0].description;

      return !bannedAttributes.some(
        (attribute) =>
          title.includes(attribute) || description.includes(attribute)
      );
    });

    if (validImages.length > 0) {
      const randomIndex = Math.floor(Math.random() * validImages.length);
      const randomImage = validImages[randomIndex];
      setImage_info((prev) => [...prev, randomImage]);
      setCurrentIndex(image_info.length);
    } else {
      console.log("No valid images found based on the ban list");
    }
  }

  const goBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goForward = () => {
    if (currentIndex < image_info.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const toggleBan = (attribute) => {
    if (bannedAttributes.includes(attribute)) {
      setBannedAttributes(
        bannedAttributes.filter((item) => item !== attribute)
      );
    } else {
      setBannedAttributes((prev) => [...prev, attribute]);
    }
  };

  const currentImage = image_info[currentIndex];
  const title = currentImage?.data[0].title;
  const description = currentImage?.data[0].description;

  return (
    <div className="page">
      <h1>Discover More About Our Universe!!</h1>
      <div className="info-section">
        <div className="box">
          {image_info.length > 0 ? (
            <div>
              <h2>{title}</h2>
              <img
                src={currentImage?.links[0].href}
                alt={title}
                style={{ width: "100%", borderRadius: "10px" }}
              />
            </div>
          ) : (
            <p>Click 🚀 to get a space image!</p>
          )}
        </div>
        <p>{description}</p>

        <div className="bottom-buttons">
          <button onClick={goBack}>⬅️</button>
          <button onClick={blastoff}>🚀🌌</button>
          <button onClick={goForward}>➡️</button>
        </div>

        <div className="banned-section">
          <h2>Banned List</h2>
          <ul>
            {bannedAttributes.map((attribute, index) => (
              <li key={index} onClick={() => toggleBan(attribute)}>
                {attribute} (Click to remove)
              </li>
            ))}
          </ul>
        </div>

        <div className="attribute-list">
          {title && (
            <p onClick={() => toggleBan(title)}>
              Title: {title} (Click to ban)
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
