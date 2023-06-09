import { Gym, Prisma } from "@prisma/client";
import { GymsRepository, findManyNearbyParams } from "../gyms-repository";
import { randomUUID } from "crypto";
import { Decimal } from "@prisma/client/runtime";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = [];

  async findManyNearby(params: findManyNearbyParams) {
    return this.items.filter((item) => {
      const distance = getDistanceBetweenCoordinates(
        { latitude: params.latitude, longitude: params.longitude },
        {
          latitude: item.latitude.toNumber(),
          longitude: item.longitude.toNumber(),
        }
      );

      return distance <= 10;
    });
  }

  async searchMany(query: string, page: number) {
    const gyms = this.items
      .filter((gym) => gym.name.includes(query))
      .slice((page - 1) * 20, page * 20);

    return gyms;
  }

  async findById(id: string) {
    const gym = this.items.find((gym) => gym.id === id);

    if (!gym) {
      return null;
    }

    return gym;
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      name: data.name,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Decimal(data.latitude.toString()),
      longitude: new Decimal(data.longitude.toString()),
    };

    this.items.push(gym);

    return gym;
  }
}
