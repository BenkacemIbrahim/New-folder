import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { LanguageSwitcherComponent } from '../../../../shared/components/language-switcher/language-switcher.component';

interface FooterLinkGroup {
  titleKey: string;
  links: { labelKey: string; href: string }[];
}

@Component({
  selector: 'app-public-footer',
  standalone: true,
  imports: [NgFor, TranslatePipe, LanguageSwitcherComponent],
  templateUrl: './public-footer.component.html',
  styleUrl: './public-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PublicFooterComponent {
  protected readonly groups: FooterLinkGroup[] = [
    {
      titleKey: 'FOOTER.GROUPS.PRODUCT',
      links: [
        { labelKey: 'FOOTER.LINKS.PLATFORM_OVERVIEW', href: '#hero' },
        { labelKey: 'FOOTER.LINKS.CORE_FEATURES', href: '#features' },
        { labelKey: 'FOOTER.LINKS.WORKFLOW_SHOWCASE', href: '#showcase' }
      ]
    },
    {
      titleKey: 'FOOTER.GROUPS.COMPANY',
      links: [
        { labelKey: 'FOOTER.LINKS.ABOUT', href: '#' },
        { labelKey: 'FOOTER.LINKS.CAREERS', href: '#' },
        { labelKey: 'FOOTER.LINKS.CONTACT_SALES', href: '#cta' }
      ]
    },
    {
      titleKey: 'FOOTER.GROUPS.RESOURCES',
      links: [
        { labelKey: 'FOOTER.LINKS.DOCUMENTATION', href: '#' },
        { labelKey: 'FOOTER.LINKS.SECURITY', href: '#' },
        { labelKey: 'FOOTER.LINKS.STATUS', href: '#' }
      ]
    },
    {
      titleKey: 'FOOTER.GROUPS.LEGAL',
      links: [
        { labelKey: 'FOOTER.LINKS.TERMS', href: '#' },
        { labelKey: 'FOOTER.LINKS.PRIVACY', href: '#' },
        { labelKey: 'FOOTER.LINKS.COMPLIANCE', href: '#' }
      ]
    }
  ];
}
