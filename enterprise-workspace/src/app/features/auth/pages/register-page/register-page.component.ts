import { NgIf } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { RegisterRequest } from '../../../../core/models/auth.model';
import { AuthService } from '../../../../core/services/auth.service';
import {
  authPageAnimation,
  fieldErrorAnimation,
  staggerTextAnimation
} from '../../animations/auth-animations';
import { AuthHeroPanelComponent } from '../../components/auth-hero-panel/auth-hero-panel.component';
import { AuthModalComponent } from '../../components/auth-modal/auth-modal.component';
import { passwordMatchValidator } from '../../validators/password-match.validator';

type RegisterField = 'fullName' | 'organization' | 'email' | 'password' | 'confirmPassword';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, RouterLink, AuthHeroPanelComponent, AuthModalComponent],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
  animations: [authPageAnimation, staggerTextAnimation, fieldErrorAnimation]
})
export class RegisterPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly registerForm = this.formBuilder.nonNullable.group(
    {
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      organization: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [Validators.required, Validators.minLength(10), Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/)]
      ],
      confirmPassword: ['', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]]
    },
    { validators: [passwordMatchValidator] }
  );

  protected readonly isSubmitting = signal(false);
  protected readonly submitted = signal(false);
  protected readonly focusedField = signal<RegisterField | null>(null);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly showSuccessModal = signal(false);

  protected readonly highlights = [
    'Launch enterprise-ready workspaces with secure JWT session handling.',
    'Support onboarding with guardrails, role access, and audit-friendly state.',
    'Move from sign-up to operational dashboard in minutes.'
  ];

  protected readonly heroMetrics = [
    { label: 'Average setup', value: '14 minutes' },
    { label: 'Productivity lift', value: '+21%' }
  ];

  protected createAccount(): void {
    this.submitted.set(true);
    this.errorMessage.set(null);

    if (this.registerForm.invalid || this.hasPasswordMismatch()) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const formValue = this.registerForm.getRawValue();
    const payload: RegisterRequest = {
      fullName: formValue.fullName,
      organization: formValue.organization,
      email: formValue.email,
      password: formValue.password,
      acceptTerms: formValue.acceptTerms
    };

    this.authService
      .register(payload)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          this.showSuccessModal.set(true);
        },
        error: () => {
          this.errorMessage.set('Account provisioning failed. Please retry in a few moments.');
        }
      });
  }

  protected hasError(controlName: RegisterField): boolean {
    const control = this.registerForm.controls[controlName];
    return control.invalid && (control.touched || this.submitted());
  }

  protected hasPasswordMismatch(): boolean {
    const confirmControl = this.registerForm.controls.confirmPassword;
    return this.registerForm.hasError('passwordMismatch') &&
      (confirmControl.touched || this.submitted())
      ? true
      : false;
  }

  protected hasTermsError(): boolean {
    const control = this.registerForm.controls.acceptTerms;
    return control.invalid && (control.touched || this.submitted());
  }

  protected errorText(controlName: RegisterField): string {
    const control = this.registerForm.controls[controlName] as FormControl<string>;

    if (control.hasError('required')) {
      return 'This field is required.';
    }

    if (control.hasError('email')) {
      return 'Use a valid business email format.';
    }

    if (control.hasError('minlength')) {
      if (controlName === 'password') {
        return 'Password must be at least 10 characters.';
      }

      return 'Please enter at least 2 characters.';
    }

    if (control.hasError('pattern')) {
      return 'Include at least one uppercase letter and one number.';
    }

    return 'Please review this input.';
  }

  protected setFocusedField(field: RegisterField | null): void {
    this.focusedField.set(field);
  }

  protected completeRegistration(): void {
    this.showSuccessModal.set(false);
    void this.router.navigate(['/dashboard']);
  }
}
