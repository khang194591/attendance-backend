import { DATE_FORMAT, TIME_FORMAT } from '../../src/common/constants'
import { random_bm } from '../../src/common/utils'
import { faker } from '@faker-js/faker/locale/vi'
import { Gender, PrismaClient, Status, User } from '@prisma/client'
import { hashSync } from 'bcrypt'
import dayjs from 'dayjs'
import 'dotenv/config'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

const prisma = new PrismaClient()

const seedUser = async () => {
  try {
    const userRole = await prisma.role.create({
      data: {
        name: 'user',
        permissions: [],
      },
    })
    const promises = []
    for (let i = 0; i < 15; i++) {
      const randomNumber = 1 + parseInt((Math.random() * 120).toString())
      const gender = Math.random() < 0.5 ? Gender.male : Gender.female
      const firstName = faker.person.firstName(gender)
      const lastName = faker.person.lastName(gender)
      const promise = await prisma.user.create({
        data: {
          email: faker.internet.email({ firstName, lastName, provider: 'ams.dev' }),
          password: hashSync('123456', 10),
          name: `${lastName} ${firstName}`,
          phone: faker.phone.number('0#########'),
          gender,
          status: Status.pending,
          province: 'Thành phố Hà Nội',
          district: 'Quận Hai Bà Trưng',
          ward: 'Phường Bách Khoa',
          bank: 'Viettel Money',
          birthDay: dayjs(faker.date.birthdate({ min: 18, max: 40, mode: 'age' })).format(DATE_FORMAT),
          roleId: userRole.id,
          avatarUrl: `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${randomNumber}.png`,
        },
      })
      promises.push(promise)
    }
    const users = (await Promise.all(promises)) as User[]
    users.forEach(async (user) => {
      const startMonth = dayjs().startOf('month')
      for (let i = 0; i < dayjs().daysInMonth(); i++) {
        const date = startMonth.add(i, 'day').format(DATE_FORMAT)
        const day = dayjs(date, DATE_FORMAT).get('day')
        const checkIn = dayjs('08:20:00', TIME_FORMAT, false).add(random_bm(60), 'minute').format(TIME_FORMAT)
        const checkOut = dayjs('17:40:00', TIME_FORMAT, false).add(random_bm(60), 'minute').format(TIME_FORMAT)
        if (Math.random() < 0.9 && day % 6 !== 0) {
          await prisma.attendance.create({ data: { checkIn, checkOut, date, userId: user.id } })
        }
      }
    })
  } catch (error) {
    console.log(error)
  }
}

export default seedUser
