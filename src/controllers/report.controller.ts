import { Request, Response, NextFunction } from 'express';
import { reportService } from '../services/report.service';
import { ApiResponse, Report, UpdateStatus } from '../types/report.types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export class ReportController {
  /**
   * POST /api/reports
   * Create a new field report
   */
  async createReport(
    req: Request,
    res: Response<ApiResponse<Report>>,
    next: NextFunction
  ): Promise<void> {
    try {
      const { name, description } = req.body;
      const errors: string[] = [];

      if (!name || typeof name !== 'string' || name.trim() === '') {
        errors.push("Field 'name' is required and must not be empty");
      } else if (name.trim().length > 150) {
        errors.push("Field 'name' must not exceed 150 characters");
      }

      if (!description || typeof description !== 'string' || description.trim() === '') {
        errors.push("Field 'description' is required and must not be empty");
      }

      if (errors.length > 0) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors,
        });
        return;
      }

      const report = await reportService.createReport({
        name: name.trim(),
        description: description.trim(),
      });

      res.status(201).json({
        success: true,
        message: 'Report created successfully',
        data: report,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/reports
   * Retrieve all field reports (ordered by newest first)
   */
  async getReports(
    _req: Request,
    res: Response<ApiResponse<Report[]>>,
    next: NextFunction
  ): Promise<void> {
    try {
      const reports = await reportService.getAllReports();

      res.status(200).json({
        success: true,
        message: 'Reports retrieved successfully',
        data: reports,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/reports/:id/status
   * Update report status to approved or rejected
   */
  async updateReportStatus(
    req: Request,
    res: Response<ApiResponse<Report>>,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!id || !UUID_REGEX.test(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid report ID format. Expected a valid UUID',
        });
        return;
      }

      const allowedStatuses: UpdateStatus[] = ['approved', 'rejected'];
      if (!status || !allowedStatuses.includes(status as UpdateStatus)) {
        res.status(400).json({
          success: false,
          message: "Validation failed: 'status' must be either 'approved' or 'rejected'",
          errors: ["'status' must be either 'approved' or 'rejected'"],
        });
        return;
      }

      const updatedReport = await reportService.updateReportStatus(
        id,
        status as UpdateStatus
      );

      if (!updatedReport) {
        res.status(404).json({
          success: false,
          message: `Report with ID '${id}' not found`,
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: `Report status updated to ${status} successfully`,
        data: updatedReport,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const reportController = new ReportController();
