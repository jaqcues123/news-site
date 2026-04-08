# New England Wrecker Sales (NEWS) Website

## Overview

This document defines the structure, architecture, and implementation plan for the NEWS website. It is written to be directly actionable by a junior engineer.

The site will:

* Mirror the visual style of netcfleetservices.com
* Replace and improve functionality from netruckcenter.com (sales + inventory)
* Focus on custom NRC truck builds and available inventory

---

# 1. Tech Stack

## Recommended Stack

* Frontend: Next.js (React)
* Styling: Tailwind CSS
* Hosting: Vercel
* Backend / Data: Supabase (PostgreSQL + Storage)

## Alternative (No Supabase)

* Data: Static JSON files in repo (for small scale)
* Images: Stored in /public/images
* Admin: Markdown-based CMS (Netlify CMS or simple JSON editor)

---

# 2. Site Structure

## Pages

### 1. Home Page (/)

Purpose:

* Company overview
* Explain custom NRC builds
* Show available options
* Funnel users to inventory

Sections:

* Hero Section
* About / Capabilities
* Custom Build Explanation
* Product Types (Wreckers, Rollbacks, Rotators)
* CTA (View Inventory / Request Quote)

---

### 2. Inventory Page (/inventory)

Purpose:

* Display all available trucks

Features:

* Grid layout of trucks
* Filters (optional)
* Each card links to detail page

---

### 3. Truck Detail Page (/inventory/[id])

Purpose:

* Full truck listing

Includes:

* Image gallery
* Specs
* Buildsheet PDF
* Price estimate
* Contact form

---

### 4. Admin Page (/admin)

Purpose:

* Manage inventory listings

Features:

* Add/edit/delete trucks
* Upload images
* Upload buildsheets

---

# 3. Data Models

## Truck Model

```
Truck {
  id: string
  title: string
  description: string
  price: number
  status: "available" | "sold" | "pending"
  type: "wrecker" | "rollback" | "rotator"
  images: string[]
  buildsheet_url: string
  specs: {
    chassis: string
    engine: string
    boom: string
    winch: string
    additional_features: string[]
  }
  created_at: timestamp
}
```

---

## Inquiry Model

```
Inquiry {
  id: string
  truck_id: string
  name: string
  email: string
  phone: string
  message: string
  created_at: timestamp
}
```

---

# 4. Component Structure

## Core Components

* Navbar
* Footer
* TruckCard
* TruckGallery
* InquiryForm
* AdminDashboard

---

## TruckCard

Used on inventory page

Props:

* title
* image
* price
* status

---

## InquiryForm

Used on truck detail pages

Fields:

* Name
* Email
* Phone
* Message

Behavior:

* Submits to backend
* Sends notification to sales team

---

# 5. API Routes

## Trucks

GET /api/trucks

* Fetch all trucks

GET /api/trucks/:id

* Fetch single truck

POST /api/trucks

* Create truck (admin only)

PUT /api/trucks/:id

* Update truck

DELETE /api/trucks/:id

* Delete truck

---

## Inquiries

POST /api/inquiries

* Save inquiry
* Trigger email notification

---

# 6. Image & File Storage

## Recommended (Supabase Storage)

* Store images in bucket: "trucks"
* Store buildsheets in bucket: "buildsheets"

## Alternative

* Use AWS S3
* Use Cloudinary for image optimization

---

# 7. Admin Workflow

1. Admin logs in
2. Navigates to /admin
3. Creates or edits truck
4. Uploads images
5. Uploads buildsheet
6. Saves listing

---

# 8. Form Submission Flow

1. User fills inquiry form
2. Data sent to /api/inquiries
3. Stored in database
4. Email sent to sales team

Email should include:

* Truck name
* Customer info
* Message

---

# 9. Deployment

* Push to GitHub
* Connect repo to Vercel
* Configure environment variables
* Deploy

---

# 10. Future Enhancements

* Search and filtering
* CRM integration
* Pricing calculator
* Saved builds

---

# 11. File Structure

```
/app
  /page.tsx
  /inventory/page.tsx
  /inventory/[id]/page.tsx
  /admin/page.tsx

/components
  TruckCard.tsx
  InquiryForm.tsx
  Navbar.tsx

/lib
  api.ts
  db.ts

/public/images

/styles

```

---

# 12. UI/UX Design Specifications

## Design Goals

* Clean, industrial, professional
* Emphasis on large equipment visuals
* Clear CTAs for sales conversion
* Mobile-first responsive design

---

## Typography

* Headings: Inter / Sans-serif (bold)
* Body: Inter / Sans-serif (regular)

Scale:

* H1: 48px
* H2: 36px
* H3: 28px
* Body: 16px
* Small: 14px

---

## Color Palette

Primary:

* Black: #111111
* Dark Gray: #2B2B2B

Accent:

* Safety Red: #D32F2F
* Steel Blue: #3A6EA5

Neutral:

* Light Gray: #F5F5F5
* White: #FFFFFF

Usage:

* Backgrounds: White / Light Gray
* Text: Black / Dark Gray
* Buttons: Red (primary), Blue (secondary)

---

## Layout System

* Max Width: 1200px
* Grid: 12-column
* Spacing Scale: 8px increments

Sections:

* Padding: 80px desktop / 40px mobile
* Gutters: 24px

---

## Core UI Patterns

### Buttons

Primary:

* Background: Red
* Text: White
* Padding: 12px 24px
* Rounded: 8px

Secondary:

* Outline or Blue background

Hover:

* Slight darkening + subtle shadow

---

### Cards (Truck Listings)

* Image top
* Title
* Price
* Status badge

Style:

* White background
* Rounded corners (12px)
* Shadow (soft)

---

### Forms

Fields:

* Full width
* Padding: 12px
* Border: 1px solid light gray
* Rounded: 6px

Focus State:

* Blue border highlight

---

## Page-Specific Design

### Home Page

Hero Section:

* Full-width image/video of truck
* Overlay text
* CTA button

Sections:

1. Hero
2. About / Capabilities
3. Build Process
4. Truck Types
5. CTA Banner

---

### Inventory Page

Layout:

* Grid (3 columns desktop, 1 mobile)

Filters (optional):

* Type
* Status

---

### Truck Detail Page

Layout:

* Left: Image gallery
* Right: Details + CTA

Sections:

* Gallery
* Specs
* Buildsheet download
* Inquiry form

---

### Admin Page

* Table layout for trucks
* Simple form for editing
* Drag-and-drop image upload

---

## Interaction Design

* Hover effects on cards
* Smooth transitions (200ms)
* Image zoom on hover

---

## Responsive Rules

Mobile:

* Single column layout
* Collapsible navigation

Tablet:

* 2-column grid

Desktop:

* 3–4 column grid

---

## Navigation

Navbar:

* Logo left
* Links right
* Sticky on scroll

Links:

* Home
* Inventory
* Contact

---

## Footer

* Company info
* Contact details
* Quick links

---

## Image Guidelines

* High-resolution truck images
* Consistent aspect ratio (16:9 preferred)
* Optimized for web

---

## UX Considerations

* Minimize clicks to contact sales
* Always show CTA
* Fast load times
* Clear hierarchy of information

---

# End of Document
