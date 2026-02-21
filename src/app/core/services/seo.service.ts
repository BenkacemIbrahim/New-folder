import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

import { APP_DESCRIPTION, APP_TITLE, DEFAULT_ROBOTS } from '../config/app.constants';

interface SeoRouteData {
  title?: string;
  description?: string;
  robots?: string;
  keywords?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private readonly router = inject(Router);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  private initialized = false;

  initialize(): void {
    if (this.initialized) {
      return;
    }

    this.initialized = true;

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.applyRouteMeta();
    });

    this.applyRouteMeta();
  }

  private applyRouteMeta(): void {
    const activeSnapshot = this.getDeepestSnapshot(this.router.routerState.snapshot.root);
    const seoData = (activeSnapshot.data['seo'] as SeoRouteData | undefined) ?? {};

    const pageTitle = seoData.title ? `${seoData.title} | ${APP_TITLE}` : APP_TITLE;
    const description = seoData.description ?? APP_DESCRIPTION;
    const robots = seoData.robots ?? DEFAULT_ROBOTS;

    this.title.setTitle(pageTitle);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'robots', content: robots });

    if (seoData.keywords) {
      this.meta.updateTag({ name: 'keywords', content: seoData.keywords });
    }

    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:type', content: 'website' });

    this.updateCanonicalUrl();
  }

  private getDeepestSnapshot(snapshot: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
    let current = snapshot;

    while (current.firstChild) {
      current = current.firstChild;
    }

    return current;
  }

  private updateCanonicalUrl(): void {
    const canonicalHref = this.document.location
      ? `${this.document.location.origin}${this.router.url}`
      : this.router.url;

    let canonicalLinkElement = this.document.querySelector(
      'link[rel="canonical"]'
    ) as HTMLLinkElement | null;

    if (!canonicalLinkElement) {
      canonicalLinkElement = this.document.createElement('link');
      canonicalLinkElement.setAttribute('rel', 'canonical');
      this.document.head.appendChild(canonicalLinkElement);
    }

    canonicalLinkElement.setAttribute('href', canonicalHref);
  }
}
