
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  email: string;
  name: string;
  password?: string;
  role: UserRole;
  enrolledCourses: string[];
  beauticianAccessExpiry?: string;
}

export interface YogaCourse {
  id: string;
  name: string;
  price: number;
  description: string;
  enabled: boolean;
}

export interface Batch {
  id: string;
  name: string;
  time: string;
  enabled: boolean;
  isKids?: boolean;
}

export interface BeauticianVideo {
  url: string;
  title: string;
  description: string;
}

export interface AdminSettings {
  yogaRegistrationsOpen: boolean;
  registrationClosingDate: string;
  registrationOpeningDate: string;
  whatsappGroupLink: string;
  beauticianEnabled: boolean;
  beauticianPrice: number;
  beauticianVideos: BeauticianVideo[];
  adminPassword?: string;
  smtpConfig: {
    server: string;
    port: number;
    user: string;
    pass: string;
  };
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  batchId: string;
  paymentId: string;
  date: string;
  courseName: string;
  batchName: string;
  userName: string;
}
