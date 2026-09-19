/* GPS Pethgam Wagoora — shared Firebase sync helper.
   LocalStorage remains the offline/admin backup; Firestore is the cloud source for the Student Portal. */
(function(){
  const cfg=window.GPS_FIREBASE_CONFIG;
  window.GPSCloud={
    db:null,ready:false,
    init:function(){
      try{
        if(!cfg || !cfg.apiKey) return false;
        if(!window.firebase) return false;
        if(!firebase.apps.length) firebase.initializeApp(cfg);
        this.db=firebase.firestore();
        this.ready=true; return true;
      }catch(e){console.warn('GPSCloud init:',e);return false;}
    },
    user:function(){try{return firebase.auth().currentUser||null}catch(e){return null}},
    signedIn:function(){return !!this.user()},
    escId:function(v){return String(v||'').trim()}
  };
})();
