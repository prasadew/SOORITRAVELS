import { APIRequestContext } from '@playwright/test';
import { config } from './config';

/**
 * API helper for making requests to SOORI Travels backend
 */
export class ApiHelper {
  constructor(private request: APIRequestContext) {}

  // ─── Public APIs ───

  async getPackages(id?: number) {
    const url = id
      ? `${config.api.baseUrl}/get_packages.php?id=${id}`
      : `${config.api.baseUrl}/get_packages.php`;
    return this.request.get(url);
  }

  async getDestinations() {
    return this.request.get(`${config.api.baseUrl}/get_destinations.php`);
  }

  async getServices() {
    return this.request.get(`${config.api.baseUrl}/get_services.php`);
  }

  async getGallery(category?: string) {
    const url = category
      ? `${config.api.baseUrl}/get_gallery.php?category=${encodeURIComponent(category)}`
      : `${config.api.baseUrl}/get_gallery.php`;
    return this.request.get(url);
  }

  async getVehicles(date?: string) {
    const url = date
      ? `${config.api.baseUrl}/get_vehicles.php?date=${date}`
      : `${config.api.baseUrl}/get_vehicles.php`;
    return this.request.get(url);
  }

  async getTestimonials() {
    return this.request.get(`${config.api.baseUrl}/get_testimonials.php`);
  }

  async getUser(firebaseUid: string) {
    return this.request.get(`${config.api.baseUrl}/get_user.php?firebase_uid=${firebaseUid}`);
  }

  // ─── User APIs ───

  async registerUser(data: {
    firebase_uid: string;
    name: string;
    email: string;
    phone?: string;
    country?: string;
  }) {
    return this.request.post(`${config.api.baseUrl}/register_user.php`, {
      data,
    });
  }

  async updateUser(data: {
    firebase_uid: string;
    name?: string;
    phone?: string;
    country?: string;
  }) {
    return this.request.post(`${config.api.baseUrl}/update_user.php`, {
      data,
    });
  }

  // ─── Booking APIs ───

  async createBooking(data: {
    firebase_uid: string;
    package_id: number;
    vehicle_id: number;
    travel_date: string;
    number_of_people: number;
  }) {
    return this.request.post(`${config.api.baseUrl}/create_booking.php`, {
      data,
    });
  }

  // ─── Admin APIs ───

  async adminLogin(email?: string, password?: string) {
    return this.request.post(`${config.api.baseUrl}/admin_login.php`, {
      data: {
        email: email ?? config.admin.email,
        password: password ?? config.admin.password,
      },
    });
  }

  async adminLogout() {
    return this.request.post(`${config.api.baseUrl}/admin_logout.php`);
  }

  async adminCheckSession() {
    return this.request.get(`${config.api.baseUrl}/admin_check_session.php`);
  }

  async adminGetBookings(filters?: Record<string, string>) {
    const params = new URLSearchParams(filters);
    const url = filters
      ? `${config.api.baseUrl}/admin_get_bookings.php?${params}`
      : `${config.api.baseUrl}/admin_get_bookings.php`;
    return this.request.get(url);
  }

  async adminUpdateBooking(bookingId: number, status: string) {
    return this.request.post(`${config.api.baseUrl}/admin_update_booking.php`, {
      data: { booking_id: bookingId, status },
    });
  }

  // ─── Admin CRUD Helpers ───

  async adminCrudGet(resource: string, id?: number) {
    const url = id
      ? `${config.api.baseUrl}/admin_${resource}.php?id=${id}`
      : `${config.api.baseUrl}/admin_${resource}.php`;
    return this.request.get(url);
  }

  async adminCrudCreate(resource: string, data: Record<string, any>) {
    return this.request.post(`${config.api.baseUrl}/admin_${resource}.php`, {
      data,
    });
  }

  async adminCrudUpdate(resource: string, data: Record<string, any>) {
    return this.request.put(`${config.api.baseUrl}/admin_${resource}.php`, {
      data,
    });
  }

  async adminCrudDelete(resource: string, id: number) {
    return this.request.delete(`${config.api.baseUrl}/admin_${resource}.php`, {
      data: { id },
    });
  }
}
