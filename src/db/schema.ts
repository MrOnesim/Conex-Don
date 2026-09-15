import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * Catalogue — albums, EPs, singles et projets live.
 */
export const releases = pgTable("releases", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  title: varchar("title", { length: 200 }).notNull(),
  kind: varchar("kind", { length: 24 }).notNull(), // album | ep | single | live
  releaseDate: varchar("release_date", { length: 20 }),
  year: integer("year").notNull(),
  trackCount: integer("track_count").notNull().default(0),
  duration: varchar("duration", { length: 24 }),
  tagline: text("tagline"),
  description: text("description"),
  longDescription: text("long_description"),
  coverImage: varchar("cover_image", { length: 240 }),
  accent: varchar("accent", { length: 24 }).notNull().default("#D6A83A"),
  label: varchar("label", { length: 160 }),
  links: jsonb("links").$type<Record<string, string>>(),
  featured: boolean("featured").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const tracks = pgTable("tracks", {
  id: serial("id").primaryKey(),
  releaseSlug: varchar("release_slug", { length: 120 }).notNull(),
  position: integer("position").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  featuring: varchar("featuring", { length: 200 }),
  duration: varchar("duration", { length: 16 }),
  note: text("note"),
});

export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 140 }).notNull().unique(),
  title: varchar("title", { length: 200 }).notNull(),
  category: varchar("category", { length: 60 }).notNull(),
  year: integer("year").notNull(),
  youtubeId: varchar("youtube_id", { length: 40 }),
  searchQuery: varchar("search_query", { length: 200 }).notNull(),
  image: varchar("image", { length: 240 }),
  accent: varchar("accent", { length: 24 }).notNull().default("#6F4A32"),
  description: text("description"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  city: varchar("city", { length: 120 }),
  country: varchar("country", { length: 120 }),
  venue: varchar("venue", { length: 200 }),
  eventDate: varchar("event_date", { length: 40 }),
  status: varchar("status", { length: 24 }).notNull().default("upcoming"),
  note: text("note"),
  ticketUrl: varchar("ticket_url", { length: 300 }),
  image: varchar("image", { length: 240 }),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const newsPosts = pgTable("news_posts", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  title: varchar("title", { length: 240 }).notNull(),
  category: varchar("category", { length: 40 }).notNull(),
  excerpt: text("excerpt").notNull(),
  body: text("body"),
  publishedAt: varchar("published_at", { length: 40 }),
  source: varchar("source", { length: 160 }),
  sourceUrl: varchar("source_url", { length: 400 }),
  image: varchar("image", { length: 240 }),
  sortOrder: integer("sort_order").notNull().default(0),
});

/** Demandes de booking / partenariats. */
export const bookingRequests = pgTable("booking_requests", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  organization: varchar("organization", { length: 200 }),
  email: varchar("email", { length: 200 }).notNull(),
  phone: varchar("phone", { length: 80 }),
  country: varchar("country", { length: 120 }),
  city: varchar("city", { length: 120 }),
  eventType: varchar("event_type", { length: 120 }),
  eventDate: varchar("event_date", { length: 60 }),
  capacity: varchar("capacity", { length: 60 }),
  budget: varchar("budget", { length: 80 }),
  message: text("message"),
  status: varchar("status", { length: 24 }).notNull().default("nouveau"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Communauté ALOBA — contenus de fans. */
export const alobaPosts = pgTable("aloba_posts", {
  id: serial("id").primaryKey(),
  displayName: varchar("display_name", { length: 120 }).notNull(),
  handle: varchar("handle", { length: 120 }),
  city: varchar("city", { length: 120 }),
  mood: varchar("mood", { length: 60 }),
  message: text("message").notNull(),
  approved: boolean("approved").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 200 }).notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
