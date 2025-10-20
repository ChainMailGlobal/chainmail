import { Card, CardContent } from "@/components/ui/card"
import { Star } from "@/lib/icons"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Product Manager",
    company: "TechFlow Inc.",
    content:
      "CMRAi transformed our CMRA compliance process. We've reduced compliance time by 95% and eliminated audit risks completely.",
    rating: 5,
  },
  {
    name: "Michael Rodriguez",
    role: "Operations Director",
    company: "GrowthLab",
    content:
      "The AI witness and blockchain audit trail are incredible. What used to take weeks now happens in minutes. Game-changer for our compliance.",
    rating: 5,
  },
  {
    name: "Emily Watson",
    role: "CMRA Manager",
    company: "InnovateCorp",
    content:
      "Best compliance investment we've made. The USPS-ready submissions and audit trails give us complete peace of mind. Highly recommend CMRAi.",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-4">
            Trusted by CMRA Operators Nationwide
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See what our customers say about their compliance experience with CMRAi
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-border bg-card hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-accent fill-current" />
                  ))}
                </div>

                <blockquote className="text-card-foreground mb-6 leading-relaxed">"{testimonial.content}"</blockquote>

                <div className="border-t border-border pt-4">
                  <div className="font-semibold text-card-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
