"use client"
import { useRouter } from "next/navigation"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { saveTripToStorage } from "@/lib/local-storage"
import { generateLocationImage } from "@/lib/image-utils"

const tripFormSchema = z.object({
  name: z.string().min(2, {
    message: "Trip name must be at least 2 characters.",
  }),
  destination: z.string().min(2, {
    message: "Destination must be at least 2 characters.",
  }),
  dateRange: z.object({
    from: z.date({
      required_error: "Start date is required.",
    }),
    to: z.date({
      required_error: "End date is required.",
    }),
  }),
  description: z.string().optional(),
})

type TripFormValues = z.infer<typeof tripFormSchema>

export default function NewTripPage() {
  const router = useRouter()

  const form = useForm<TripFormValues>({
    resolver: zodResolver(tripFormSchema),
    defaultValues: {
      name: "",
      destination: "",
      description: "",
    },
  })

  function onSubmit(data: TripFormValues) {
    // Generate an image based on the destination
    const image = generateLocationImage(data.destination)

    // Save trip to local storage
    const newTrip = saveTripToStorage({
      name: data.name,
      destination: data.destination,
      startDate: data.dateRange.from.toISOString().split("T")[0],
      endDate: data.dateRange.to.toISOString().split("T")[0],
      description: data.description,
      image: image,
    })

    // Navigate to the new trip page
    router.push(`/trips/${newTrip.id}`)
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold mb-8">Create New Trip</h1>

      <Card className="max-w-2xl mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} aria-labelledby="new-trip-title">
            <CardHeader>
              <CardTitle id="new-trip-title">Trip Details</CardTitle>
              <CardDescription>Enter the basic information about your trip</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trip Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Summer Vacation" {...field} aria-describedby={`name-error-${field.name}`} />
                    </FormControl>
                    <FormMessage id={`name-error-${field.name}`} />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Paris, France"
                        {...field}
                        aria-describedby={`destination-error-${field.name}`}
                      />
                    </FormControl>
                    <FormMessage id={`destination-error-${field.name}`} />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateRange"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date Range</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value?.from && "text-muted-foreground",
                            )}
                            aria-expanded={false}
                            aria-haspopup="dialog"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                            {field.value?.from ? (
                              field.value?.to ? (
                                <>
                                  {format(field.value.from, "LLL dd, y")} - {format(field.value.to, "LLL dd, y")}
                                </>
                              ) : (
                                format(field.value.from, "LLL dd, y")
                              )
                            ) : (
                              "Select date range"
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={field.value?.from}
                          selected={field.value}
                          onSelect={field.onChange}
                          numberOfMonths={2}
                          aria-label="Select date range"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage id={`dateRange-error-${field.name}`} />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add some notes about your trip..."
                        className="min-h-[100px]"
                        {...field}
                        aria-describedby={`description-error-${field.name}`}
                      />
                    </FormControl>
                    <FormMessage id={`description-error-${field.name}`} />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
              <Button variant="outline" type="button" onClick={() => router.back()} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button type="submit" className="w-full sm:w-auto">
                Create Trip
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}

