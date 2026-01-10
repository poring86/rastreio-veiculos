import { PrismaService } from "src/prisma/prisma.service";

export class RoutesDriverService {
    constructor(private prismaService: PrismaService) {}
    async processRoute(dto: {route_id: string, lat: number, lng: number}) {
        return await this.prismaService.routeDriver.upsert({
            include: {
                route: true,
            },
            where: {
                id: dto.route_id,
            },
            create: {
                route_id: dto.route_id,
                points: {
                    set: {
                        location: {
                            lat: dto.lat,
                            lng: dto.lng,
                        },
                    },
                },
            },
            update: {
                points: {
                    push: {
                        location: {
                            lat: dto.lat,
                            lng: dto.lng,
                        },
                    },
                },
            },
        });
    }

}