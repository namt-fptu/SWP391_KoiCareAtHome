import React from 'react';

function Footer() {
  
  return (
    <div className="footer bg-blue-500 text-white py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-lg font-semibold mb-4">KoiF</h2>
        <p className="mb-2">Address: KoiF FPT University School, Ho Chi Minh City</p>
        <p className="mb-2">Phone Number: <a href="tel:0933704567" className="underline hover:text-blue-300">093 370 45 67</a></p>
        <p className="mb-2">Email: <a href="mailto:sofn2004@gmail.com" className="underline hover:text-blue-300">sofn2004@gmail.com</a></p>
      </div>
    </div>
  );
}

export default Footer;
