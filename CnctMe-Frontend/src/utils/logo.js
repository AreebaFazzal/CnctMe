const getLogoSrc = (logo, contentType = null) => {
  if (!logo) return null;

  // Already a URL / Data URL
  if (typeof logo === "string") {
    if (
      logo.startsWith("http://") ||
      logo.startsWith("https://") ||
      logo.startsWith("data:")
    ) {
      return logo;
    }

    return `data:${contentType || "image/png"};base64,${logo}`;
  }

  // Get content type
  const actualContentType = logo?.contentType || contentType || "image/png";

  if (logo?.type === "Buffer" && Array.isArray(logo?.data)) {
    try {
      const binary = Uint8Array.from(logo.data);

      let binaryString = "";

      for (let i = 0; i < binary.length; i++) {
        binaryString += String.fromCharCode(binary[i]);
      }

      return `data:${actualContentType};base64,${btoa(binaryString)}`;
    } catch (error) {
      console.error("Logo conversion error:", error);
      return null;
    }
  }

  if (logo?.data?.type === "Buffer" && Array.isArray(logo?.data?.data)) {
    try {
      const bytes = Uint8Array.from(logo.data.data);

      let binaryString = "";

      for (let i = 0; i < bytes.length; i++) {
        binaryString += String.fromCharCode(bytes[i]);
      }

      return `data:${actualContentType};base64,${btoa(binaryString)}`;
    } catch (error) {
      console.error("Nested logo conversion error:", error);
      return null;
    }
  }

  // Direct byte array
  if (Array.isArray(logo)) {
    try {
      const bytes = Uint8Array.from(logo);

      let binaryString = "";

      for (let i = 0; i < bytes.length; i++) {
        binaryString += String.fromCharCode(bytes[i]);
      }

      return `data:${actualContentType};base64,${btoa(binaryString)}`;
    } catch (error) {
      console.error("Logo array conversion error:", error);
      return null;
    }
  }

  // logo.data is a direct byte array
  if (Array.isArray(logo?.data)) {
    try {
      const bytes = Uint8Array.from(logo.data);

      let binaryString = "";

      for (let i = 0; i < bytes.length; i++) {
        binaryString += String.fromCharCode(bytes[i]);
      }

      return `data:${actualContentType};base64,${btoa(binaryString)}`;
    } catch (error) {
      console.error("Logo data conversion error:", error);
      return null;
    }
  }

  // Base64 string inside logo.data
  if (logo?.data && typeof logo.data === "string") {
    return `data:${actualContentType};base64,${logo.data}`;
  }

  return null;
};

export default getLogoSrc;
