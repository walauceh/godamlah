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

const app_id = "app_0e5d341b302d9411fc114e19d7dfb561";
const action = "testing-action";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        console.log('Incoming request body:', req.body);

        const { proof, signal } = req.body as IVerifyRequest;

        if (!proof || !proof.nullifier_hash || !proof.merkle_root || !proof.proof || !proof.verification_level) {
            return res.status(400).json({ error: 'Invalid proof format' });
        }

        const verifyRes = await verifyCloudProof(proof, app_id, action, signal);

        console.log('verifyCloudProof response:', verifyRes);

        if (verifyRes.success) {
            res.status(200).json({ success: true });
        } else {
            res.status(400).json({ 
                success: false, 
                code: verifyRes.code, 
                attribute: verifyRes.attribute, 
                detail: verifyRes.detail 
            });
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error('Verification error:', error.message);
            res.status(500).json({ error: 'Internal server error', detail: error.message });
        } else {
            console.error('Unknown error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
