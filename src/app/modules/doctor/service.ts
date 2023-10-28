import { Doctor, Role } from "@prisma/client";
import { hashPassword } from "../../../helpers/bcrypt";
import prisma from "../../../constants/prisma";
import ApiError from "../../../errors/ApiError";
import { select } from "./constant";
import { DoctorWithoutPassword } from "./interface";

const createDoctor = async (data: Doctor): Promise<Doctor> => {
  let result;

  const isExist = await prisma.user.findFirst({
    where: { name: data.name, email: data.email },
  });

  if (isExist) throw new ApiError(409, "The doctor is already exists !!");

  data.password = await hashPassword(data.password);

  await prisma.$transaction(async (tx) => {
    await tx.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        role: Role.DOCTOR,
        contactNo: data?.contactNo,
        address: data?.address,
        image: data?.image,
      },
    });

    result = await tx.doctor.create({ data });
  });

  if (!result) throw new ApiError(400, "Failed to create doctor !!");

  return result;
};

const getDoctor = async (id: string): Promise<DoctorWithoutPassword> => {
  const result = await prisma.doctor.findUnique({ where: { id }, select });

  if (!result) throw new ApiError(404, "Doctor not found !!");

  return result;
};

const getDoctors = async (): Promise<DoctorWithoutPassword[]> => {
  const result = await prisma.doctor.findMany({ select });

  return result;
};

export const DoctorService = { createDoctor, getDoctor, getDoctors };
