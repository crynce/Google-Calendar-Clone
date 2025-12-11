import React from 'react';

const Card = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 max-w-md w-full">
      {children}
    </div>
  );
};

export default Card;
