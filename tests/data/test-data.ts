/**
 * Test data constants used across the test suite
 */

export const TEST_USERS = {
  valid: {
    name: 'John Doe',
    email: 'john.doe@test.com',
    password: 'Test@12345',
    phone: '+94771234567',
    country: 'Sri Lanka',
  },
  invalid: {
    emptyEmail: { name: 'Test', email: '', password: 'Test@12345', phone: '123', country: 'Sri Lanka' },
    invalidEmail: { name: 'Test', email: 'notanemail', password: 'Test@12345', phone: '123', country: 'Sri Lanka' },
    shortPassword: { name: 'Test', email: 'test@test.com', password: '12345', phone: '123', country: 'Sri Lanka' },
    emptyName: { name: '', email: 'test@test.com', password: 'Test@12345', phone: '123', country: 'Sri Lanka' },
  },
};

export const ADMIN_CREDENTIALS = {
  valid: {
    email: 'admin@sooritravels.com',
    password: 'password',
  },
  invalid: {
    wrongEmail: { email: 'wrong@admin.com', password: 'password' },
    wrongPassword: { email: 'admin@sooritravels.com', password: 'wrongpassword' },
    emptyFields: { email: '', password: '' },
    sqlInjection: { email: "admin@sooritravels.com' OR '1'='1", password: "' OR '1'='1" },
  },
};

export const BOOKING_DATA = {
  valid: {
    numberOfPeople: 2,
    vehicleIndex: 0,
  },
  invalid: {
    pastDate: '2020-01-01',
    zeroPeople: 0,
    negativePeople: -1,
    exceededCapacity: 100,
  },
};

export const PACKAGE_DATA = {
  sample: {
    title: 'Test Package - Sigiriya Tour',
    description: 'A test tour package for QA automation',
    price: 15000,
    duration_days: 3,
    location: 'Sigiriya, Sri Lanka',
    status: 'active',
  },
};

export const VEHICLE_DATA = {
  sample: {
    vehicle_name: 'Test Van - Toyota HiAce',
    vehicle_type: 'Van',
    seat_capacity: 12,
    status: 'available',
  },
};

export const SERVICE_DATA = {
  sample: {
    title: 'Test Service - Airport Transfer',
    description: 'QA test service for airport transfers',
    icon_class: 'fas fa-plane',
  },
};

export const DESTINATION_DATA = {
  sample: {
    name: 'Test Destination - Kandy',
    country: 'Sri Lanka',
    description: 'QA test destination in the hill country',
  },
};

export const GALLERY_DATA = {
  sample: {
    title: 'Test Gallery - Beach Sunset',
    category: 'travel spot',
    image_url: 'https://via.placeholder.com/800x600',
  },
};

export const TESTIMONIAL_DATA = {
  sample: {
    customer_name: 'QA Test Customer',
    review_text: 'This is a test review created by the QA automation suite.',
    rating: 5,
  },
};

export const XSS_PAYLOADS = [
  '<script>alert("XSS")</script>',
  '<img src=x onerror=alert("XSS")>',
  '"><script>alert(document.cookie)</script>',
  "'; DROP TABLE users; --",
  '<svg/onload=alert("XSS")>',
  'javascript:alert("XSS")',
];

export const SQL_INJECTION_PAYLOADS = [
  "' OR '1'='1",
  "' OR '1'='1' --",
  "'; DROP TABLE users; --",
  "' UNION SELECT * FROM admins --",
  "1' AND '1'='1",
  "admin'--",
];

export const COUNTRIES = [
  'Sri Lanka', 'India', 'United Kingdom', 'United States',
  'Australia', 'Germany', 'France', 'Japan',
];

export const PAGES = {
  home: './',
  login: 'login_new.php',
  register: 'register_new.php',
  booking: 'booking.php',
  profile: 'profile_new.php',
  developers: 'developers.html',
  adminLogin: 'admin/login.php',
  adminDashboard: 'admin/dashboard.php',
};

export const API_ENDPOINTS = {
  // Public
  getPackages: 'api/get_packages.php',
  getDestinations: 'api/get_destinations.php',
  getServices: 'api/get_services.php',
  getGallery: 'api/get_gallery.php',
  getVehicles: 'api/get_vehicles.php',
  getTestimonials: 'api/get_testimonials.php',
  getUser: 'api/get_user.php',
  // User
  registerUser: 'api/register_user.php',
  updateUser: 'api/update_user.php',
  createBooking: 'api/create_booking.php',
  // Admin
  adminLogin: 'api/admin_login.php',
  adminLogout: 'api/admin_logout.php',
  adminCheckSession: 'api/admin_check_session.php',
  adminGetBookings: 'api/admin_get_bookings.php',
  adminUpdateBooking: 'api/admin_update_booking.php',
  adminPackages: 'api/admin_packages.php',
  adminVehicles: 'api/admin_vehicles.php',
  adminServices: 'api/admin_services.php',
  adminDestinations: 'api/admin_destinations.php',
  adminGallery: 'api/admin_gallery.php',
  adminTestimonials: 'api/admin_testimonials.php',
  adminMedia: 'api/admin_media.php',
};
