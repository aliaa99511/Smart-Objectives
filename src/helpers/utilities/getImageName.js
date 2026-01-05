export const getImageName = (url) => {
  if (!url) return '';
  const filename = url.split('/').pop(); // Get last part of URL
  return filename.split('.')[0]; // Remove file extension
};