import type { Category } from "@/lib/types";

/**
 * Categories (TZ 3.3). Created as data, not hard-coded. Each category
 * gets its own indexable page with an SEO intro (TZ 5.3: no empty pages
 * made only of cards). Adding a category is adding an entry here.
 */
export const categories: Category[] = [
  // ---- Art & Illustration ----
  {
    slug: "illustrators",
    name: "Illustrators",
    direction: "art-and-illustration",
    shortDescription: "Illustrators who draw by hand across styles and media.",
    seoText:
      "Illustrators on No AI Marketplace draw by hand, without AI generation. This category covers editorial, book, product and decorative illustration in a range of media — pen and ink, watercolour, gouache, digital hand-drawing and mixed technique. Each illustrator links to their own portfolio or shop, where you can commission a piece or buy prints directly.",
    seoTitle: "Illustrators — human-made, hand-drawn illustration",
    seoDescription:
      "Find illustrators who draw by hand, without AI. Browse human-made illustration and commission each artist directly.",
  },
  {
    slug: "childrens-book-illustrators",
    name: "Children's Book Illustrators",
    direction: "art-and-illustration",
    shortDescription: "Artists illustrating children's books by hand.",
    seoText:
      "Children's book illustrators here create characters and picture-book art by hand, without AI. This category is for authors, publishers and parents looking for warm, human illustration for children's stories — in watercolour, ink, gouache and mixed media. Every profile links straight to the illustrator's portfolio for direct commissions.",
    seoTitle: "Children's Book Illustrators — human, hand-drawn picture-book art",
    seoDescription:
      "Directory of children's book illustrators who draw by hand, without AI. Commission human-made picture-book illustration directly.",
  },
  {
    slug: "fine-artists",
    name: "Fine Artists",
    direction: "art-and-illustration",
    shortDescription: "Painters and fine artists making original work.",
    seoText:
      "Fine artists on the platform paint and create original work by hand, without AI. This category covers painting, drawing and mixed-media fine art from independent artists who sell originals and prints. Each profile links to the artist's own site or gallery shop for direct purchase or commission.",
    seoTitle: "Fine Artists — human-made original painting and drawing",
    seoDescription:
      "Find fine artists who paint and draw by hand, without AI. Browse original human-made art and buy directly from each artist.",
  },

  // ---- Writing & Publishing ----
  {
    slug: "writers",
    name: "Writers",
    direction: "writing-and-publishing",
    shortDescription: "Authors and writers producing original text.",
    seoText:
      "Writers here produce original text by hand, without AI generation. This category covers fiction and non-fiction authors, article writers and storytellers who can show the human process behind their words. Each profile links to the writer's own site or portfolio, where you can read samples and hire directly.",
    seoTitle: "Writers — human authors writing without AI",
    seoDescription:
      "Directory of writers and authors who write by hand, without AI. Find human-made text and hire each writer directly.",
  },
  {
    slug: "copywriters",
    name: "Copywriters",
    direction: "writing-and-publishing",
    shortDescription: "Copywriters for brands, sites and campaigns.",
    seoText:
      "Copywriters on No AI Marketplace write marketing and brand copy by hand, without AI. This category is for businesses that want website copy, product descriptions, campaigns and brand voice written by a real person. Each profile links to the copywriter's own portfolio for direct contact.",
    seoTitle: "Copywriters — human copywriting without AI",
    seoDescription:
      "Find copywriters who write brand and marketing copy by hand, without AI. Hire human copywriters directly.",
  },
  {
    slug: "editors",
    name: "Editors",
    direction: "writing-and-publishing",
    shortDescription: "Editors and proofreaders for manuscripts and content.",
    seoText:
      "Editors here refine and proofread text by hand, without AI. This category covers copy editing, line editing, developmental editing and proofreading for books, articles and business content. Each profile links to the editor's own site or portfolio for direct enquiries.",
    seoTitle: "Editors — human editing and proofreading",
    seoDescription:
      "Directory of editors and proofreaders who work by hand, without AI. Find human editing and contact each editor directly.",
  },

  // ---- Design & Branding ----
  {
    slug: "graphic-designers",
    name: "Graphic Designers",
    direction: "design-and-branding",
    shortDescription: "Designers for print, digital and visual identity.",
    seoText:
      "Graphic designers on the platform create visual work by hand, without relying on AI generation. This category covers print, digital, layout and visual-identity design from independent designers and studios. Each profile links to the designer's own website or portfolio for direct hiring.",
    seoTitle: "Graphic Designers — human graphic design without AI",
    seoDescription:
      "Find graphic designers who design by hand, without AI. Browse human-made design and reach each designer directly.",
  },
  {
    slug: "logo-designers",
    name: "Logo Designers",
    direction: "design-and-branding",
    shortDescription: "Designers crafting original logos and marks.",
    seoText:
      "Logo designers here craft original logos and brand marks by hand, without AI. This category is for businesses looking for a unique, human-designed logo and identity system. Each profile links to the designer's own portfolio, where you can see past marks and commission directly.",
    seoTitle: "Logo Designers — original human-made logos",
    seoDescription:
      "Directory of logo designers who create original marks by hand, without AI. Commission a human-made logo directly.",
  },

  // ---- Photography & Video ----
  {
    slug: "photographers",
    name: "Photographers",
    direction: "photography-and-video",
    shortDescription: "Photographers shooting real images behind a camera.",
    seoText:
      "Photographers on No AI Marketplace shoot real images behind a real camera, without AI generation. This category covers portrait, product, event, food and documentary photography from independent photographers and studios. Each profile links to the photographer's own site or portfolio for direct booking.",
    seoTitle: "Photographers — real human photography without AI",
    seoDescription:
      "Find photographers who shoot real images, without AI. Browse human-made photography and book each photographer directly.",
  },
  {
    slug: "videographers",
    name: "Videographers",
    direction: "photography-and-video",
    shortDescription: "Videographers filming and editing real footage.",
    seoText:
      "Videographers here film and edit real footage, without AI generation. This category covers event, brand, documentary and product video from independent videographers and small studios. Each profile links to the creator's own site or showreel for direct booking.",
    seoTitle: "Videographers — real human video without AI",
    seoDescription:
      "Directory of videographers who film real footage, without AI. Find human-made video and book each creator directly.",
  },
];
