import { Gym, Prisma } from "../../generated/prisma";
import { prisma } from "../../lib/prisma";
import { FindManyNearby, GymsRepository } from "../gyms-repository";

export class PrismaGymsRepository implements GymsRepository{
    async findGymById(id: string) {
        const gym = await prisma.gym.findUnique({
            where: {
                id: id
            }
        })

        return gym
    }

    async findManyNearby({ latitude, longitude }: FindManyNearby) {
        const gyms = await prisma.$queryRaw<Gym[]>`
        SELECT * from gyms
            WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
        `

        return gyms
    }

    async searchMany(query: string, page: number) {
        const gyms = await prisma.gym.findMany({
            where: {
                title: {
                    contains: query
                }
            },
            take: 20,
            skip: (page - 1) * 20
        })

        return gyms
    }

    async create(data: Prisma.GymCreateInput) {
        const gym = await prisma.gym.create({
            data: data
        })

        return gym
    }

}