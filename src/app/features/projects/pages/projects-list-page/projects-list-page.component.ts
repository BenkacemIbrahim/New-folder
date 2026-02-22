import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { formErrorAnimation, listFilterAnimation } from '../../animations/projects-animations';
import { ProjectModalComponent } from '../../components/project-modal/project-modal.component';
import { ProjectStatusBadgeComponent } from '../../components/project-status-badge/project-status-badge.component';
import {
  CreateProjectPayload,
  ProjectStatus,
  ProjectSummary
} from '../../models/project-feature.model';
import { ProjectsApiService } from '../../services/projects-api.service';
import { TranslationService } from '../../../../core/services/translation.service';

type StatusFilter = 'All' | ProjectStatus;
type DateSortDirection = 'desc' | 'asc';

@Component({
  selector: 'app-projects-list-page',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgClass,
    RouterLink,
    DatePipe,
    ReactiveFormsModule,
    MatIconModule,
    TranslatePipe,
    PageHeaderComponent,
    ProjectStatusBadgeComponent,
    ProjectModalComponent
  ],
  templateUrl: './projects-list-page.component.html',
  styleUrl: './projects-list-page.component.scss',
  animations: [listFilterAnimation, formErrorAnimation]
})
export class ProjectsListPageComponent {
  private readonly projectsApiService = inject(ProjectsApiService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly translationService = inject(TranslationService);

  protected readonly statusFilters: StatusFilter[] = ['All', 'On Track', 'At Risk', 'Blocked'];
  protected readonly locale = this.translationService.currentLocale;

  protected readonly selectedFilter = signal<StatusFilter>('All');
  protected readonly searchTerm = signal('');
  protected readonly filterMenuOpen = signal(false);
  protected readonly dateSortDirection = signal<DateSortDirection>('desc');
  protected readonly loading = signal(false);
  protected readonly submitting = signal(false);
  protected readonly submitted = signal(false);
  protected readonly createModalOpen = signal(false);
  protected readonly formError = signal<string | null>(null);

  private readonly projects = signal<ProjectSummary[]>([]);

  protected readonly createProjectForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    owner: ['', [Validators.required, Validators.minLength(2)]],
    status: ['On Track' as ProjectStatus, [Validators.required]],
    dueDate: ['', [Validators.required]],
    summary: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(180)]]
  });

  protected readonly filteredProjects = computed(() => {
    const activeFilter = this.selectedFilter();
    const term = this.searchTerm().trim().toLowerCase();
    const direction = this.dateSortDirection();

    const visibleProjects = this.projects().filter((project) => {
      const matchesStatus = activeFilter === 'All' || project.status === activeFilter;
      const matchesSearch =
        !term ||
        project.name.toLowerCase().includes(term) ||
        project.key.toLowerCase().includes(term) ||
        project.owner.toLowerCase().includes(term);

      return matchesStatus && matchesSearch;
    });

    return [...visibleProjects].sort((leftProject, rightProject) => {
      const leftDate = new Date(leftProject.dueDate).getTime();
      const rightDate = new Date(rightProject.dueDate).getTime();
      return direction === 'asc' ? leftDate - rightDate : rightDate - leftDate;
    });
  });

  protected readonly listAnimationState = computed(
    () =>
      `${this.selectedFilter()}-${this.searchTerm()}-${this.dateSortDirection()}-${this.filteredProjects().length}`
  );

  constructor() {
    this.loadProjects();
  }

  protected setFilter(filter: StatusFilter): void {
    this.selectedFilter.set(filter);
  }

  protected setSearchTerm(term: string): void {
    this.searchTerm.set(term);
  }

  protected toggleFilterMenu(): void {
    this.filterMenuOpen.update((currentState) => !currentState);
  }

  protected toggleDateSortDirection(): void {
    this.dateSortDirection.update((currentDirection) =>
      currentDirection === 'desc' ? 'asc' : 'desc'
    );
  }

  protected openCreateModal(): void {
    this.formError.set(null);
    this.submitted.set(false);
    this.createModalOpen.set(true);
  }

  protected closeCreateModal(): void {
    this.createModalOpen.set(false);
  }

  protected createProject(): void {
    this.submitted.set(true);
    this.formError.set(null);

    if (this.createProjectForm.invalid) {
      this.createProjectForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);

    const payload: CreateProjectPayload = this.createProjectForm.getRawValue();

    this.projectsApiService
      .createProject(payload)
      .pipe(
        finalize(() => this.submitting.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (project) => {
          this.projects.update((current) => [project, ...current]);
          this.createProjectForm.reset({
            name: '',
            owner: '',
            status: 'On Track',
            dueDate: '',
            summary: ''
          });
          this.selectedFilter.set('All');
          this.searchTerm.set('');
          this.createModalOpen.set(false);
        },
        error: () => {
          this.formError.set('PROJECTS.FORM_ERRORS.CREATE_FAILED');
        }
      });
  }

  protected hasControlError(
    controlName: 'name' | 'owner' | 'dueDate' | 'summary'
  ): boolean {
    const control = this.createProjectForm.controls[controlName];
    return control.invalid && (control.touched || this.submitted());
  }

  protected controlErrorText(controlName: 'name' | 'owner' | 'dueDate' | 'summary'): string {
    const control = this.createProjectForm.controls[controlName];

    if (control.hasError('required')) {
      return 'PROJECTS.FORM_ERRORS.REQUIRED';
    }

    if (control.hasError('minlength')) {
      return controlName === 'summary'
        ? 'PROJECTS.FORM_ERRORS.SUMMARY_MIN'
        : 'PROJECTS.FORM_ERRORS.MIN_GENERIC';
    }

    if (control.hasError('maxlength')) {
      return 'PROJECTS.FORM_ERRORS.SUMMARY_MAX';
    }

    return 'PROJECTS.FORM_ERRORS.GENERIC';
  }

  protected statusFilterLabelKey(filter: StatusFilter): string {
    switch (filter) {
      case 'All':
        return 'PROJECTS.FILTERS.ALL';
      case 'On Track':
        return 'PROJECTS.STATUS.ON_TRACK';
      case 'At Risk':
        return 'PROJECTS.STATUS.AT_RISK';
      case 'Blocked':
        return 'PROJECTS.STATUS.BLOCKED';
    }
  }

  protected trackByProject(_index: number, project: ProjectSummary): string {
    return project.id;
  }

  private loadProjects(): void {
    this.loading.set(true);

    this.projectsApiService
      .getProjects()
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((projects) => this.projects.set(projects));
  }
}
