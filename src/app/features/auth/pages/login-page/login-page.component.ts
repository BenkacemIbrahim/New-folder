import { NgIf } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { LoginRequest } from '../../../../core/models/auth.model';
import { AuthService } from '../../../../core/services/auth.service';
import {
  authPageAnimation,
  fieldErrorAnimation,
  staggerTextAnimation
} from '../../animations/auth-animations';
import { AuthHeroPanelComponent } from '../../components/auth-hero-panel/auth-hero-panel.component';
import { AuthModalComponent } from '../../components/auth-modal/auth-modal.component';

type LoginField = 'email' | 'password';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    RouterLink,
    AuthHeroPanelComponent,
    AuthModalComponent,
    TranslatePipe
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  animations: [authPageAnimation, staggerTextAnimation, fieldErrorAnimation]
})
export class LoginPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly loginForm = this.formBuilder.nonNullable.group({
    email: ['team@enterprise.io', [Validators.required, Validators.email]],
    password: ['workspace', [Validators.required, Validators.minLength(8)]],
    rememberMe: [true]
  });

  protected readonly isSubmitting = signal(false);
  protected readonly submitted = signal(false);
  protected readonly focusedField = signal<LoginField | null>(null);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly showDemoModal = signal(false);

  protected signIn(): void {
    this.submitted.set(true);
    this.errorMessage.set(null);

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const payload: LoginRequest = this.loginForm.getRawValue();
    this.authService
      .login(payload)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          void this.router.navigate(['/dashboard']);
        },
        error: () => {
          this.errorMessage.set('AUTH.LOGIN.ERRORS.AUTH_FAILED');
        }
      });
  }

  protected hasError(controlName: LoginField): boolean {
    const control = this.loginForm.controls[controlName];
    return control.invalid && (control.touched || this.submitted());
  }

  protected errorText(controlName: LoginField): string {
    const control = this.loginForm.controls[controlName] as FormControl<string>;

    if (control.hasError('required')) {
      return controlName === 'email'
        ? 'AUTH.LOGIN.ERRORS.EMAIL_REQUIRED'
        : 'AUTH.LOGIN.ERRORS.PASSWORD_REQUIRED';
    }

    if (control.hasError('email')) {
      return 'AUTH.LOGIN.ERRORS.EMAIL_INVALID';
    }

    if (control.hasError('minlength')) {
      return 'AUTH.LOGIN.ERRORS.PASSWORD_MIN';
    }

    return 'AUTH.LOGIN.ERRORS.GENERIC';
  }

  protected setFocusedField(field: LoginField | null): void {
    this.focusedField.set(field);
  }

  protected openDemoModal(): void {
    this.showDemoModal.set(true);
  }

  protected closeDemoModal(): void {
    this.showDemoModal.set(false);
  }

  protected fillDemoCredentials(): void {
    this.loginForm.patchValue({
      email: 'team@enterprise.io',
      password: 'workspace',
      rememberMe: true
    });
    this.closeDemoModal();
  }
}
