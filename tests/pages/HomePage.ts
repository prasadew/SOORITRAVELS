import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  // Hero Section
  readonly heroSection: Locator;
  readonly heroCta: Locator;

  // About Section
  readonly aboutSection: Locator;

  // Packages Section
  readonly packagesSection: Locator;
  readonly packagesContainer: Locator;
  readonly packageCards: Locator;

  // Destinations Section
  readonly destinationsSection: Locator;
  readonly destinationsContainer: Locator;
  readonly destinationCards: Locator;

  // Services Section
  readonly servicesSection: Locator;
  readonly servicesContainer: Locator;

  // Gallery Section
  readonly gallerySection: Locator;
  readonly galleryContainer: Locator;
  readonly galleryItems: Locator;

  // Testimonials Section
  readonly testimonialsSection: Locator;
  readonly testimonialsContainer: Locator;

  // Video Section
  readonly videoSection: Locator;

  constructor(page: Page) {
    super(page);
    this.heroSection = page.locator('#home, section.home');
    this.heroCta = page.locator('.home .btn, .home a.btn');
    this.aboutSection = page.locator('#about, .about');
    this.packagesSection = page.locator('#packages, .packages');
    this.packagesContainer = page.locator('#packages-container');
    this.packageCards = page.locator('#packages-container .pkg-card');
    this.destinationsSection = page.locator('#destination, .destination');
    this.destinationsContainer = page.locator('#destinations-container');
    this.destinationCards = page.locator('#destinations-container .box');
    this.servicesSection = page.locator('#services, .services');
    this.servicesContainer = page.locator('#services-container');
    this.gallerySection = page.locator('#gallery, .gallery');
    this.galleryContainer = page.locator('#gallery-container');
    this.galleryItems = page.locator('#gallery-container .box, #gallery-container img');
    this.testimonialsSection = page.locator('#reviews, .review');
    this.testimonialsContainer = page.locator('#testimonials-container');
    this.videoSection = page.locator('#videos, .video-section, .video-carousel');
  }

  async navigate() {
    await this.goto('./');
  }

  async getPackageCount(): Promise<number> {
    await this.packagesContainer.waitFor({ state: 'visible', timeout: 10000 });
    return this.packageCards.count();
  }

  async getDestinationCount(): Promise<number> {
    await this.destinationsContainer.waitFor({ state: 'visible', timeout: 10000 });
    return this.destinationCards.count();
  }

  async getGalleryItemCount(): Promise<number> {
    await this.galleryContainer.waitFor({ state: 'visible', timeout: 10000 });
    return this.galleryItems.count();
  }

  async clickPackageCard(index: number = 0) {
    const card = this.packageCards.nth(index);
    await card.scrollIntoViewIfNeeded();
    await card.click();
  }

  async scrollToSection(section: Locator) {
    await section.scrollIntoViewIfNeeded();
  }

  async isSectionVisible(section: Locator): Promise<boolean> {
    return section.isVisible();
  }
}
