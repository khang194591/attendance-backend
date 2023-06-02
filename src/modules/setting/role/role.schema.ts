import { array, object, string } from 'yup'

export const roleSchema = object({
  name: string().required(),
  permissions: array().of(string()).required(),
})
