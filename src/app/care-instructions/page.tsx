import React from 'react';

export default function CareInstructionsPage() {
  return (
    <div className="min-h-screen bg-dark-800">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-primary-100">Care Instructions</h1>
        
        <div className="bg-dark-700 rounded-lg shadow-md p-6 border border-primary-200/20">
          <div className="prose prose-lg max-w-none">
            
            <ul className="list-disc pl-6 mb-6 space-y-2 text-primary-200">
              <li>Store cream cakes in a refrigerator.</li>
              <li>Fondant cakes should be stored in an air-conditioned environment.</li>
              <li>Slice and serve the cake at room temperature and make sure it is not exposed to heat.</li>
              <li>Use a serrated knife to cut a fondant cake.</li>
              <li>Sculptural elements and figurines may contain wire supports toothpicks or wooden skewers for support.</li>
              <li>Please check the placement of these items before serving to small children.</li>
              <li>The cake should be consumed within 24 hours.</li>
              <li>Enjoy your cake!</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mb-4 text-primary-100">Manufacturer Details</h2>
            <div className="text-primary-200 mb-6">
              <p><strong className="text-primary-100">Ferns N Petals Private Limited</strong></p>
              <p><strong className="text-primary-100">Address:</strong> [Address to be updated]</p>
              <p><strong className="text-primary-100">FSSAI License No.:</strong> [License number to be updated]</p>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
