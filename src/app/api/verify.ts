import { verifyCloudProof, VerificationLevel } from '@worldcoin/idkit';
import { type NextApiRequest, type NextApiResponse } from 'next';

export type VerifyReply = {
    success: boolean;
    code?: string;
    attribute?: string | null;
    detail?: string;
};

interface IVerifyRequest {
    proof: {
        nullifier_hash: string;
        merkle_root: string;
        proof: string;
        verification_level: VerificationLevel;
    };
    signal?: string;
}

const app_id = "app_0e5d341b302d9411fc114e19d7dfb561"
const action = "data-user-1"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { proof, signal } = req.body as IVerifyRequest;
        const verifyRes = await verifyCloudProof(proof, app_id, action, signal);

        if (verifyRes.success) {
            // This is where you should perform backend actions if the verification succeeds
            // Such as, setting a user as "verified" in a database
            res.status(200).json({ success: true });
        } else {
            // This is where you should handle errors from the World ID /verify endpoint. 
            // Usually these errors are due to a user having already verified.
            res.status(400).json({ 
                success: false, 
                code: verifyRes.code, 
                attribute: verifyRes.attribute, 
                detail: verifyRes.detail 
            });
        }
    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};