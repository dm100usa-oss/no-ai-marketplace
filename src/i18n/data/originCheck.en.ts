import type { OriginCheckCopy } from "./originCheck.types";

/** No AI Directory Origin Check, English copy. Written for the page, not
 *  translated from the Russian: the questions have to sound like something
 *  a client would actually say on a call. */
export const originCheckEn: OriginCheckCopy = {
  metaTitle: "Origin Check: how to check where a piece of work came from",
  metaDescription:
    "A No AI Directory tool: how to check the origin of work in a specific trade. What a real piece leaves behind, what to ask for, and which answers should give you pause.",
  title: "No AI Directory Origin Check",
  tagline: "Checking where a piece of work came from",
  definition:
    "A tool that helps a client check where a piece of work came from. It shows what to look for, what to ask the person you are hiring, and which answers should give you pause, so your conclusion rests on something.",

  notDetectorTitle: "This is not a detector",
  notDetectorText:
    "Origin Check scans nothing and delivers no verdict. Judging a finished file on its own is very hard, and the tools that promise otherwise get it wrong in both directions. What you can read is the trail around the work: rough drafts, versions along the way, working files, the marks left by rethinking something. That is what Origin Check points you at. The conclusion is yours.",

  howTitle: "How to use it",
  howSteps: [
    "Pick the field and the trade you are hiring in.",
    "Read what a real piece of work leaves behind in that trade.",
    "Take the questions into your first call and weigh the answers against the notes.",
    "Put the answers together: no single item settles it, but the picture either holds up or it does not.",
  ],

  chooseTitle: "Pick a trade",
  chooseIntro:
    "Every trade leaves a different trail. A photographer has the camera originals, a translator has working drafts, an architect has drawings and details. So each trade gets its own guide.",
  chooseEmpty:
    "Guides for the remaining fields are being written and will appear here as they are finished.",

  professionLeadTitle: "What a real piece of work leaves behind",
  signsTitle: "What to look for",
  askTitle: "What to ask",
  warnTitle: "What should give you pause",
  goodLabel: "What you want to hear",
  badLabel: "What should give you pause",
  decisionTitle: "Putting it together",
  decisionText:
    "One weak answer proves nothing on its own. Files get lost, memories blur, and a contract with a previous client may forbid showing the working materials. Read the whole picture instead. One draft is easy enough to produce after the fact; a whole chain that runs in order, belongs to this specific piece, and matches what the person tells you usually costs more to fake than the work costs to do.",

  downloadLabel: "Save or print",
  copyLabel: "Copy as text",
  copiedLabel: "Copied",
  backLabel: "All trades",

  professions: {
    architects: {
      title: "Architects",
      metaTitle: "How to check the origin of an architect's work",
      metaDescription:
        "What a real architectural project leaves behind, what to ask for before you hire, and which answers should give you pause. Origin Check by No AI Directory.",
      lead: "A building is not a picture of a facade. It is a chain of decisions: how it sits on the site, how it stands up, how the details resolve, how it meets code. An image can be generated; that chain cannot. So look at the documentation, and at whether it matches what actually got built.",
      signs: [
        "Working drawings, not just presentation views: plans, sections, details, schedules.",
        "A real site behind it: boundaries, levels, sun, access, what the neighbors built.",
        "Code and permitting specific to the country and the city the building stands in.",
        "Evidence of rethinking: site plans that were dropped, review comments and the fixes for them.",
        "Photographs of the finished building that match the drawings down to the details.",
      ],
      ask: [
        {
          q: "Can you show me the working drawings for a built project, and photos of what got built?",
          good: "Drawings and photos line up, down to the details and the materials.",
          bad: "Renderings only. No drawing set for any project.",
        },
        {
          q: "How did you resolve this detail, and why that way?",
          good: "An answer on the spot, with materials, thicknesses and the reason behind the choice.",
          bad: "Talk about style, composition and mood instead of construction.",
        },
        {
          q: "What changed after the plan review comments?",
          good: "A specific comment and the specific move that resolved it.",
          bad: "There were no comments. It went through the first time.",
        },
        {
          q: "Can you show me the early site plan options?",
          good: "Several schemes, and why each one was dropped.",
          bad: "The final scheme only. Nothing in between survived.",
        },
        {
          q: "What did you draw and calculate this in, and where does AI come into it?",
          good: "Named software, named calculations, and a straight line between what helped and what was not used.",
          bad: 'A vague "I do it all myself" with no specifics at all.',
        },
      ],
      warn: [
        "A flawless facade with not one section or detail behind it.",
        "A portfolio shot entirely in the same perfect light, with no working file anywhere.",
        "A project with no tie to any specific building code: those are hard to invent convincingly.",
      ],
    },

    "interior-designers": {
      title: "Interior designers",
      metaTitle: "How to check the origin of an interior designer's work",
      metaDescription:
        "What a real interior project leaves behind, what to ask for before you hire, and which answers should give you pause. Origin Check by No AI Directory.",
      lead: "A beautiful render of a room takes minutes now. Interior design starts where the render stops: measuring the actual space, planning around the walls you have, elevations, details, and a specification of things somebody can actually buy and install.",
      signs: [
        "A measured survey of a real space, with dimensions, windows, risers and ceiling heights.",
        "Layout options, usually several, showing what changed and why.",
        "Wall elevations, floor and ceiling plans, outlet and lighting layouts.",
        "A specification with model numbers and suppliers, not just \"wood and brass\".",
        "Photos of the finished space taken from the same viewpoints as the renders.",
      ],
      ask: [
        {
          q: "Can you show me a render and a photo of the same corner after the work was done?",
          good: "Same viewpoint, same dimensions, same materials, and any differences get explained.",
          bad: "No photos of finished work at all, only visuals.",
        },
        {
          q: "Can I see the specification for this project?",
          good: "Actual items, model numbers, suppliers, and the substitutions made along the way.",
          bad: "Materials described in general terms. No list exists.",
        },
        {
          q: "What had to change on site, and why?",
          good: "A specific case: something did not fit, the plumbing moved, a supplier fell through.",
          bad: "Everything was built exactly as drawn.",
        },
        {
          q: "Can you show me the survey and the first layout options?",
          good: "There is a measured survey and several layouts, with reasons they were dropped.",
          bad: "Only the final layout, with nothing in between.",
        },
        {
          q: "How do you handle visualization, and where does AI come into it?",
          good: "Named software, what was modelled by hand, and where AI helped.",
          bad: "Circling the question without naming a single tool.",
        },
      ],
      warn: [
        "A portfolio of renders with no photograph of a finished room anywhere in it.",
        "Furniture and lighting that no supplier carries.",
        "Rooms with no windows, risers or doors where they would have to be: generated images slip here most often.",
      ],
    },

    "landscape-designers": {
      title: "Landscape designers",
      metaTitle: "How to check the origin of a landscape designer's work",
      metaDescription:
        "What a real landscape project leaves behind, what to ask for before you hire, and which answers should give you pause. Origin Check by No AI Directory.",
      lead: "Landscape is the one trade whose work keeps changing for years, and that is its best protection. A real project is tied to a site, a climate and a growth rate, and a real designer has photographs of the same spot in different seasons and different years.",
      signs: [
        "A site plan with grade, orientation, drainage and the trees that were already there.",
        "A planting plan with species names and a schedule with quantities.",
        "Plants that actually overwinter in that hardiness zone.",
        "Photos of the same spot right after planting and a year or two later.",
        "Decisions about water: irrigation, runoff, what was done about the wet corner.",
      ],
      ask: [
        {
          q: "Can you show me this garden right after planting and a season later?",
          good: "Same viewpoint, things have grown in, and something had to be replaced.",
          bad: "One perfect frame, taken who knows when.",
        },
        {
          q: "Can I see the planting plan and the schedule?",
          good: "Species, quantities, sizes at planting, substitutions and why they happened.",
          bad: "No schedule. Plants described in general terms.",
        },
        {
          q: "Why these plants for this particular spot?",
          good: "An answer about hardiness zone, light, soil, water and upkeep.",
          bad: "An answer about beauty and mood, with no site conditions in it.",
        },
        {
          q: "What failed to establish, and what did you do about it?",
          good: "A specific case and a specific fix.",
          bad: "Everything took, every time.",
        },
        {
          q: "How was drainage handled on this site?",
          good: "A clear account with grades, drains and where the water ends up.",
          bad: "It never came up.",
        },
      ],
      warn: [
        "A garden where everything blooms at once. Nothing in nature does that.",
        "Plants that cannot survive winter in the region named.",
        "Not a single photograph of the site taken any time after handover.",
      ],
    },
  },
};
