import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, delay, map, of } from 'rxjs';

import {
  AutosaveResult,
  CreateProjectPayload,
  ProjectDetail,
  ProjectSettingsPayload,
  ProjectSummary
} from '../models/project-feature.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectsApiService {
  private readonly http = inject(HttpClient);

  private mockProjects: ProjectDetail[] = [
    {
      id: 'learning-platform-2',
      key: 'PRJ-101',
      name: 'Learning Platform 2.0',
      summary: 'Modernize course authoring and delivery infrastructure across enterprise teams.',
      owner: 'Mia Chen',
      status: 'On Track',
      progress: 74,
      dueDate: '2026-03-14',
      teamSize: 18,
      productivity: 87,
      description:
        'Multi-quarter program focused on platform reliability, authoring speed, and enterprise-grade observability.',
      budget: '$1.4M',
      sprint: 'Sprint 18',
      completionRate: 74,
      openTasks: 48,
      teamMembers: [
        { id: 'tm-1', name: 'Mia Chen', role: 'Program Lead', allocation: '80%', initials: 'MC' },
        { id: 'tm-2', name: 'Arjun Rao', role: 'Staff Engineer', allocation: '100%', initials: 'AR' },
        { id: 'tm-3', name: 'Nina Park', role: 'Product Designer', allocation: '65%', initials: 'NP' }
      ],
      milestones: [
        { name: 'Platform migration wave 3', dueDate: '2026-03-22', completion: 82 },
        { name: 'Authoring pipeline beta', dueDate: '2026-04-05', completion: 64 },
        { name: 'Security hardening audit', dueDate: '2026-04-18', completion: 45 }
      ]
    },
    {
      id: 'billing-rewrite',
      key: 'PRJ-114',
      name: 'Enterprise Billing Rewrite',
      summary: 'Rebuild billing services with contract-safe APIs and stronger financial controls.',
      owner: 'Noah Patel',
      status: 'At Risk',
      progress: 49,
      dueDate: '2026-04-02',
      teamSize: 14,
      productivity: 71,
      description:
        'Architecture transition from monolith invoicing to event-driven billing orchestration with compliance checkpoints.',
      budget: '$1.1M',
      sprint: 'Sprint 11',
      completionRate: 49,
      openTasks: 73,
      teamMembers: [
        { id: 'tm-4', name: 'Noah Patel', role: 'Engineering Manager', allocation: '90%', initials: 'NP' },
        { id: 'tm-5', name: 'Jules Kim', role: 'Backend Engineer', allocation: '100%', initials: 'JK' },
        { id: 'tm-6', name: 'Lina Gomez', role: 'QA Lead', allocation: '80%', initials: 'LG' }
      ],
      milestones: [
        { name: 'Invoice engine parity', dueDate: '2026-03-30', completion: 56 },
        { name: 'Ledger reconciliation checks', dueDate: '2026-04-12', completion: 41 },
        { name: 'Compliance sign-off', dueDate: '2026-04-20', completion: 18 }
      ]
    },
    {
      id: 'insights-pipeline',
      key: 'PRJ-129',
      name: 'Content Insights Pipeline',
      summary: 'Unify learner events into a low-latency analytics stream for portfolio reporting.',
      owner: 'Ava Romero',
      status: 'Blocked',
      progress: 36,
      dueDate: '2026-04-28',
      teamSize: 11,
      productivity: 64,
      description:
        'Streaming architecture initiative to centralize engagement and completion metrics for leadership dashboards.',
      budget: '$780K',
      sprint: 'Sprint 9',
      completionRate: 36,
      openTasks: 82,
      teamMembers: [
        { id: 'tm-7', name: 'Ava Romero', role: 'Data PM', allocation: '85%', initials: 'AR' },
        { id: 'tm-8', name: 'Sam Duarte', role: 'Data Engineer', allocation: '100%', initials: 'SD' },
        { id: 'tm-9', name: 'Ria Banerjee', role: 'Analytics Engineer', allocation: '75%', initials: 'RB' }
      ],
      milestones: [
        { name: 'Event schema consolidation', dueDate: '2026-03-28', completion: 52 },
        { name: 'Warehouse sync resilience', dueDate: '2026-04-15', completion: 35 },
        { name: 'Executive dashboard go-live', dueDate: '2026-04-28', completion: 22 }
      ]
    }
  ];

  getProjects(): Observable<ProjectSummary[]> {
    return this.http.get<ProjectSummary[]>('/api/projects').pipe(
      catchError(() => of(this.mockProjects.map((project) => this.toSummary(project))).pipe(delay(260)))
    );
  }

  getProjectById(projectId: string): Observable<ProjectDetail> {
    return this.http.get<ProjectDetail>(`/api/projects/${projectId}`).pipe(
      catchError(() => {
        const project = this.mockProjects.find((item) => item.id === projectId) ?? this.mockProjects[0];
        return of(project).pipe(delay(230));
      })
    );
  }

  createProject(payload: CreateProjectPayload): Observable<ProjectSummary> {
    return this.http.post<ProjectSummary>('/api/projects', payload).pipe(
      catchError(() => {
        const createdProject = this.createMockProject(payload);
        this.mockProjects = [createdProject, ...this.mockProjects];
        return of(this.toSummary(createdProject)).pipe(delay(320));
      })
    );
  }

  updateProjectSettings(
    projectId: string,
    payload: ProjectSettingsPayload
  ): Observable<ProjectDetail> {
    return this.http.patch<ProjectDetail>(`/api/projects/${projectId}`, payload).pipe(
      catchError(() => {
        const project = this.mockProjects.find((item) => item.id === projectId);

        if (!project) {
          return of(this.mockProjects[0]).pipe(delay(250));
        }

        Object.assign(project, payload);
        return of(project).pipe(delay(280));
      })
    );
  }

  simulateAutosave(
    projectId: string,
    payload: ProjectSettingsPayload
  ): Observable<AutosaveResult> {
    return this.updateProjectSettings(projectId, payload).pipe(
      map(() => ({ savedAt: new Date().toISOString() }))
    );
  }

  private createMockProject(payload: CreateProjectPayload): ProjectDetail {
    const idSuffix = Math.floor(Math.random() * 900 + 100);

    return {
      id: `project-${idSuffix}`,
      key: `PRJ-${idSuffix}`,
      name: payload.name,
      summary: payload.summary,
      owner: payload.owner,
      status: payload.status,
      progress: payload.status === 'On Track' ? 18 : payload.status === 'At Risk' ? 12 : 9,
      dueDate: payload.dueDate,
      teamSize: 6,
      productivity: 58,
      description:
        'Newly created initiative. Define milestones, assign team ownership, and finalize execution checkpoints.',
      budget: '$420K',
      sprint: 'Sprint 1',
      completionRate: 12,
      openTasks: 24,
      teamMembers: [
        {
          id: `tm-${idSuffix}-1`,
          name: payload.owner,
          role: 'Project Owner',
          allocation: '70%',
          initials: this.toInitials(payload.owner)
        }
      ],
      milestones: [
        { name: 'Kickoff and scope lock', dueDate: payload.dueDate, completion: 10 },
        { name: 'Execution plan approved', dueDate: payload.dueDate, completion: 0 }
      ]
    };
  }

  private toSummary(project: ProjectDetail): ProjectSummary {
    const {
      id,
      key,
      name,
      summary,
      owner,
      status,
      progress,
      dueDate,
      teamSize,
      productivity
    } = project;

    return {
      id,
      key,
      name,
      summary,
      owner,
      status,
      progress,
      dueDate,
      teamSize,
      productivity
    };
  }

  private toInitials(name: string): string {
    return name
      .split(' ')
      .filter((part) => part.trim().length > 0)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('');
  }
}
