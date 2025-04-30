import type { EventEmitter } from "node:events";

// TODO: Incrementally add keys to this type as we need them in modules using TypeScript
export interface DocObject {
  idIstex: string;
  arkIstex: string;
  corpusOutput: string;
  language: {
    "iso639-2b"?: string;
    rfc3066?: string;
  };
  fulltext?: {
    path: string;
    original: boolean;
    mime: string;
    cleaned?: boolean;
  }[];
  enrichments?: {
    teeft?: {
      path: string;
      original: false;
      mimetype: "application/tei+xml";
      extension: "tei";
    }[];
  };
  error?: {
    message?: string;
    stack?: string;
  };
}

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
