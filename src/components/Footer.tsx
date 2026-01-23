import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t mt-16">
      <div className="container py-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Hello Gorgeous Med Spa. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
