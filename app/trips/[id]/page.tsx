"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { CalendarIcon, MapPinIcon, PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TripItinerary } from "@/components/trip-itinerary"
import { FlightsList } from "@/components/flights-list"
import { AccommodationsList } from "@/components/accommodations-list"
import { getTrip } from "@/lib/data"
import type { Trip } from "@/lib/data"

export default function TripDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [trip, setTrip] = useState<Trip | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get trip from local storage
    const tripData = getTrip(params.id)

    if (tripData) {
      setTrip(tripData)
    } else {
      // If trip not found, redirect to trips page
      router.push("/trips")
    }

    setLoading(false)
  }, [params.id, router])

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex justify-center items-center h-64" aria-live="polite" aria-busy="true">
          <p>Loading trip details...</p>
        </div>
      </div>
    )
  }

  if (!trip) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold" id="trip-heading">
          {trip.name}
        </h1>
        <Button variant="outline" asChild>
          <Link href="/">
            Back to Trips
            <span className="sr-only">Return to all trips</span>
          </Link>
        </Button>
      </div>

      <div className="relative h-[200px] sm:h-[300px] rounded-lg overflow-hidden mb-8">
        <Image
          src={trip.image || "/placeholder.svg?height=400&width=800"}
          alt={`Image of ${trip.destination}`}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white">{trip.destination}</h2>
          <div className="flex items-center mt-2 text-white/80">
            <CalendarIcon className="mr-2 h-4 w-4" aria-hidden="true" />
            <span>
              {new Date(trip.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} -{" "}
              {new Date(trip.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs defaultValue="itinerary">
            <TabsList className="grid w-full grid-cols-3" aria-label="Trip details">
              <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
              <TabsTrigger value="flights">Flights</TabsTrigger>
              <TabsTrigger value="accommodations">Accommodations</TabsTrigger>
            </TabsList>
            <TabsContent value="itinerary" className="mt-6">
              <TripItinerary tripId={params.id} startDate={trip.startDate} endDate={trip.endDate} />
            </TabsContent>
            <TabsContent value="flights" className="mt-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
                <h3 className="text-xl font-semibold" id="flights-heading">
                  Flights
                </h3>
                <Button size="sm" asChild>
                  <Link href={`/trips/${params.id}/flights/new`}>
                    <PlusCircle className="mr-2 h-4 w-4" aria-hidden="true" />
                    Add Flight
                    <span className="sr-only">Add a new flight to this trip</span>
                  </Link>
                </Button>
              </div>
              <div aria-labelledby="flights-heading">
                <FlightsList tripId={params.id} />
              </div>
            </TabsContent>
            <TabsContent value="accommodations" className="mt-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
                <h3 className="text-xl font-semibold" id="accommodations-heading">
                  Accommodations
                </h3>
                <Button size="sm" asChild>
                  <Link href={`/trips/${params.id}/accommodations/new`}>
                    <PlusCircle className="mr-2 h-4 w-4" aria-hidden="true" />
                    Add Accommodation
                    <span className="sr-only">Add a new accommodation to this trip</span>
                  </Link>
                </Button>
              </div>
              <div aria-labelledby="accommodations-heading">
                <AccommodationsList tripId={params.id} />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <div className="bg-muted p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4" id="summary-heading">
              Trip Summary
            </h3>
            <div className="space-y-4" aria-labelledby="summary-heading">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Destination</h4>
                <p className="flex items-center mt-1">
                  <MapPinIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                  {trip.destination}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Dates</h4>
                <p className="flex items-center mt-1">
                  <CalendarIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                  {new Date(trip.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} -{" "}
                  {new Date(trip.endDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
                <p className="mt-1 text-sm">{trip.description || "No description provided."}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

