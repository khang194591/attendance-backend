import { DATE_FORMAT, TIME_FORMAT, baseQuerySchema } from '@/common/constants'
import dayjs from 'dayjs'
import { number, object, ref, string } from 'yup'

export const attendanceSchema = object({
  userId: number().positive().required(),
  date: string()
    .required()
    .test((val) => dayjs(val, DATE_FORMAT).isValid()),
  checkIn: string()
    .required()
    .test((val) => dayjs(val, TIME_FORMAT).isValid()),
  checkOut: string()
    .required()
    .test((val) => dayjs(val, TIME_FORMAT).isValid())
    .test((val) => val.localeCompare(String(ref('checkIn'))) < 0),
})

export const querySchema = baseQuerySchema.concat(
  object({
    startDate: string()
      .required()
      .test((val) => dayjs(val, DATE_FORMAT).isValid()),
    endDate: string()
      .required()
      .test((val) => dayjs(val, DATE_FORMAT).isValid()),
  }),
)
