import { hashSync } from 'bcrypt'
import { Action, Resource } from '../../src/common/interfaces'
import { Gender, PrismaClient, Status } from '@prisma/client'

const prisma = new PrismaClient()

const seedRole = async () => {
  try {
    const permissions = Object.values(Resource)
      .map((resource) => {
        return Object.values(Action).map((action) => `${resource}#${action}`)
      })
      .flatMap((item) => item)
    const superAdminRole = await prisma.role.create({
      data: {
        name: 'super_admin',
        permissions,
      },
    })
    await prisma.user.createMany({
      data: [
        {
          email: 'khang194591@gmail.com',
          password: hashSync('@sang.123', 10),
          name: 'Trịnh Đức Khang',
          phone: '0862612659',
          birthDay: '2001-11-03',
          gender: Gender.male,
          status: Status.active,
          avatarUrl: 'https://lh3.googleusercontent.com/a/AGNmyxYJsfiCILLkigCHBtHFni2m4Et5LS4oZ0P-684G=s96-c',
          roleId: superAdminRole.id,
          isSuper: true,
        },
        {
          email: 'khang.td194591@sis.hust.edu.vn.',
          password: hashSync('@sang.123', 10),
          name: 'Trịnh Khang',
          phone: '0862612658',
          birthDay: '2001-11-03',
          gender: Gender.male,
          status: Status.active,
          avatarUrl: 'https://lh3.googleusercontent.com/a/AGNmyxYJsfiCILLkigCHBtHFni2m4Et5LS4oZ0P-684G=s96-c',
          roleId: superAdminRole.id,
          isSuper: false,
        },
      ],
    })
  } catch (error) {
    console.log(error)
  }
}

export default seedRole
