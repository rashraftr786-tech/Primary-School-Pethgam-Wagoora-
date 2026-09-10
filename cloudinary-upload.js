/* GPS Pethgam Wagoora — Cloudinary image upload helper
   Uses an UNSIGNED upload preset. Never place an API secret in this file. */
(function(){
  'use strict';
  const cfg = window.GPS_CLOUDINARY || {};
  const MAX_BYTES = Number(cfg.maxBytes || 8 * 1024 * 1024);
  const API_BASE = 'https://api.cloudinary.com/v1_1/';

  function assertConfig(){
    if(!cfg.cloudName) throw new Error('Cloudinary Cloud Name is not configured.');
    if(!cfg.uploadPreset) throw new Error('Cloudinary Upload Preset is not configured.');
  }

  async function uploadImage(file, options){
    assertConfig();
    if(!file) throw new Error('No image file was selected.');
    if(!String(file.type || '').startsWith('image/')) throw new Error('Please select an image file.');
    if(file.size > MAX_BYTES) throw new Error('Image is too large. Please choose an image up to '+Math.round(MAX_BYTES/1024/1024)+' MB.');

    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', cfg.uploadPreset);
    const opts = options || {};
    if(opts.folder) form.append('folder', String(opts.folder));
    if(opts.publicId) form.append('public_id', String(opts.publicId));
    if(opts.tags) form.append('tags', Array.isArray(opts.tags) ? opts.tags.join(',') : String(opts.tags));

    const response = await fetch(API_BASE + encodeURIComponent(cfg.cloudName) + '/image/upload', {
      method:'POST', body:form
    });
    let data = {};
    try { data = await response.json(); } catch(_) {}
    if(!response.ok || !data.secure_url){
      throw new Error(data.error && data.error.message ? data.error.message : 'Cloudinary image upload failed.');
    }
    return {
      secureUrl: data.secure_url,
      publicId: data.public_id || '',
      width: data.width || 0,
      height: data.height || 0,
      bytes: data.bytes || file.size,
      format: data.format || ''
    };
  }

  async function uploadDataUrl(dataUrl, options){
    if(!String(dataUrl || '').startsWith('data:image/')) throw new Error('The stored photograph is not a valid image.');
    const blob = await (await fetch(dataUrl)).blob();
    const ext = (blob.type || 'image/jpeg').split('/')[1] || 'jpeg';
    const file = new File([blob], 'student-photo.' + ext, {type:blob.type || 'image/jpeg'});
    return uploadImage(file, options);
  }

  window.GPSCloudinary = {
    config: cfg,
    uploadImage,
    uploadDataUrl
  };
})();
