const getWebsiteUrl = (website) => {
  if (!website) return "#";

  if (website.startsWith("http://") || website.startsWith("https://")) {
    return website;
  }

  return `https://${website}`;
};

export default getWebsiteUrl;
