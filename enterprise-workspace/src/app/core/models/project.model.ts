export interface Project {
  id: string;
  name: string;
  owner: string;
  status: 'On Track' | 'At Risk' | 'Blocked';
  progress: number;
  dueDate: string;
}
