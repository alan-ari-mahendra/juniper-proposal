import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import BlogGrid from "@/components/BlogGrid"
import MobileMenu from "@/components/MobileMenu"
import { query } from "@/lib/db"
import Link from "next/link"
import "server-only"
interface Post {
  id: number
  title: string
  slug: string
  excerpt: string
  category?: string
  featured_image?: string
  published_at: string
}

interface Service {
  id: number
  title: string
  slug: string
  description: string
  content: string
  icon: string
  order_index: number
  active: number
}

interface Testimonial {
  id: number
  name: string
  title: string
  company: string
  content: string
  rating: number
  featured: number
  active: number
}

interface ContactInfo {
  key: string
  value: string
}

// Server-side function to get blog posts
// async function getBlogPosts(): Promise<Post[]> {
//   try {
//     // First check if the category column exists
//     const tableInfo = query<{ name: string }>("PRAGMA table_info(posts)")
//     const hasCategory = tableInfo.some((col) => col.name === "category")
//     const hasFeaturedImage = tableInfo.some((col) => col.name === "featured_image")
//
//     // Build query based on available columns
//     let selectColumns = "id, title, slug, excerpt, published_at"
//     if (hasCategory) selectColumns += ", category"
//     if (hasFeaturedImage) selectColumns += ", featured_image"
//
//     const posts = query<any>(
//       `SELECT ${selectColumns}
//        FROM posts
//        WHERE published = 1
//        ORDER BY published_at DESC
//        LIMIT 4`,
//     )
//
//     // Ensure all required fields exist with defaults
//     return posts.map((post) => ({
//       id: post.id,
//       title: post.title,
//       slug: post.slug,
//       excerpt: post.excerpt || "",
//       category: post.category || "",
//       featured_image: post.featured_image || "",
//       published_at: post.published_at,
//     }))
//   } catch (error) {
//     console.error("Error fetching blog posts:", error)
//     return []
//   }
// }

async function getBlogPosts(): Promise<Post[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts?limit=4`, {
      cache: "no-store",
    })

    if (!res.ok) {
      console.error("Failed to fetch posts:", res.status, res.statusText)
      return []
    }

    const data = await res.json()
    if (!data?.items) return []

    return data.items.map((post: any) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      category: post.category || "",
      featured_image: post.featured_image || "",
      published_at: post.published_at,
    }))
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return []
  }
}

async function getServices(): Promise<Service[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/services`, {
      cache: "no-store",
    })

    if (!res.ok) return []
    const data = await res.json()
    return data?.items || []
  } catch (error) {
    console.error("Error fetching services:", error)
    return []
  }
}

async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/testimonials?limit=3`, {
      cache: "no-store",
    })

    if (!res.ok) return []
    const data = await res.json()
    return data?.items || []
  } catch (error) {
    console.error("Error fetching testimonials:", error)
    return []
  }
}

async function getContactInfo(): Promise<Record<string, string>> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/contact-info`, {
      cache: "no-store",
    })

    if (!res.ok) return {}
    const data = await res.json()
    if (!data?.items) return {}

    return data.items.reduce(
        (acc: Record<string, string>, item: any) => {
          acc[item.key] = item.value
          return acc
        },
        {}
    )
  } catch (error) {
    console.error("Error fetching contact info:", error)
    return {}
  }
}

export default async function JuniperProposals() {
  const blogPosts = await getBlogPosts()
  const services = await getServices()
  const testimonials = await getTestimonials()
  const contactInfo = await getContactInfo()

  // Get dynamic content with fallbacks only if database is empty
  const heroTitle = contactInfo.hero_title || "Proposal Management"
  const heroSubtitle = contactInfo.hero_subtitle || "Creating winning proposals that deliver exceptional results."
  const contactTitle = contactInfo.contact_title || "Let's work together"
  const contactDescription =
    contactInfo.contact_description ||
    "Ready to win your next proposal? Contact us today to get started with professional proposal management services."
  const email = contactInfo.email || "hello@juniperproposals.com"
  const phone = contactInfo.phone || "(555) 123-4567"
  const location = contactInfo.location || "Nationwide Service"

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="w-full bg-slate-900 relative z-40">
        <div className="container mx-auto px-4 sm:px-6 py-7">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center">
              <Link href="/">
                <Image
                  src="/logo.png"
                  alt="Juniper Proposals"
                  width={140}
                  height={36}
                  className="invert w-[120px] h-auto sm:w-[140px]"
                />
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden lg:flex items-center space-x-8">
                <Link href="/" className="text-white/80 hover:text-white font-medium text-sm transition-colors">
                  Home
                </Link>
                <Link href="/#about" className="text-white/80 hover:text-white font-medium text-sm transition-colors">
                  About
                </Link>
                <Link
                  href="/#services"
                  className="text-white/80 hover:text-white font-medium text-sm transition-colors"
                >
                  Services
                </Link>
                <Link href="/blog" className="text-white/80 hover:text-white font-medium text-sm transition-colors">
                  News and Insights
                </Link>
                <Link
                  href="/#references"
                  className="text-white/80 hover:text-white font-medium text-sm transition-colors"
                >
                  References
                </Link>
                <Link href="/#contact" className="text-white/80 hover:text-white font-medium text-sm transition-colors">
                  Contact
                </Link>
              </div>
              <MobileMenu />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen relative overflow-hidden bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 h-screen flex items-center">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center w-full">
            {/* Left Content */}
            <div className="space-y-6 lg:space-y-8 order-2 lg:order-1">
              <div className="space-y-4 lg:space-y-6">
                <p className="text-base lg:text-lg text-white/90 font-light leading-relaxed max-w-md">{heroSubtitle}</p>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-light text-white leading-none">
                  {heroTitle.includes(" ") ? (
                    <>
                      {heroTitle.split(" ")[0]}&nbsp;
                      <span className="block">{heroTitle.split(" ").slice(1).join(" ")}</span>
                    </>
                  ) : (
                    heroTitle
                  )}
                </h1>
              </div>

              <div className="space-y-6 pt-4 lg:pt-8">
                <div className="grid grid-cols-2 gap-4 lg:gap-8 max-w-md">
                  <div>
                    <div className="text-2xl lg:text-3xl font-light text-white mb-1">75%</div>
                    <div className="text-xs lg:text-sm text-white/70 uppercase tracking-wide">Win Rate</div>
                  </div>
                  <div>
                    <div className="text-2xl lg:text-3xl font-light text-white mb-1">15+</div>
                    <div className="text-xs lg:text-sm text-white/70 uppercase tracking-wide">Years</div>
                  </div>
                  <div>
                    <div className="text-2xl lg:text-3xl font-light text-white mb-1">$2.28B</div>
                    <div className="text-xs lg:text-sm text-white/70 uppercase tracking-wide">Won</div>
                  </div>
                  <div>
                    <div className="text-2xl lg:text-3xl font-light text-white mb-1">1000+</div>
                    <div className="text-xs lg:text-sm text-white/70 uppercase tracking-wide">Proposals</div>
                  </div>
                </div>

                <Button
                  className="bg-white hover:bg-gray-100 text-slate-900 px-6 lg:px-8 py-3 rounded-none font-normal text-sm tracking-wide w-full sm:w-auto"
                  asChild
                >
                  <a href="#contact">
                    Let's Chat!
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative h-64 sm:h-80 lg:h-full lg:min-h-[600px] xl:min-h-[700px] order-1 lg:order-2">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg overflow-hidden">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo-1725598942554-ebc40e6188ea-70q5YLqidrp2sFBKYb302B3Ox9FgxK.avif"
                  alt="Professional proposal management team"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 lg:py-32 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 items-start">
              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light text-gray-900 leading-tight mb-12">
                  Expert proposal
                  <br />
                  management
                </h2>
              </div>
              <div className="space-y-8 pt-8">
                <p className="text-lg text-gray-600 leading-relaxed">
                  With over 15 years of experience as a Proposal Manager and an APMP certificate, we specialize in
                  navigating the complexities of federal, international, state, and commercial contracts.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Our strategic approach and proven methodologies have helped organizations win over $2.28 billion in
                  contracts with a 75% success rate across all industries.
                </p>
                <Button
                  className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-none font-normal text-sm tracking-wide"
                  asChild
                >
                  <a href="#services">
                    Our Services
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Insights Section */}
      {blogPosts.length > 0 && (
        <section id="news" className="py-16 lg:py-32 bg-black">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light text-white leading-tight mb-6">
                  Latest Insights
                </h2>
                <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
                  Expert insights, industry trends, and proven strategies to elevate your proposal management success
                </p>
              </div>

              <BlogGrid posts={blogPosts} />

              <div className="text-center mt-12">
                <Button
                  className="bg-white hover:bg-gray-100 text-black px-8 py-3 rounded-lg font-medium text-sm transition-all duration-300 hover:shadow-lg"
                  asChild
                >
                  <a href="/blog">
                    View All Insights
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Services Section */}
      {services.length > 0 && (
        <section id="services" className="py-16 lg:py-32 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-20">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light text-gray-900 leading-tight mb-8">
                  Services
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Comprehensive proposal management solutions designed to maximize your success rate
                </p>
              </div>

              <Accordion type="single" collapsible className="w-full space-y-4">
                {services.map((service) => (
                  <AccordionItem
                    key={service.id}
                    value={service.slug}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                  >
                    <AccordionTrigger className="px-8 py-8 text-left hover:no-underline group hover:bg-gray-50/50 transition-colors [&>svg]:hidden">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center flex-1">
                          {service.icon && (
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-6 group-hover:bg-blue-200 transition-colors">
                              <span className="text-2xl">{service.icon}</span>
                            </div>
                          )}
                          <div className="flex flex-col items-start flex-1">
                            <h3 className="text-xl lg:text-2xl font-medium text-gray-900 mb-3">{service.title}</h3>
                            <p className="text-base text-gray-600 leading-relaxed">{service.description}</p>
                          </div>
                        </div>
                        <div className="ml-6 flex-shrink-0">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                            <svg
                              className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-all duration-200 group-data-[state=open]:rotate-180"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-8 pb-8">
                      <div className="pl-18 space-y-6">
                        <div className="prose prose-lg max-w-none text-gray-700">
                          <p className="leading-relaxed">{service.content}</p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
      )}

      {/* Testimonial Section */}
      {testimonials.length > 0 && (
        <section id="references" className="py-16 lg:py-32 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light text-gray-900 leading-tight mb-8">
                  Client
                  <br />
                  testimonials
                </h2>
              </div>

              <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="bg-gray-50 rounded-2xl p-8">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${i < testimonial.rating ? "text-yellow-400" : "text-gray-300"}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <blockquote className="text-gray-700 leading-relaxed mb-6 text-sm">
                      "{testimonial.content}"
                    </blockquote>
                    <div className="border-t border-gray-200 pt-4">
                      <div className="font-medium text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">
                        {testimonial.title}
                        {testimonial.company && ` at ${testimonial.company}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section id="contact" className="py-16 lg:py-32 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light text-gray-900 leading-tight mb-12">
              {contactTitle.includes(" ") ? (
                <>
                  {contactTitle.split(" ").slice(0, -1).join(" ")}
                  <br />
                  {contactTitle.split(" ").slice(-1)[0]}
                </>
              ) : (
                contactTitle
              )}
            </h2>
            <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">{contactDescription}</p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mb-12 lg:mb-16">
              <div className="text-center space-y-4">
                <div className="text-sm text-gray-500 uppercase tracking-wide">Email</div>
                <div className="text-gray-900">{email}</div>
              </div>
              <div className="text-center space-y-4">
                <div className="text-sm text-gray-500 uppercase tracking-wide">Phone</div>
                <div className="text-gray-900">{phone}</div>
              </div>
              <div className="text-center space-y-4">
                <div className="text-sm text-gray-500 uppercase tracking-wide">Location</div>
                <div className="text-gray-900">{location}</div>
              </div>
            </div>

            <Button className="bg-gray-900 hover:bg-gray-800 text-white px-12 py-4 rounded-none font-normal text-sm tracking-wide">
              Start Project
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-gray-100">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-6 md:mb-0">
              <Link href="/">
                <Image src="/logo.png" alt="Juniper Proposals" width={140} height={36} />
              </Link>
            </div>
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} Juniper Proposals. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* Admin Link - Hidden but accessible */}
      <div className="fixed bottom-4 right-4 opacity-10 hover:opacity-100 transition-opacity">
        <Link href="/admin" className="bg-gray-900 text-white px-3 py-2 rounded text-xs">
          Admin
        </Link>
      </div>
    </div>
  )
}
