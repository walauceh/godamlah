import { IDKitWidget, ISuccessResult, VerificationLevel } from '@worldcoin/idkit';
import React from 'react';

interface WorldIDButtonProps {
    onSuccess: (result: ISuccessResult) => void;
}

export const WorldIDButton = ({ onSuccess }: WorldIDButtonProps) => {
    const verifyProof = async (proof: ISuccessResult) => {
        try {
            const response = await fetch('/api/verify', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(proof),
            });
        
            if (response.ok) {
                const result = await response.json();
                return result.success;
            } else {
                const errorData = await response.json();
                throw new Error(`Error Code ${errorData.detail}`);
            }
        } catch (error) {
            console.error('Verification error:', error);
            return false;
        }
    };

    const buttonStyle: React.CSSProperties = {
        background: 'linear-gradient(#00001c, #00001c) padding-box, linear-gradient(to right, #a855f7, #3b82f6) border-box',
        border: '2px solid transparent',
        transition: 'background 0.3s ease'
    };

  return (
    <div className="inline-block">
      <IDKitWidget
        app_id="app_staging_04ed24301846665ea24e095eeba0cb98"
        action="verifyuser"
        verification_level={VerificationLevel.Device}
        handleVerify={verifyProof}
        onSuccess={onSuccess}
      >
        {({ open }) => (
          <button
            onClick={open}
            className="px-6 py-2 rounded-full text-white relative overflow-hidden group"
            style={buttonStyle}
            onMouseOver={(e) => {
                const target = e.currentTarget;
                target.style.background = 'linear-gradient(to right,rgb(99, 25, 168),rgb(3, 69, 175)) border-box';
            }}
            onMouseOut={(e) => {
                const target = e.currentTarget;
                target.style.background = 'linear-gradient(#00001c, #00001c) padding-box, linear-gradient(to right, #a855f7, #3b82f6) border-box';
            }}
          >
            Verify with World ID
          </button>
        )}
      </IDKitWidget>
    </div>
  );
};