import { File as NodeFile } from 'node:buffer';
import {
  buildPinataGatewayUrl,
  type GatewayUrlBuilder,
  type StorachaListClient,
  type StorachaUploadClient,
} from './client.js';

export interface CreatePinataClientOptions {
  pinataJwt: string;
  pinataGateway?: string;
}

export interface PinataFileListItemLike {
  cid?: string | null;
}

export type PinataCompatibleClient =
  & StorachaUploadClient
  & StorachaListClient
  & {
    gatewayUrlBuilder: GatewayUrlBuilder;
    provider: 'pinata';
  };

function toUploadFile(blob: Blob): InstanceType<typeof NodeFile> {
  if (blob instanceof NodeFile) {
    return blob;
  }

  return new NodeFile([blob], 'optimitron-snapshot.json', {
    type: blob.type || 'application/json',
  });
}

export async function createPinataClient(
  options: CreatePinataClientOptions,
): Promise<PinataCompatibleClient> {
  const { PinataSDK } = await import('pinata');
  const pinata = new PinataSDK({
    pinataJwt: options.pinataJwt,
    ...(options.pinataGateway ? { pinataGateway: options.pinataGateway } : {}),
  });
  const gatewayUrlBuilder: GatewayUrlBuilder = (cid) =>
    buildPinataGatewayUrl(cid, options.pinataGateway);

  return {
    provider: 'pinata',
    gatewayUrlBuilder,
    async uploadFile(blob) {
      const upload = await pinata.upload.public.file(toUploadFile(blob));
      return upload.cid;
    },
    capability: {
      upload: {
        async list(options = {}) {
          const limit = options.size ?? 100;
          const offset = options.cursor ? Number.parseInt(options.cursor, 10) || 0 : 0;
          const request = pinata.files.public.list().order('DESC');

          const results: Array<{ root: string }> = [];
          let index = 0;
          for await (const item of request as AsyncIterable<PinataFileListItemLike>) {
            if (index < offset) {
              index += 1;
              continue;
            }

            if (item.cid) {
              results.push({ root: item.cid });
            }

            index += 1;
            if (results.length >= limit) {
              break;
            }
          }

          const cursor = results.length >= limit ? String(offset + results.length) : undefined;

          return { cursor, results };
        },
      },
    },
  };
}
