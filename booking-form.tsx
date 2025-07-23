"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CalendarIcon, Star, Music, Users, DollarSign, MapPin, Phone, Mail, Clock } from "lucide-react"
import { format } from "date-fns"

export default function KidRockBookingForm() {
  const [eventDate, setEventDate] = useState<Date>()
  const [eventType, setEventType] = useState("")
  const [performanceType, setPerformanceType] = useState("")
  const [budgetRange, setBudgetRange] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    alert("Booking request submitted successfully! WME will contact you within 48 hours.")
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Star className="h-8 w-8 text-amber-500" />
            <h1 className="text-4xl font-bold text-slate-900">Kid Rock Booking Request</h1>
            <Star className="h-8 w-8 text-amber-500" />
          </div>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Submit your professional booking request through William Morris Endeavor (WME). Please provide complete
            details to ensure prompt processing.
          </p>
          <Badge variant="secondary" className="mt-2">
            Managed by WME Talent Agency
          </Badge>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Contact Information
              </CardTitle>
              <CardDescription>Primary contact details for this booking request</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input id="firstName" placeholder="John" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input id="lastName" placeholder="Smith" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input id="email" type="email" placeholder="john@company.com" className="pl-10" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" className="pl-10" required />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company/Organization *</Label>
                  <Input id="company" placeholder="Event Company LLC" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Your Title</Label>
                  <Input id="title" placeholder="Event Director" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Event Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="h-5 w-5 text-purple-600" />
                Event Details
              </CardTitle>
              <CardDescription>Comprehensive information about your event</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="eventName">Event Name *</Label>
                  <Input id="eventName" placeholder="Summer Music Festival 2024" required />
                </div>
                <div className="space-y-2">
                  <Label>Event Type *</Label>
                  <Select value={eventType} onValueChange={setEventType} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="concert">Concert/Music Festival</SelectItem>
                      <SelectItem value="private">Private Event</SelectItem>
                      <SelectItem value="corporate">Corporate Event</SelectItem>
                      <SelectItem value="charity">Charity/Fundraiser</SelectItem>
                      <SelectItem value="speaking">Speaking Engagement</SelectItem>
                      <SelectItem value="vip">VIP Experience</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Event Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {eventDate ? format(eventDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={eventDate}
                        onSelect={setEventDate}
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eventTime">Event Time *</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input id="eventTime" type="time" className="pl-10" required />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="venue">Venue Name *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input id="venue" placeholder="Madison Square Garden" className="pl-10" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input id="city" placeholder="New York" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State/Province *</Label>
                  <Input id="state" placeholder="NY" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expectedAttendance">Expected Attendance *</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select attendance range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-500">Under 500</SelectItem>
                    <SelectItem value="500-1000">500 - 1,000</SelectItem>
                    <SelectItem value="1000-5000">1,000 - 5,000</SelectItem>
                    <SelectItem value="5000-10000">5,000 - 10,000</SelectItem>
                    <SelectItem value="10000-25000">10,000 - 25,000</SelectItem>
                    <SelectItem value="25000-50000">25,000 - 50,000</SelectItem>
                    <SelectItem value="over-50000">Over 50,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Performance Specifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="h-5 w-5 text-green-600" />
                Performance Specifications
              </CardTitle>
              <CardDescription>Technical and performance requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Performance Type *</Label>
                <RadioGroup value={performanceType} onValueChange={setPerformanceType} required>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="full-concert" id="full-concert" />
                    <Label htmlFor="full-concert">Full Concert (90+ minutes)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="headliner" id="headliner" />
                    <Label htmlFor="headliner">Headliner Set (60-75 minutes)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="festival" id="festival" />
                    <Label htmlFor="festival">Festival Set (45-60 minutes)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="acoustic" id="acoustic" />
                    <Label htmlFor="acoustic">Acoustic Performance</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="speaking" id="speaking" />
                    <Label htmlFor="speaking">Speaking Engagement Only</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="meet-greet" id="meet-greet" />
                    <Label htmlFor="meet-greet">Meet & Greet/VIP Experience</Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label>Additional Services (Check all that apply)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="soundcheck" />
                    <Label htmlFor="soundcheck">Soundcheck Required</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="rehearsal" />
                    <Label htmlFor="rehearsal">Rehearsal Time</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="interviews" />
                    <Label htmlFor="interviews">Media Interviews</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="photos" />
                    <Label htmlFor="photos">Photo Opportunities</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="merchandise" />
                    <Label htmlFor="merchandise">Merchandise Sales</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="recording" />
                    <Label htmlFor="recording">Recording Rights</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="technical-requirements">Technical Requirements</Label>
                <Textarea
                  id="technical-requirements"
                  placeholder="Describe any specific technical requirements, stage setup, lighting, sound system specifications, etc."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Budget Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-emerald-600" />
                Budget Information
              </CardTitle>
              <CardDescription>Investment details for this booking (all information confidential)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Budget Range *</Label>
                <Select value={budgetRange} onValueChange={setBudgetRange} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-100k">Under $100,000</SelectItem>
                    <SelectItem value="100k-250k">$100,000 - $250,000</SelectItem>
                    <SelectItem value="250k-500k">$250,000 - $500,000</SelectItem>
                    <SelectItem value="500k-1m">$500,000 - $1,000,000</SelectItem>
                    <SelectItem value="1m-2m">$1,000,000 - $2,000,000</SelectItem>
                    <SelectItem value="over-2m">Over $2,000,000</SelectItem>
                    <SelectItem value="flexible">Budget Flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget-notes">Budget Notes</Label>
                <Textarea
                  id="budget-notes"
                  placeholder="Additional budget considerations, payment terms, or special arrangements..."
                  rows={3}
                />
              </div>

              <div className="space-y-3">
                <Label>Budget Includes (Check all that apply)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="travel" />
                    <Label htmlFor="travel">Travel & Transportation</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="accommodation" />
                    <Label htmlFor="accommodation">Accommodation</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="catering" />
                    <Label htmlFor="catering">Catering & Hospitality</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="production" />
                    <Label htmlFor="production">Production Costs</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="security" />
                    <Label htmlFor="security">Security</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="insurance" />
                    <Label htmlFor="insurance">Insurance</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
              <CardDescription>Any other details that would help us process your request</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="event-description">Event Description</Label>
                <Textarea
                  id="event-description"
                  placeholder="Provide a detailed description of your event, its purpose, target audience, and any special significance..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="special-requests">Special Requests or Requirements</Label>
                <Textarea
                  id="special-requests"
                  placeholder="Any special requests, dietary requirements, accessibility needs, or other important considerations..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeline">Booking Timeline</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="When do you need confirmation?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asap">ASAP</SelectItem>
                    <SelectItem value="1-week">Within 1 week</SelectItem>
                    <SelectItem value="2-weeks">Within 2 weeks</SelectItem>
                    <SelectItem value="1-month">Within 1 month</SelectItem>
                    <SelectItem value="flexible">Timeline is flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="terms" required />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the terms and conditions and understand that this is a booking inquiry, not a confirmed
                  booking. WME will review and respond within 48 hours. *
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <Button
              type="submit"
              size="lg"
              className="w-full md:w-auto px-12 py-3 text-lg font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting Request..." : "Submit Booking Request"}
            </Button>
          </div>

          <div className="text-center text-sm text-slate-500 mt-4">
            <p>This form is processed by William Morris Endeavor (WME)</p>
            <p>All information is kept strictly confidential</p>
          </div>
        </form>
      </div>
    </div>
  )
}
