import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail } from "lucide-react"
import { Header } from "@/components/header"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-heading font-bold text-foreground mb-4">Contact Sales</h1>
            <p className="text-lg text-muted-foreground">
              Ready to scale your CMRA compliance? Let's discuss your enterprise needs.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Get in Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <form className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="John" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Doe" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john@company.com" />
                  </div>

                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" placeholder="Your Company" />
                  </div>

                  <div>
                    <Label htmlFor="locations">Number of Locations</Label>
                    <Input id="locations" placeholder="e.g., 5 locations" />
                  </div>

                  <div>
                    <Label htmlFor="users">Estimated Users</Label>
                    <Input id="users" placeholder="e.g., 1000+ users" />
                  </div>

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="Tell us about your CMRA compliance needs..." rows={4} />
                  </div>

                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <Mail className="h-6 w-6 text-primary" />
                    <div>
                      <h3 className="font-semibold">Email</h3>
                      <p className="text-muted-foreground">Daniel@mailboxhero.pro</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Enterprise Features</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• $5/user/month unlimited scale</li>
                    <li>• Unlimited locations and users</li>
                    <li>• Custom compliance workflows</li>
                    <li>• 24/7 dedicated support</li>
                    <li>• Advanced analytics dashboard</li>
                    <li>• SSO & compliance integrations</li>
                    <li>• White-label options available</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Why Choose MailboxHero Enterprise?</h3>
                  <p className="text-muted-foreground">
                    Join the compliance revolution with patent-pending AI witness technology. Turn regulatory challenges
                    into competitive advantages with our enterprise-grade CMRA compliance platform.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
