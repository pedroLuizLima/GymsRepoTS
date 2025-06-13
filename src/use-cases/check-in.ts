import { CheckIn } from "../generated/prisma";
import { CheckInsRepository } from "../repositories/check-ins-repository";
import { GymsRepository } from "../repositories/gyms-repository";
import { getDistanceBetweenCoordinates } from "../utils/calculate-distance-between-coordinates";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { MaxDistanceError } from "./errors/max-distance-error";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins-error";

interface CheckInUseCaseRequest {
    userId: string
    gymId: string
    userLatitude: number
    userLongitude: number
}

interface CheckInUseCaseResponse {
    checkIn: CheckIn
}

export class CheckInUseCase {
    constructor(
        private checkinsRepository: CheckInsRepository,
        private gymsRepository: GymsRepository
    ){}

    async execute({ userId, gymId, userLatitude, userLongitude }: CheckInUseCaseRequest): Promise <CheckInUseCaseResponse> {
        const gym = await this.gymsRepository.findGymById(gymId)

        if(!gym) {
            throw new ResourceNotFoundError()
        }

        const distance = getDistanceBetweenCoordinates(
            {latitude: userLatitude, longitude: userLongitude},
            {latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber()}
        )

        const MAX_DISTANCE_IN_KILOMETERS = 0.1

        if(distance > MAX_DISTANCE_IN_KILOMETERS) {
            throw new MaxDistanceError
        }

        const checkInOnSameDay = await this.checkinsRepository.findByUserIdOnDate(userId, new Date())

        if (checkInOnSameDay){
            throw new MaxNumberOfCheckInsError
        }

        const checkIn = await this.checkinsRepository.create({
            userId: userId,
            gymId: gymId
        })

        return {
            checkIn
        }
    }
}

