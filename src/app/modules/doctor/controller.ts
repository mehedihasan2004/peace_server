import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { DoctorService } from "./service";
import sendResponse from "../../../shared/sendResponse";
import { Doctor } from "@prisma/client";
import { DoctorWithoutPassword } from "./interface";
import pick from "../../../shared/pick";
import { doctorFilterableFields } from "./constant";
import { paginationFields } from "../../../constants/pagination";

const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const result = await DoctorService.createDoctor(req.body);

  sendResponse<Doctor>(res, {
    statusCode: 200,
    success: true,
    message: "Doctor created successfully !",
    data: result,
  });
});

const getDoctor = catchAsync(async (req: Request, res: Response) => {
  const result = await DoctorService.getDoctor(req.params.id);

  sendResponse<Omit<Doctor, "password">>(res, {
    statusCode: 200,
    success: true,
    message: "Doctor retrieved successfully !",
    data: result,
  });
});

const getDoctors = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, doctorFilterableFields);
  const options = pick(req.query, paginationFields);

  const result = await DoctorService.getDoctors(filters, options);

  sendResponse<DoctorWithoutPassword[]>(res, {
    statusCode: 200,
    success: true,
    message: "Doctors retrieved successfully !",
    data: result,
  });
});

export const DoctorController = { createDoctor, getDoctor, getDoctors };
