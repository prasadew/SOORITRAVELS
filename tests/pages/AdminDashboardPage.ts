import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class AdminDashboardPage extends BasePage {
  // Sidebar Navigation
  readonly sidebar: Locator;
  readonly bookingsNav: Locator;
  readonly packagesNav: Locator;
  readonly vehiclesNav: Locator;
  readonly servicesNav: Locator;
  readonly destinationsNav: Locator;
  readonly galleryNav: Locator;
  readonly testimonialsNav: Locator;
  readonly mediaNav: Locator;
  readonly logoutBtn: Locator;

  // Sections
  readonly bookingsSection: Locator;
  readonly packagesSection: Locator;
  readonly vehiclesSection: Locator;
  readonly servicesSection: Locator;
  readonly destinationsSection: Locator;
  readonly gallerySection: Locator;
  readonly testimonialsSection: Locator;
  readonly mediaSection: Locator;

  // Common Elements
  readonly addNewButton: Locator;
  readonly searchInput: Locator;
  readonly dataTable: Locator;
  readonly modal: Locator;
  readonly modalTitle: Locator;
  readonly modalSaveBtn: Locator;
  readonly modalCloseBtn: Locator;
  readonly deleteConfirmBtn: Locator;

  // Status Filters
  readonly statusFilter: Locator;
  readonly dateFilter: Locator;

  constructor(page: Page) {
    super(page);
    this.sidebar = page.locator('.sidebar, #sidebar, .admin-sidebar');
    this.bookingsNav = page.locator('[data-section="bookings"], #nav-bookings');
    this.packagesNav = page.locator('[data-section="packages"], #nav-packages');
    this.vehiclesNav = page.locator('[data-section="vehicles"], #nav-vehicles');
    this.servicesNav = page.locator('[data-section="services"], #nav-services');
    this.destinationsNav = page.locator('[data-section="destinations"], #nav-destinations');
    this.galleryNav = page.locator('[data-section="gallery"], #nav-gallery');
    this.testimonialsNav = page.locator('[data-section="testimonials"], #nav-testimonials');
    this.mediaNav = page.locator('[data-section="media"], #nav-media');
    this.logoutBtn = page.locator('#logout-btn, .logout-btn, [onclick*="logout"]');

    this.bookingsSection = page.locator('#bookings-section, .bookings-section');
    this.packagesSection = page.locator('#packages-section, .packages-section');
    this.vehiclesSection = page.locator('#vehicles-section, .vehicles-section');
    this.servicesSection = page.locator('#services-section, .services-section');
    this.destinationsSection = page.locator('#destinations-section, .destinations-section');
    this.gallerySection = page.locator('#gallery-section, .gallery-section');
    this.testimonialsSection = page.locator('#testimonials-section, .testimonials-section');
    this.mediaSection = page.locator('#media-section, .media-section');

    this.addNewButton = page.locator('.add-new-btn, #add-new, button:has-text("Add")');
    this.searchInput = page.locator('.search-input, #search, input[type="search"]');
    this.dataTable = page.locator('.data-table, table, .admin-table');
    this.modal = page.locator('.modal, #modal, .overlay');
    this.modalTitle = page.locator('.modal-title, .modal h2, .modal h3');
    this.modalSaveBtn = page.locator('.modal button[type="submit"], .modal .save-btn');
    this.modalCloseBtn = page.locator('.modal .close, .modal .close-btn, .modal-close');
    this.deleteConfirmBtn = page.locator('.confirm-delete, #confirm-delete');
    this.statusFilter = page.locator('#status-filter, select[name="status"]');
    this.dateFilter = page.locator('#date-filter, input[name="date"]');
  }

  async navigate() {
    await this.goto('admin/dashboard.php');
  }

  async navigateToSection(section: string) {
    const navMap: Record<string, Locator> = {
      bookings: this.bookingsNav,
      packages: this.packagesNav,
      vehicles: this.vehiclesNav,
      services: this.servicesNav,
      destinations: this.destinationsNav,
      gallery: this.galleryNav,
      testimonials: this.testimonialsNav,
      media: this.mediaNav,
    };
    await navMap[section]?.click();
  }

  async logout() {
    await this.logoutBtn.click();
  }

  async getTableRowCount(): Promise<number> {
    return this.dataTable.locator('tbody tr').count();
  }

  async searchTable(query: string) {
    await this.searchInput.fill(query);
    await this.page.waitForTimeout(500);
  }

  async openAddModal() {
    await this.addNewButton.click();
    await this.modal.waitFor({ state: 'visible' });
  }

  async closeModal() {
    await this.modalCloseBtn.click();
  }

  async isSectionActive(section: Locator): Promise<boolean> {
    return section.isVisible();
  }
}
