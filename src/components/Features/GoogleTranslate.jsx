import React, { useEffect } from 'react';
import './GoogleTranslate.css'; // Import the CSS file for styling
import { FaLanguage } from "react-icons/fa6";

const GoogleTranslate = () => {
  useEffect(() => {
    const googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'af,sq,am,ar,hy,az,eu,be,bn,bs,bg,ca,ceb,zh-CN,zh-TW,co,hr,cs,da,nl,en,eo,et,fi,fr,fy,gl,ka,de,el,gu,ht,ha,haw,iw,hi,hmn,hu,is,ig,id,ga,it,ja,jw,kn,kk,km,rw,ko,ku,ky,lo,la,lv,lt,lb,mk,mg,ms,ml,mt,mi,mr,mn,my,ne,no,ny,or,ps,fa,pl,pt,pa,ro,ru,sm,gd,sr,st,sn,sd,si,sk,sl,so,es,su,sw,sv,tl,tg,ta,tt,te,th,ti,ts,tr,tk,uk,ur,ug,uz,vi,cy,xh,yi,yo,zu',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
        },
        'google_translate_element'
      );
    };

    // Check if Google Translate is already loaded
    if (!window.google || !window.google.translate) {
      const addScript = document.createElement('script');
      addScript.setAttribute('src', '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit');
      document.body.appendChild(addScript);
      window.googleTranslateElementInit = googleTranslateElementInit;
    } else {
      googleTranslateElementInit();
    }
  }, []);

  return (
    <div className='flex justify-center items-center rounded-md w-[6rem]'>
      <div id="google_translate_element" className='bg-white p-2 rounded-md shadow-inner'>
             
      </div>
      <div className='VIpgJd-ZVi9od-xl07Ob-lTBxed'>
      
      </div>

    </div>

  );
};

export default GoogleTranslate;
