import Link from "next/link"
import { PlusCircle } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  title: string
  description: string
  link: string
  linkText?: string
}

export function EmptyState({ title, description, link, linkText = "Add Trip" }: EmptyStateProps) {
  return (
    <Card className="flex flex-col items-center justify-center h-full border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-10 text-center">
        <PlusCircle className="h-10 w-10 text-muted-foreground mb-4" aria-hidden="true" />
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1 mb-4">{description}</p>
        <Button asChild variant="outline">
          <Link href={link}>
            {linkText}
            <span className="sr-only">{description}</span>
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

