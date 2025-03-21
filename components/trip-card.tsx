"use client"

import Link from "next/link"
import Image from "next/image"
import { CalendarIcon, MapPinIcon, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ConfirmationDialog } from "@/components/confirmation-dialog"
import { deleteTripFromStorage } from "@/lib/local-storage"

interface TripCardProps {
  id: string
  destination: string
  dateRange: string
  image: string
  onDelete?: () => void
}

export function TripCard({ id, destination, dateRange, image, onDelete }: TripCardProps) {
  const router = useRouter()

  const handleDelete = () => {
    deleteTripFromStorage(id)
    if (onDelete) {
      onDelete()
    } else {
      // Force a refresh if no onDelete callback is provided
      router.refresh()
    }
  }

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative h-48">
        <Image
          src={image || "/placeholder.svg?height=300&width=400"}
          alt={`Image of ${destination}`}
          fill
          className="object-cover"
        />
      </div>
      <CardContent className="p-4 flex-grow">
        <h2 className="text-xl font-semibold">{destination}</h2>
        <div className="flex items-center mt-2 text-muted-foreground">
          <CalendarIcon className="mr-2 h-4 w-4" aria-hidden="true" />
          <span>{dateRange}</span>
        </div>
        <div className="flex items-center mt-1 text-muted-foreground">
          <MapPinIcon className="mr-2 h-4 w-4" aria-hidden="true" />
          <span>{destination}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button asChild variant="outline" className="flex-1">
          <Link href={`/trips/${id}`}>
            View Trip
            <span className="sr-only">View details for trip to {destination}</span>
          </Link>
        </Button>
        <ConfirmationDialog
          title="Delete Trip"
          description="Are you sure you want to delete this trip? This action cannot be undone."
          onConfirm={handleDelete}
        >
          <Button variant="ghost" size="icon" className="text-destructive" aria-label={`Delete trip to ${destination}`}>
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </Button>
        </ConfirmationDialog>
      </CardFooter>
    </Card>
  )
}

