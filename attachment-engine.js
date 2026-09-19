/* GPS Pethgam Wagoora — Universal Firebase Storage Attachment Engine
   Persistent binary files live in Firebase Storage; Firestore stores metadata only. */
(function(){
  'use strict';
  const ALLOWED = new Set(['application/pdf','image/jpeg','image/png','image/webp']);
  const EXT = new Set(['pdf','jpg','jpeg','png','webp']);
  const MAX = 10 * 1024 * 1024;
  function ext(name){ const p=String(name||'').toLowerCase().split('.'); return p.length>1?p.pop():''; }
  function validate(file, maxBytes=MAX){
    if(!file) throw new Error('Please select a file.');
    if(file.size>maxBytes) throw new Error('File is too large. Maximum allowed size is '+Math.round(maxBytes/1048576)+' MB.');
    const e=ext(file.name), mime=String(file.type||'').toLowerCase();
    if(!EXT.has(e) || (mime && !ALLOWED.has(mime))) throw new Error('Unsupported file type. Use PDF, JPG/JPEG, PNG or WebP.');
    return true;
  }
  async function upload(file, options={}){
    validate(file, options.maxBytes||MAX);
    if(!window.firebase || !firebase.auth || !firebase.storage) throw new Error('Firebase Storage is not available on this page.');
    const user=firebase.auth().currentUser;
    if(!user) throw new Error('Please sign in before uploading a file.');
    const root=String(options.root||'attachments').replace(/^\/+|\/+$/g,'');
    const id=String(options.recordId||crypto.randomUUID()).replace(/[^A-Za-z0-9_-]/g,'_');
    const path=root+'/'+id+'/'+Date.now()+'_'+file.name.replace(/[^A-Za-z0-9._-]/g,'_');
    const ref=firebase.storage().ref(path);
    const task=ref.put(file,{contentType:file.type});
    if(typeof options.onProgress==='function') task.on('state_changed',s=>options.onProgress(Math.round(s.bytesTransferred/s.totalBytes*100)));
    const snap=await task;
    const url=await snap.ref.getDownloadURL();
    return {name:file.name,size:file.size,type:file.type||'application/octet-stream',path,downloadURL:url,uploadedBy:user.uid,uploadedAt:new Date().toISOString()};
  }
  async function remove(meta){ if(meta?.path && firebase?.storage) await firebase.storage().ref(meta.path).delete(); }
  window.GPSAttachment={validate,upload,remove,ALLOWED,MAX};
})();