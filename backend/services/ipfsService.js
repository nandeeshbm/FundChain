const crypto = require('crypto');
const { PINATA_JWT } = require('../config/env');

const dataUrlToBuffer = (dataUrl) => {
  const match = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!match) return null;
  const mimeType = match[1];
  const base64 = match[2];
  return {
    mimeType,
    buffer: Buffer.from(base64, 'base64'),
  };
};

const fallbackCidFromBuffer = (buffer) => {
  const hash = crypto.createHash('sha256').update(buffer).digest('hex');
  return `local-${hash.slice(0, 46)}`;
};

const uploadPhotoDataUrlToIPFS = async (dataUrl, fileName = 'site-photo.jpg') => {
  const parsed = dataUrlToBuffer(dataUrl);
  if (!parsed) {
    return { ok: false, reason: 'Invalid image format', cid: null, url: null };
  }

  if (!PINATA_JWT) {
    const cid = fallbackCidFromBuffer(parsed.buffer);
    return { ok: true, reason: 'IPFS provider not configured; stored local CID', cid, url: `ipfs://${cid}` };
  }

  try {
    const blob = new Blob([parsed.buffer], { type: parsed.mimeType });
    const form = new FormData();
    form.append('file', blob, fileName);

    const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: { Authorization: `Bearer ${PINATA_JWT}` },
      body: form,
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json?.IpfsHash) {
      const cid = fallbackCidFromBuffer(parsed.buffer);
      return { ok: true, reason: json?.error || 'Pinata upload failed; using local CID', cid, url: `ipfs://${cid}` };
    }

    return { ok: true, reason: null, cid: json.IpfsHash, url: `ipfs://${json.IpfsHash}` };
  } catch (err) {
    const cid = fallbackCidFromBuffer(parsed.buffer);
    return { ok: true, reason: `IPFS upload error: ${err.message}; using local CID`, cid, url: `ipfs://${cid}` };
  }
};

module.exports = { uploadPhotoDataUrlToIPFS };
