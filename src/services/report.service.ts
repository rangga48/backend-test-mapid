import { query } from '../config/database';
import { Report, CreateReportDTO, UpdateStatus } from '../types/report.types';

export class ReportService {
  /**
   * Create a new field report with default status 'pending'
   */
  async createReport(data: CreateReportDTO): Promise<Report> {
    const text = `
      INSERT INTO reports (name, description, status)
      VALUES ($1, $2, 'pending')
      RETURNING id, name, description, status, created_at, updated_at;
    `;
    const values = [data.name.trim(), data.description.trim()];
    const result = await query(text, values);
    return result.rows[0];
  }

  /**
   * Get all field reports ordered by created_at DESC (newest first)
   */
  async getAllReports(): Promise<Report[]> {
    const text = `
      SELECT id, name, description, status, created_at, updated_at
      FROM reports
      ORDER BY created_at DESC;
    `;
    const result = await query(text);
    return result.rows;
  }

  /**
   * Find a field report by its UUID
   */
  async getReportById(id: string): Promise<Report | null> {
    const text = `
      SELECT id, name, description, status, created_at, updated_at
      FROM reports
      WHERE id = $1;
    `;
    const result = await query(text, [id]);
    return result.rows[0] || null;
  }

  /**
   * Update the status of a report (approve or reject) and refresh updated_at
   */
  async updateReportStatus(id: string, status: UpdateStatus): Promise<Report | null> {
    const text = `
      UPDATE reports
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING id, name, description, status, created_at, updated_at;
    `;
    const result = await query(text, [status, id]);
    return result.rows[0] || null;
  }
}

export const reportService = new ReportService();
