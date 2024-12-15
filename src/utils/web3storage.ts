import { create } from '@web3-storage/w3up-client';

async function initializeClient() {
    const client = await create();
    console.log('Client initialized successfully');
    return client;
}

async function createAndUseSpace(client: any) {
    const space = await client.createSpace('my-space-name'); // Create a Space
    await client.setCurrentSpace(space.did()); // Set it as the current Space
    console.log(`Space created and set: ${space.did()}`);
}

async function uploadFile(client: any, file: File) {
    const cid = await client.uploadFile(file); // Uploads file to IPFS
    console.log(`File uploaded successfully! CID: ${cid}`);
    return cid.toString();
}