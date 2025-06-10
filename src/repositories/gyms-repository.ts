import { Gym, Prisma } from "../generated/prisma";

export interface FindManyNearby{
    latitude: number
    longitude: number
}

export interface GymsRepository {
    findGymById(id: string): Promise <Gym | null>
    findManyNearby(params: FindManyNearby): Promise <Gym[]>
    searchMany(query: string, page: number): Promise <Gym[]>
    create(data: Prisma.GymCreateInput): Promise <Gym>
}