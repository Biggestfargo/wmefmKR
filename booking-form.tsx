"use client"
import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  CalendarIcon,
  Star,
  Music,
  Users,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  Clock,
  AlertCircle,
  CheckCircle2,
} from "lucide-react"
import { format } from "date-fns"
import { bookingFormSchema, type BookingFormData } from "./lib/validations"

export default function CelebrityBookingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isValid, touchedFields },
    reset,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    mode: "onChange", // Validate on change for real-time feedback
    defaultValues: {
      additionalServices: [],
      budgetIncludes: [],
      termsAgreement: false,
    },
  })

  const watchedEventDate = watch("eventDate")
  const watchedEventType = watch("eventType")
  const watchedPerformanceType = watch("performanceType")
  const watchedBudgetRange = watch("budgetRange")

  // Reset attendance when event type changes to prevent invalid combinations
  useEffect(() => {
    if (watchedEventType || watchedPerformanceType) {
      setValue("expectedAttendance", "")
    }
  }, [watchedEventType, watchedPerformanceType, setValue])

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // Create FormData for Netlify submission
      const formData = new FormData()

      // Add form name for Netlify
      formData.append("form-name", "celebrity-booking")

      // Add all form fields
      Object.entries(data).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          // Handle arrays (checkboxes)
          value.forEach((item) => formData.append(key, item))
        } else if (typeof value === "boolean") {
          // Handle boolean values
          formData.append(key, value.toString())
        } else if (value !== undefined && value !== null) {
          // Handle strings and other values
          formData.append(key, value.toString())
        }
      })

      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData as any).toString(),
      })

      if (response.ok) {
        setSubmitSuccess(true)
        reset()
        // Scroll to top to show success message
        window.scrollTo({ top: 0, behavior: "smooth" })
      } else {
        throw new Error(`Form submission failed with status: ${response.status}`)
      }
    } catch (error) {
      console.error("Form submission error:", error)
      setSubmitError("There was an error submitting your request. Please check your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Helper function to get field error message
  const getFieldError = (fieldName: keyof BookingFormData) => {
    return errors[fieldName]?.message
  }

  // Helper function to check if field has error
  const hasFieldError = (fieldName: keyof BookingFormData) => {
    return !!errors[fieldName]
  }

  // Helper function to check if field is valid and touched
  const isFieldValid = (fieldName: keyof BookingFormData) => {
    return touchedFields[fieldName] && !errors[fieldName]
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Booking Request Submitted Successfully!</h1>
            <p className="text-lg text-slate-600 mb-6">
              Thank you for your celebrity booking request. WME will review your submission and contact you within 48
              hours to discuss availability and next steps.
            </p>
            <Badge variant="secondary" className="mb-6">
              Managed by WME Talent Agency
            </Badge>
            <Button
              onClick={() => {
                setSubmitSuccess(false)
                window.scrollTo({ top: 0, behavior: "smooth" })
              }}
              className="mt-4"
            >
              Submit Another Request
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Star className="h-8 w-8 text-amber-500" />
            <h1 className="text-4xl font-bold text-slate-900">Celebrity Booking Request</h1>
            <Star className="h-8 w-8 text-amber-500" />
          </div>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Submit your booking request through William Morris Endeavor (WME). Please provide complete details to ensure
            prompt processing of your celebrity booking inquiry.
          </p>
          <Badge variant="secondary" className="mt-2">
            Managed by WME Talent Agency
          </Badge>
        </div>

        {/* Error Alert */}
        {submitError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        <form 
          onSubmit={handleSubmit(onSubmit)} 
          className="space-y-8"
          name="celebrity-booking"
          method="POST"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
        >
          {/* Netlify hidden input for form name */}
          <input type="hidden" name="form-name" value="celebrity-booking" />
          {/* Netlify honeypot field for spam protection */}
          <input type="hidden" name="bot-field" />
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
                  <Label htmlFor="firstName" className="flex items-center gap-1">
                    First Name *{isFieldValid("firstName") && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                  </Label>
                  <Input
                    id="firstName"
                    {...register("firstName")}
                    placeholder="John"
                    className={
                      hasFieldError("firstName")
                        ? "border-red-500"
                        : isFieldValid("firstName")
                          ? "border-green-500"
                          : ""
                    }
                  />
                  {hasFieldError("firstName") && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {getFieldError("firstName")}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="flex items-center gap-1">
                    Last Name *{isFieldValid("lastName") && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                  </Label>
                  <Input
                    id="lastName"
                    {...register("lastName")}
                    placeholder="Smith"
                    className={
                      hasFieldError("lastName") ? "border-red-500" : isFieldValid("lastName") ? "border-green-500" : ""
                    }
                  />
                  {hasFieldError("lastName") && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {getFieldError("lastName")}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-1">
                    Email Address *{isFieldValid("email") && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      {...register("email")}
                      type="email"
                      placeholder="john@company.com"
                      className={`pl-10 ${hasFieldError("email") ? "border-red-500" : isFieldValid("email") ? "border-green-500" : ""}`}
                    />
                  </div>
                  {hasFieldError("email") && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {getFieldError("email")}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-1">
                    Phone Number *{isFieldValid("phone") && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="phone"
                      {...register("phone")}
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      className={`pl-10 ${hasFieldError("phone") ? "border-red-500" : isFieldValid("phone") ? "border-green-500" : ""}`}
                    />
                  </div>
                  {hasFieldError("phone") && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {getFieldError("phone")}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company" className="flex items-center gap-1">
                    Company/Organization *
                    {isFieldValid("company") && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                  </Label>
                  <Input
                    id="company"
                    {...register("company")}
                    placeholder="Event Company LLC"
                    className={
                      hasFieldError("company") ? "border-red-500" : isFieldValid("company") ? "border-green-500" : ""
                    }
                  />
                  {hasFieldError("company") && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {getFieldError("company")}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title" className="flex items-center gap-1">
                    Your Title
                    {isFieldValid("title") && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                  </Label>
                  <Input
                    id="title"
                    {...register("title")}
                    placeholder="Event Director"
                    className={
                      hasFieldError("title") ? "border-red-500" : isFieldValid("title") ? "border-green-500" : ""
                    }
                  />
                  {hasFieldError("title") && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {getFieldError("title")}
                    </p>
                  )}
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
                  <Label htmlFor="eventName" className="flex items-center gap-1">
                    Event Name *{isFieldValid("eventName") && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                  </Label>
                  <Input
                    id="eventName"
                    {...register("eventName")}
                    placeholder="Summer Music Festival 2024"
                    className={
                      hasFieldError("eventName")
                        ? "border-red-500"
                        : isFieldValid("eventName")
                          ? "border-green-500"
                          : ""
                    }
                  />
                  {hasFieldError("eventName") && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {getFieldError("eventName")}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="requestedArtist" className="flex items-center gap-1">
                    Requested Artist/Celebrity *
                    {isFieldValid("requestedArtist") && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                  </Label>
                  <Input
                    id="requestedArtist"
                    {...register("requestedArtist")}
                    placeholder="e.g., Kid Rock, Taylor Swift, etc."
                    className={
                      hasFieldError("requestedArtist")
                        ? "border-red-500"
                        : isFieldValid("requestedArtist")
                          ? "border-green-500"
                          : ""
                    }
                  />
                  {hasFieldError("requestedArtist") && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {getFieldError("requestedArtist")}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    Event Type *{isFieldValid("eventType") && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                  </Label>
                  <Controller
                    name="eventType"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger
                          className={
                            hasFieldError("eventType")
                              ? "border-red-500"
                              : isFieldValid("eventType")
                                ? "border-green-500"
                                : ""
                          }
                        >
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
                    )}
                  />
                  {hasFieldError("eventType") && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {getFieldError("eventType")}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    Event Date *{isFieldValid("eventDate") && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                  </Label>
                  <Controller
                    name="eventDate"
                    control={control}
                    render={({ field }) => (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={`w-full justify-start text-left font-normal bg-transparent ${
                              hasFieldError("eventDate")
                                ? "border-red-500"
                                : isFieldValid("eventDate")
                                  ? "border-green-500"
                                  : ""
                            }`}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(new Date(field.value), "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={(date) => field.onChange(date ? date.toISOString() : "")}
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                  {hasFieldError("eventDate") && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {getFieldError("eventDate")}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eventTime" className="flex items-center gap-1">
                    Event Time *{isFieldValid("eventTime") && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                  </Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="eventTime"
                      {...register("eventTime")}
                      type="time"
                      className={`pl-10 ${hasFieldError("eventTime") ? "border-red-500" : isFieldValid("eventTime") ? "border-green-500" : ""}`}
                    />
                  </div>
                  {hasFieldError("eventTime") && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {getFieldError("eventTime")}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="venue" className="flex items-center gap-1">
                  Venue Name *{isFieldValid("venue") && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="venue"
                    {...register("venue")}
                    placeholder="Madison Square Garden"
                    className={`pl-10 ${hasFieldError("venue") ? "border-red-500" : isFieldValid("venue") ? "border-green-500" : ""}`}
                  />
                </div>
                {hasFieldError("venue") && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {getFieldError("venue")}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city" className="flex items-center gap-1">
                    City *{isFieldValid("city") && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                  </Label>
                  <Input
                    id="city"
                    {...register("city")}
                    placeholder="New York"
                    className={
                      hasFieldError("city") ? "border-red-500" : isFieldValid("city") ? "border-green-500" : ""
                    }
                  />
                  {hasFieldError("city") && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {getFieldError("city")}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state" className="flex items-center gap-1">
                    State/Province *{isFieldValid("state") && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                  </Label>
                  <Input
                    id="state"
                    {...register("state")}
                    placeholder="NY"
                    className={
                      hasFieldError("state") ? "border-red-500" : isFieldValid("state") ? "border-green-500" : ""
                    }
                  />
                  {hasFieldError("state") && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {getFieldError("state")}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  Expected Attendance *
                  {isFieldValid("expectedAttendance") && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                </Label>
                <Controller
                  name="expectedAttendance"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        className={
                          hasFieldError("expectedAttendance")
                            ? "border-red-500"
                            : isFieldValid("expectedAttendance")
                              ? "border-green-500"
                              : ""
                        }
                      >
                        <SelectValue placeholder="Select attendance range" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* Show VIP attendance options for VIP events */}
                        {watchedEventType === "vip" || watchedPerformanceType === "meet-greet" ? (
                          <>
                            <SelectItem value="5-10">5 - 10 people</SelectItem>
                            <SelectItem value="10-25">10 - 25 people</SelectItem>
                            <SelectItem value="25-50">25 - 50 people</SelectItem>
                            <SelectItem value="50-75">50 - 75 people</SelectItem>
                            <SelectItem value="75-100">75 - 100 people</SelectItem>
                          </>
                        ) : watchedEventType === "private" ? (
                          /* Show private event options */
                          <>
                            <SelectItem value="under-50">Under 50</SelectItem>
                            <SelectItem value="50-100">50 - 100</SelectItem>
                            <SelectItem value="100-250">100 - 250</SelectItem>
                            <SelectItem value="250-500">250 - 500</SelectItem>
                            <SelectItem value="500-1000">500 - 1,000</SelectItem>
                            <SelectItem value="1000-2500">1,000 - 2,500</SelectItem>
                          </>
                        ) : (
                          /* Show standard event options */
                          <>
                            <SelectItem value="under-500">Under 500</SelectItem>
                            <SelectItem value="500-1000">500 - 1,000</SelectItem>
                            <SelectItem value="1000-5000">1,000 - 5,000</SelectItem>
                            <SelectItem value="5000-10000">5,000 - 10,000</SelectItem>
                            <SelectItem value="10000-25000">10,000 - 25,000</SelectItem>
                            <SelectItem value="25000-50000">25,000 - 50,000</SelectItem>
                            <SelectItem value="over-50000">Over 50,000</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />
                {hasFieldError("expectedAttendance") && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {getFieldError("expectedAttendance")}
                  </p>
                )}
                {/* Show helpful context based on selection */}
                {(watchedEventType === "vip" || watchedPerformanceType === "meet-greet") && (
                  <p className="text-xs text-slate-500 mt-1">
                    VIP experiences are designed for intimate, exclusive gatherings
                  </p>
                )}
                {watchedEventType === "private" && (
                  <p className="text-xs text-slate-500 mt-1">
                    Private events typically have smaller, more controlled audiences
                  </p>
                )}
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
                <Label className="flex items-center gap-1">
                  Performance Type *
                  {isFieldValid("performanceType") && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                </Label>
                <Controller
                  name="performanceType"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup value={field.value} onValueChange={field.onChange}>
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
                  )}
                />
                {hasFieldError("performanceType") && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {getFieldError("performanceType")}
                  </p>
                )}
              </div>

              <Separator />

              <div className="space-y-3">
                <Label>Additional Services (Check all that apply)</Label>
                <Controller
                  name="additionalServices"
                  control={control}
                  render={({ field }) => (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        { id: "soundcheck", label: "Soundcheck Required" },
                        { id: "rehearsal", label: "Rehearsal Time" },
                        { id: "interviews", label: "Media Interviews" },
                        { id: "photos", label: "Photo Opportunities" },
                        { id: "merchandise", label: "Merchandise Sales" },
                        { id: "recording", label: "Recording Rights" },
                      ].map((service) => (
                        <div key={service.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={service.id}
                            checked={field.value?.includes(service.id) || false}
                            onCheckedChange={(checked) => {
                              const currentValue = field.value || []
                              if (checked) {
                                field.onChange([...currentValue, service.id])
                              } else {
                                field.onChange(currentValue.filter((item) => item !== service.id))
                              }
                            }}
                          />
                          <Label htmlFor={service.id}>{service.label}</Label>
                        </div>
                      ))}
                    </div>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="technicalRequirements" className="flex items-center gap-1">
                  Technical Requirements
                  {isFieldValid("technicalRequirements") && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                </Label>
                <Textarea
                  id="technicalRequirements"
                  {...register("technicalRequirements")}
                  placeholder="Describe any specific technical requirements, stage setup, lighting, sound system specifications, etc."
                  rows={4}
                  className={
                    hasFieldError("technicalRequirements")
                      ? "border-red-500"
                      : isFieldValid("technicalRequirements")
                        ? "border-green-500"
                        : ""
                  }
                />
                {hasFieldError("technicalRequirements") && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {getFieldError("technicalRequirements")}
                  </p>
                )}
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
                <Label className="flex items-center gap-1">
                  Budget Range *{isFieldValid("budgetRange") && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                </Label>
                <Controller
                  name="budgetRange"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        className={
                          hasFieldError("budgetRange")
                            ? "border-red-500"
                            : isFieldValid("budgetRange")
                              ? "border-green-500"
                              : ""
                        }
                      >
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
                  )}
                />
                {hasFieldError("budgetRange") && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {getFieldError("budgetRange")}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="budgetNotes" className="flex items-center gap-1">
                  Budget Notes
                  {isFieldValid("budgetNotes") && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                </Label>
                <Textarea
                  id="budgetNotes"
                  {...register("budgetNotes")}
                  placeholder="Additional budget considerations, payment terms, or special arrangements..."
                  rows={3}
                  className={
                    hasFieldError("budgetNotes")
                      ? "border-red-500"
                      : isFieldValid("budgetNotes")
                        ? "border-green-500"
                        : ""
                  }
                />
                {hasFieldError("budgetNotes") && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {getFieldError("budgetNotes")}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label>Budget Includes (Check all that apply)</Label>
                <Controller
                  name="budgetIncludes"
                  control={control}
                  render={({ field }) => (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        { id: "travel", label: "Travel & Transportation" },
                        { id: "accommodation", label: "Accommodation" },
                        { id: "catering", label: "Catering & Hospitality" },
                        { id: "production", label: "Production Costs" },
                        { id: "security", label: "Security" },
                        { id: "insurance", label: "Insurance" },
                      ].map((item) => (
                        <div key={item.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={item.id}
                            checked={field.value?.includes(item.id) || false}
                            onCheckedChange={(checked) => {
                              const currentValue = field.value || []
                              if (checked) {
                                field.onChange([...currentValue, item.id])
                              } else {
                                field.onChange(currentValue.filter((val) => val !== item.id))
                              }
                            }}
                          />
                          <Label htmlFor={item.id}>{item.label}</Label>
                        </div>
                      ))}
                    </div>
                  )}
                />
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
                <Label htmlFor="eventDescription" className="flex items-center gap-1">
                  Event Description
                  {isFieldValid("eventDescription") && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                </Label>
                <Textarea
                  id="eventDescription"
                  {...register("eventDescription")}
                  placeholder="Provide a detailed description of your event, its purpose, target audience, and any special significance..."
                  rows={4}
                  className={
                    hasFieldError("eventDescription")
                      ? "border-red-500"
                      : isFieldValid("eventDescription")
                        ? "border-green-500"
                        : ""
                  }
                />
                {hasFieldError("eventDescription") && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {getFieldError("eventDescription")}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialRequests" className="flex items-center gap-1">
                  Special Requests or Requirements
                  {isFieldValid("specialRequests") && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                </Label>
                <Textarea
                  id="specialRequests"
                  {...register("specialRequests")}
                  placeholder="Any special requests, dietary requirements, accessibility needs, or other important considerations..."
                  rows={3}
                  className={
                    hasFieldError("specialRequests")
                      ? "border-red-500"
                      : isFieldValid("specialRequests")
                        ? "border-green-500"
                        : ""
                  }
                />
                {hasFieldError("specialRequests") && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {getFieldError("specialRequests")}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Booking Timeline</Label>
                <Controller
                  name="bookingTimeline"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
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
                  )}
                />
              </div>

              <div className="space-y-2">
                <Controller
                  name="termsAgreement"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="terms"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className={hasFieldError("termsAgreement") ? "border-red-500" : ""}
                      />
                      <Label htmlFor="terms" className="text-sm leading-relaxed">
                        I agree to the terms and conditions and understand that this is a booking inquiry, not a
                        confirmed booking. WME will review and respond within 48 hours. *
                      </Label>
                    </div>
                  )}
                />
                {hasFieldError("termsAgreement") && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {getFieldError("termsAgreement")}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Form Status */}
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isValid ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="text-green-700 font-medium">Form is ready to submit</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                    <span className="text-amber-700 font-medium">Please complete all required fields</span>
                  </>
                )}
              </div>
              <Badge variant={isValid ? "default" : "secondary"}>
                {Object.keys(errors).length === 0 ? "Valid" : `${Object.keys(errors).length} errors`}
              </Badge>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <Button
              type="submit"
              size="lg"
              className="w-full md:w-auto px-12 py-3 text-lg font-semibold"
              disabled={isSubmitting || !isValid}
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

export default function CelebrityBookingForm()
