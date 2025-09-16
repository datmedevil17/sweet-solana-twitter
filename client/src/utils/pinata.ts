import axios from "axios";

const pinata_api_key = process.env.NEXT_PUBLIC_PINATA_API_KEY;
const pinata_secret_api_key = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY;

interface PinataResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

interface PinataError {
  error: {
    reason: string;
    details: string;
  };
}

export const uploadToIpfs = async (file: File): Promise<string> => {
  if (!file) {
    throw new Error("No file provided");
  }

  try {
    const fileData = new FormData();
    fileData.append("file", file);
    
    const res = await axios.post<PinataResponse>(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      fileData,
      {
        headers: {
          pinata_api_key,
          pinata_secret_api_key,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    
    const tokenURI = `https://ipfs.io/ipfs/${res.data.IpfsHash}`;
    console.log(tokenURI);
    return tokenURI;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("Error uploading file to IPFS");
  }
};

export const uploadToIpfsJson = async (jsonData: Record<string, unknown>): Promise<string> => {
  if (!jsonData) {
    throw new Error("No JSON data provided");
  }

  try {
    const res = await axios.post<PinataResponse>(
      'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      jsonData,
      {
        headers: {
          pinata_api_key,
          pinata_secret_api_key,
          'Content-Type': 'application/json',
        }
      }
    );
    
    const tokenURI = `https://ipfs.io/ipfs/${res.data.IpfsHash}`;
    console.log(tokenURI);
    return tokenURI;
  } catch (error) {
    console.log("Error uploading JSON:", error);
    throw new Error("Error uploading JSON to IPFS");
  }
};

export const getJsonFromIpfs = async <T = unknown>(ipfsHash: string): Promise<T> => {
  if (!ipfsHash) {
    throw new Error("No IPFS hash provided");
  }

  try {
    const res = await axios.get<T>(ipfsHash);
    const jsonData = res.data;
    console.log(jsonData);
    return jsonData;
  } catch (error) {
    console.log("Error fetching JSON:", error);
    throw new Error("Error fetching JSON from IPFS");
  }
};

// Helper function to validate environment variables
export const validatePinataConfig = (): boolean => {
  if (!pinata_api_key || !pinata_secret_api_key) {
    console.warn("Pinata API credentials not found in environment variables");
    return false;
  }
  return true;
};

// Type guard for checking if error is from Pinata
export const isPinataError = (error: unknown): error is PinataError => {
  return !!(error && 
    typeof error === 'object' && 
    'error' in error && 
    typeof (error as PinataError).error === 'object' && 
    typeof (error as PinataError).error.reason === 'string');
};