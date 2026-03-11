import {
  ATTACHMENT_COLLECTION,
  AttachmentInputSchema,
  HypercertAttachmentRecordSchema,
  type AttachmentInput,
  type HypercertAttachmentRecord,
} from './types.js';

function nowIso(): string {
  return new Date().toISOString();
}

export function createAttachmentRecord(
  input: AttachmentInput,
): HypercertAttachmentRecord {
  const parsed = AttachmentInputSchema.parse(input);
  return HypercertAttachmentRecordSchema.parse({
    $type: ATTACHMENT_COLLECTION,
    title: parsed.title,
    createdAt: parsed.createdAt ?? nowIso(),
    subjects: parsed.subjects,
    content: parsed.urls.map((uri) => ({ uri })),
    contentType: parsed.contentType ?? 'evidence',
    shortDescription: parsed.shortDescription,
  });
}
