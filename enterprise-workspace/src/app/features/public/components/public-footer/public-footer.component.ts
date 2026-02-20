import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

interface FooterLinkGroup {
  title: string;
  links: { label: string; href: string }[];
}

@Component({
  selector: 'app-public-footer',
  standalone: true,
  imports: [NgFor],
  templateUrl: './public-footer.component.html',
  styleUrl: './public-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PublicFooterComponent {
  protected readonly groups: FooterLinkGroup[] = [
    {
      title: 'Product',
      links: [
        { label: 'Platform Overview', href: '#hero' },
        { label: 'Core Features', href: '#features' },
        { label: 'Workflow Showcase', href: '#showcase' }
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Contact Sales', href: '#cta' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', href: '#' },
        { label: 'Security', href: '#' },
        { label: 'Status', href: '#' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { label: 'Terms', href: '#' },
        { label: 'Privacy', href: '#' },
        { label: 'Compliance', href: '#' }
      ]
    }
  ];
}

