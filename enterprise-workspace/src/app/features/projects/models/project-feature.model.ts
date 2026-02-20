export type ProjectStatus = 'On Track' | 'At Risk' | 'Blocked';

export interface ProjectSummary {
  id: string;
  key: string;
  name: string;
  summary: string;
  owner: string;
  status: ProjectStatus;
  progress: number;
  dueDate: string;
  teamSize: number;
  productivity: number;
}

export interface ProjectMilestone {
  name: string;
  dueDate: string;
  completion: number;
}

export interface ProjectMember {
  id: string;
  name: string;
  role: string;
  allocation: string;
  initials: string;
}

export interface ProjectDetail extends ProjectSummary {
  description: string;
  budget: string;
  sprint: string;
  completionRate: number;
  openTasks: number;
  teamMembers: ProjectMember[];
  milestones: ProjectMilestone[];
}

export interface CreateProjectPayload {
  name: string;
  owner: string;
  status: ProjectStatus;
  dueDate: string;
  summary: string;
}

export interface ProjectSettingsPayload {
  name: string;
  owner: string;
  dueDate: string;
  status: ProjectStatus;
  summary: string;
  description: string;
}

export interface AutosaveResult {
  savedAt: string;
}
