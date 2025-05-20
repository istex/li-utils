import type { EventEmitter } from "node:events";

// TODO: Incrementally add keys these types as we need them in modules using TypeScript

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
  metadata?: {
    path: string;
    original: boolean;
    mime: string;
  }[];
  fulltext?: ({
    path: string;
    original: boolean;
    mime: string;
    cleaned?: boolean;
  } & Record<string, unknown>)[];
  error?: {
    message?: string;
    stack?: string;
  };
}

export interface IstexDocObject extends CommonDocObject {
  idIstex: string;
  arkIstex: string;
  language?: {
    "iso639-2b"?: string;
    rfc3066?: string;
  };
  enrichments?: {
    teeft?: {
      path: string;
      original: false;
      mimetype: "application/tei+xml";
      extension: "tei";
    }[];
  };
}

export interface CorhalDocObject extends CommonDocObject {
  harvestModifiedDateFrom: Date;
  source: string;
  abstract?: {
    fr?: string;
    en?: string;
    default?: string;
  };
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
