import { Attachment } from './attachment';

export interface Content {
  text?: string;
  attachmentCollection?: Attachment[];
}
