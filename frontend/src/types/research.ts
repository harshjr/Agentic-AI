export interface ResearchMetadata {
  sources: string[];
  timestamp: string;
}

export interface ResearchResponse {
  report: string;
  critic: string;
  metadata: ResearchMetadata;
}

export interface ResearchRequest {
  topic: string;
}

export type PipelineStage = "idle" | "searching" | "reading" | "writing" | "critiquing" | "completed" | "error";

export interface StageInfo {
  id: PipelineStage;
  label: string;
  description: string;
  agent: string;
}
