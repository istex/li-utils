import type { EventEmitter } from "node:events";

interface FileEntry {
  path: string;
  original: boolean;
  mime: string;
}

interface CommonDocObject {
  idIstex: string;
  corpusName: string;
  cartoType: string;
  corpusRoot: string;
  corpusOutput: string;
  harvestModifiedDateTo: Date;
  technical?: {
    internalId?: string;
    modificationDate?: number;
  };
  metadata?: FileEntry[];
  fulltext?: (FileEntry & { cleaned?: boolean } & Record<string, unknown>)[];
  error?: {
    message?: string;
    stack?: string;
  };
}

export interface IstexDocObject extends CommonDocObject {
  annexes?: FileEntry[];
}

export interface CorhalDocObject extends CommonDocObject {
  harvestModifiedDateFrom: Date;
}

export type DocObject = IstexDocObject | CorhalDocObject;

export interface FinalJobResult {
  errors: DocObject[];
  results: DocObject[];
}

export class AbstractBusiness extends EventEmitter {
  constructor(options?: { props: Record<string, unknown> });
  doTheJob(docObject: DocObject): Promise<DocObject>;
  initialJob(): Promise<void>;
  finalJob(docObjects: DocObject[]): Promise<FinalJobResult>;
  beforeAnyJob(): Promise<void>;
  afterAllTheJobs(): Promise<void>;
  linksEventEmitter(ee: EventEmitter): void;
}

export class LegacyBusinessWrapper extends AbstractBusiness {
  constructor(
    legacyBusinessModule: Record<string, unknown>,
    options?: { props: Record<string, unknown> },
  );
}

export function setDocObjectError(
  docObject: DocObject,
  error: Error,
): DocObject;
