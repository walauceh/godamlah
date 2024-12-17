// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import * as Client from '@web3-storage/w3up-client'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: 'No file provided or invalid file' },
        { status: 400 }
      );
    }

    // Upload file to Web3.Storage
    // authorize your local agent to act on your behalf
    const client = await Client.create()
    
    await client.login(`${process.env.NEXT_PUBLIC_EMAIL}@gmail.com`)
    await client.setCurrentSpace(`did:key:${process.env.NEXT_PUBLIC_WEB3_STORAGE_DID_KEY}`)

    const cid = await client.uploadFile(file);
    const fileUrl = `https://w3s.link/ipfs/${cid}`;

    console.log(`IPFS CID: ${cid}`)
    console.log(`Gateway URL: https://w3s.link/ipfs/${cid}`)

    return NextResponse.json({ cid, url: fileUrl });
  } catch (error) {
    console.error('Web3.Storage Upload Error:', error);
    return NextResponse.json(
      { error: 'File upload failed. Please try again.' },
      { status: 500 }
    );
  }
}