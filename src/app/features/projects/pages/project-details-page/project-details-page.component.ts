import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { debounceTime, filter, finalize, map, of, switchMap } from 'rxjs';

import { formErrorAnimation, tabSwitchAnimation } from '../../animations/projects-animations';
import { ProjectModalComponent } from '../../components/project-modal/project-modal.component';
import { ProjectStatusBadgeComponent } from '../../components/project-status-badge/project-status-badge.component';
import {
  ProjectDetail,
  ProjectSettingsPayload,
  ProjectStatus
} from '../../models/project-feature.model';
import { ProjectsApiService } from '../../services/projects-api.service';

type DetailsTab = 'overview' | 'team' | 'settings';
type AutosaveState = 'idle' | 'saving' | 'saved';

@Component({
  selector: 'app-project-details-page',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgClass,
    RouterLink,
    DatePipe,
    ReactiveFormsModule,
    MatIconModule,
    ProjectStatusBadgeComponent,
    ProjectModalComponent
  ],
  templateUrl: './project-details-page.component.html',
  styleUrl: './project-details-page.component.scss',
  animations: [tabSwitchAnimation, formErrorAnimation]
})
export class ProjectDetailsPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly projectsApiService = inject(ProjectsApiService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly loading = signal(true);
  protected readonly project = signal<ProjectDetail | null>(null);
  protected readonly activeTab = signal<DetailsTab>('overview');
  protected readonly autosaveState = signal<AutosaveState>('idle');
  protected readonly lastSaved = signal('');
  protected readonly submitted = signal(false);
  protected readonly archiveModalOpen = signal(false);

  protected readonly tabs: { key: DetailsTab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'team', label: 'Team' },
    { key: 'settings', label: 'Settings' }
  ];

  protected readonly statusOptions: ProjectStatus[] = ['On Track', 'At Risk', 'Blocked'];

  protected readonly settingsForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    owner: ['', [Validators.required, Validators.minLength(2)]],
    dueDate: ['', [Validators.required]],
    status: ['On Track' as ProjectStatus, [Validators.required]],
    summary: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(180)]],
    description: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(500)]]
  });

  constructor() {
    this.loadProject();
    this.initializeAutosave();
  }

  protected setActiveTab(tab: DetailsTab): void {
    this.activeTab.set(tab);
  }

  protected openArchiveModal(): void {
    this.archiveModalOpen.set(true);
  }

  protected closeArchiveModal(): void {
    this.archiveModalOpen.set(false);
  }

  protected archiveProject(): void {
    this.archiveModalOpen.set(false);
    this.settingsForm.controls.status.setValue('Blocked');
    this.saveSettingsNow();
  }

  protected hasControlError(
    controlName: 'name' | 'owner' | 'dueDate' | 'summary' | 'description'
  ): boolean {
    const control = this.settingsForm.controls[controlName];
    return control.invalid && (control.touched || this.submitted());
  }

  protected controlErrorText(
    controlName: 'name' | 'owner' | 'dueDate' | 'summary' | 'description'
  ): string {
    const control = this.settingsForm.controls[controlName];

    if (control.hasError('required')) {
      return 'This field is required.';
    }

    if (control.hasError('minlength')) {
      return controlName === 'description'
        ? 'Description needs at least 20 characters.'
        : 'Please provide a more descriptive value.';
    }

    if (control.hasError('maxlength')) {
      return 'This value is too long.';
    }

    return 'Please review this field.';
  }

  protected saveSettingsNow(): void {
    this.submitted.set(true);

    if (this.settingsForm.invalid || !this.project()) {
      this.settingsForm.markAllAsTouched();
      return;
    }

    this.autosaveState.set('saving');

    const currentProject = this.project();
    if (!currentProject) {
      return;
    }

    const payload = this.settingsPayload();

    this.projectsApiService
      .updateProjectSettings(currentProject.id, payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((updatedProject) => {
        this.project.set(updatedProject);
        this.settingsForm.markAsPristine();
        this.autosaveState.set('saved');
        this.lastSaved.set(this.formatSavedTime(new Date().toISOString()));
      });
  }

  protected resetSettings(): void {
    const currentProject = this.project();
    if (!currentProject) {
      return;
    }

    this.patchForm(currentProject);
  }

  protected trackByMember(_index: number, member: { id: string }): string {
    return member.id;
  }

  protected trackByMilestone(_index: number, milestone: { name: string }): string {
    return milestone.name;
  }

  private loadProject(): void {
    this.route.paramMap
      .pipe(
        map((params) => params.get('projectId')),
        filter((projectId): projectId is string => !!projectId),
        switchMap((projectId) => {
          this.loading.set(true);

          return this.projectsApiService
            .getProjectById(projectId)
            .pipe(finalize(() => this.loading.set(false)));
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((project) => {
        this.project.set(project);
        this.patchForm(project);
        this.autosaveState.set('idle');
        this.lastSaved.set('');
      });
  }

  private initializeAutosave(): void {
    this.settingsForm.valueChanges
      .pipe(
        debounceTime(1000),
        filter(() => this.settingsForm.valid && this.settingsForm.dirty && !!this.project()),
        switchMap(() => {
          this.autosaveState.set('saving');

          const currentProject = this.project();
          if (!currentProject) {
            return of({ savedAt: new Date().toISOString() });
          }

          return this.projectsApiService.simulateAutosave(currentProject.id, this.settingsPayload());
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((result) => {
        this.autosaveState.set('saved');
        this.lastSaved.set(this.formatSavedTime(result.savedAt));
        this.settingsForm.markAsPristine();

        const currentProject = this.project();
        if (!currentProject) {
          return;
        }

        this.project.set({
          ...currentProject,
          ...this.settingsPayload()
        });
      });
  }

  private patchForm(project: ProjectDetail): void {
    this.settingsForm.reset(
      {
        name: project.name,
        owner: project.owner,
        dueDate: project.dueDate,
        status: project.status,
        summary: project.summary,
        description: project.description
      },
      { emitEvent: false }
    );
    this.settingsForm.markAsPristine();
  }

  private settingsPayload(): ProjectSettingsPayload {
    const formValue = this.settingsForm.getRawValue();

    return {
      name: formValue.name,
      owner: formValue.owner,
      dueDate: formValue.dueDate,
      status: formValue.status,
      summary: formValue.summary,
      description: formValue.description
    };
  }

  private formatSavedTime(savedAt: string): string {
    return new Date(savedAt).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
