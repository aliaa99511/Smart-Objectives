export const getFileType = (url) => {
  if (!url) return 'unknown';
  
  const extension = url.split('.').pop().toLowerCase();
  
  if (extension === 'pdf') {
    return 'pdf';
  }
  
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(extension)) {
    return 'image';
  }
  
  return 'unknown';
};