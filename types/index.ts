export type UserRole = 'client' | 'vendor' | 'admin';

export type User = {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
};

export type Client = {
  id: string;
  user: User;
  full_name: string;
  phone_number: string;
  location_latitude: number | null;
  location_longitude: number | null;
  created_at: string;
  updated_at: string;
};

export type Vendor = {
  id: string;
  user: User;
  company_name: string;
  location: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
};

export type VendorSubscription = {
  id: string;
  vendor: Vendor;
  client: Client;
  subscribed_at: string;
};

export type IoTDevice = {
  id: string;
  device_id: string;
  owner_id: string | null;
  owner_name?: string;
  circle_id: string | null;
  circle_name?: string;
  mac_address: string | null;
  last_seen: string | null;
  current_level: number;
  battery_level: number;
  status: 'active' | 'inactive' | 'maintenance';
  created_at: string;
  updated_at: string;
};

export type DeviceReading = {
  id: string;
  device: IoTDevice;
  level_percent: number;
  battery_level: number | null;
  timestamp: string;
};

export type MonitoringCircle = {
  id: string;
  creator: User;
  circle_name: string;
  members: CircleMember[];
  member_count: number;
  created_at: string;
  updated_at: string;
};

export type CircleMember = {
  id: string;
  user: User;
  joined_at: string;
};

export type Notification = {
  id: string;
  user: string;
  title: string;
  body: string;
  type: 'alert' | 'info' | 'warning';
  is_read: boolean;
  created_at: string;
};

export type RefillRequestStatus = 'pending' | 'accepted' | 'in_transit' | 'completed' | 'cancelled';

export type RefillRequest = {
  id: string;
  client: Client;
  provider: Vendor | null;
  device: IoTDevice | null;
  status: RefillRequestStatus;
  requested_at: string;
  scheduled_date: string | null;
  completed_at: string | null;
  notes: string | null;
};

export type Review = {
  id: string;
  request: RefillRequest;
  rating: number;
  comment: string | null;
  created_at: string;
};

export type AuthTokens = {
  refresh: string;
  access: string;
};

export type AuthResponse = {
  user: User;
  tokens: AuthTokens;
};

export type LoginResponse = {
  access: string;
  refresh: string;
  user: User;
};

export type DeviceStats = {
  device_id: string;
  avg_level: number;
  min_level: number;
  max_level: number;
  reading_count: number;
  last_reading: string;
};

export type Cylinder = {
  id: string;
  creatorId: string;
  name: string;
  currentWeight: number;
  initialWeight: number;
  active: boolean;
  provider: string;
  sensorId: string;
  lastRefill: string;
  circle: string;
};

export type Circle = {
  id: string;
  name: string;
  cylinders: Cylinder[];
  members: User[];
  creator: User;
  joiningCode: string;
};

export type NotificationSetting = {
  userId: string;
  refillReminder: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  newCircleCylinderAlert: boolean;
  newCircleMemberAlert: boolean;
  promotions: boolean;
  alertThreshold: number;
};

export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};
