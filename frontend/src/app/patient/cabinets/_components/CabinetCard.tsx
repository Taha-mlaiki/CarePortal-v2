import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, MapPin, Users } from "lucide-react";
import { format } from "date-fns/format";
import { Button } from "@/components/ui/button";
import FavoriteButton from "./FavoritesBtn";
import Image from "next/image";
import Link from "next/link";

const DEFAULT_THUMBNAIL = "/cabinetPlacholder.svg";
export const imageSrc = "http://localhost:8000/storage/";
import { CabinetType } from "../page";

export const CabinetCard = ({
  cabinet,
}: {
  cabinet: CabinetType
}) => {

  console.log(imageSrc + cabinet.thumbnail)
  return (
    <div className="group relative overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 opacity-60 transition-opacity group-hover:opacity-70"></div>
      <div className="absolute right-3 top-3 z-10">
        <FavoriteButton cabinetId={cabinet.id} cabinetName={cabinet.name} />
      </div>
      <div className="relative flex h-full flex-col">
        {/* Thumbnail */}
        <div className="relative h-48 overflow-hidden">
          <Image
            fill
            src={imageSrc + cabinet.thumbnail || DEFAULT_THUMBNAIL}
            alt={cabinet.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <Badge className="absolute left-3 top-3 bg-brand text-white shadow-md">
            {cabinet.speciality}
          </Badge>
        </div>

        {/* Content */}
        <div className="relative flex flex-1 flex-col justify-between p-5">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">{cabinet.name}</h3>
            <div className="flex items-start gap-2 text-sm text-white/90">
              <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span>{cabinet.address}</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-white/10 p-2 backdrop-blur-sm">
              <div className="flex items-center gap-1.5 text-xs font-medium text-white/90">
                <Calendar className="h-3.5 w-3.5" />
                <span>Established</span>
              </div>
              <p className="mt-1 text-sm font-semibold text-white">
                {format(cabinet.created_at, "MMM yyyy")}
              </p>
            </div>
            <div className="rounded-lg bg-white/10 p-2 backdrop-blur-sm">
              <div className="flex items-center gap-1.5 text-xs font-medium text-white/90">
                <Users className="h-3.5 w-3.5" />
                <span>Appointments</span>
              </div>
              <p className="mt-1 text-sm font-semibold text-white">
                {/* {cabinet.totalAppointments.toLocaleString()} */}
                0
              </p>
            </div>
          </div>
          <Link href={`/patient/cabinets/${cabinet.id}`}>
            <Button className="mt-4 w-full gap-1 bg-white/20 backdrop-blur-sm hover:bg-white/30">
              View Details
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
