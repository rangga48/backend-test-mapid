export type ReportStatus = 'pending' | 'approved' | 'rejected';
export type UpdateStatus = 'approved' | 'rejected';

export interface Report {
  id: string;
  name: string;
  description: string;
  status: ReportStatus;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface CreateReportDTO {
  name: string;
  description: string;
}

export interface UpdateReportStatusDTO {
  status: UpdateStatus;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}
