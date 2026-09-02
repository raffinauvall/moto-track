export type Motor = {
  id: string;
  user_id: string;
  name: string;
  brand: string;
  is_active: boolean;
  created_at: string;
};

export type MotorComponent = {
  id: string;
  motor_id: string;
  name: string;
  current_value: number;
  max_value: number;
  is_pinned: boolean;
  created_at?: string;
};

export type MotorModel = {
  id: string;
  name: string;
  brand: string;
};

export type Ride = {
  id: string;
  motor_id: string;
  distance: number;
  start_time: string;
  end_time: string;
  duration: number;
};

export type RidePoint = {
  latitude: number;
  longitude: number;
  recorded_at: string;
};

export type ServiceHistory = {
  id: string;
  motor_id: string;
  motor_name?: string;
  service_type: string;
  total_components: number;
  service_date: string;
};

export type ServiceDetail = {
  id: string;
  motor_id: string;
  service_history_id: string;
  component_id: string;
  component_name: string;
  km_at_service: number;
};

export type AppUser = {
  id: string;
  email?: string;
  user_metadata?: {
    name?: string;
    [key: string]: unknown;
  };
};

export type ToastPayload = {
  type: 'success' | 'error';
  title: string;
  message: string;
};
