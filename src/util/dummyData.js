// dummyData.js — Fake AI Summary generator rules (pure JSON/data format)
//
// Condition operators used in AI_SUMMARY_RULES[].conditions (all conditions = AND logic):
//   group_is        { op, group, value }         sel[group] === value
//   group_in        { op, group, values }         values.includes(sel[group])
//   group_contains  { op, group, value }          sel[group]?.includes(value)
//   group_missing   { op, group }                 !sel[group]
//   any_in          { op, values, min }           count of sel values that appear in list >= min
//   any_contains    { op, substring }             any sel value includes substring
//   room_is         { op, rooms }                 room id is in rooms[] (applied externally)

// ─── 0. SHARED COST TIER CALCULATOR ──────────────────────────────────────────
// Dominant-bucket: whichever cost level (1=low, 2=medium, 3=high) has the most
// selected items wins. Returns "low" | "medium" | "high" | null.
export const getCostTier = (selectedItems) => {
  if (!selectedItems?.length) return null;
  const counts = selectedItems.reduce(
    (acc, item) => {
      if (item.cost === 1) acc.low++;
      else if (item.cost === 2) acc.medium++;
      else if (item.cost === 3) acc.high++;
      return acc;
    },
    { low: 0, medium: 0, high: 0 }
  );
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
};

// ─── 1. PER-ROOM MATERIAL CATEGORIES ─────────────────────────────────────────
// Used to compute Missing Selections (each room has unique groups)
export const ROOM_CATEGORIES = {
  kitchen:     ["Flooring", "Wall Finish", "Benchtop", "Cabinetry", "Lighting"],
  bathroom:    ["Flooring", "Wall Finish", "Vanity", "Fixtures", "Lighting"],
  living_room: ["Flooring", "Wall Finish", "Sofa", "Coffee Table", "Lighting"],
  bedroom:     ["Flooring", "Wall Finish", "Bed Frame", "Wardrobe", "Lighting"],
  laundry:     ["Flooring", "Wall Finish", "Cabinetry", "Benchtop", "Lighting"],
};

// ─── 2. COST TIER CONFIG ──────────────────────────────────────────────────────
export const COST_CONFIG = {
  low: {
    label: "BUDGET",
    colorClass: "text-green-400",
    bgClass: "bg-green-900/30",
    message:
      "Budget-friendly selections throughout. Consider upgrading one hero surface — benchtop or flooring — to elevate the overall finish.",
    actions: [
      "Consider upgrading one high-visibility element (benchtop or flooring) for a stronger impression.",
      "Budget materials can look premium with the right lighting — prioritise this category.",
    ],
  },
  medium: {
    label: "MID RANGE",
    colorClass: "text-yellow-400",
    bgClass: "bg-yellow-900/30",
    message:
      "A well-balanced mid-range selection. Remaining spend is best directed at high-visibility elements like hardware and lighting.",
    actions: [
      "Allocate remaining budget to hardware and lighting for maximum visual impact.",
      "Consider a single premium upgrade — a marble benchtop or statement pendant — as a hero piece.",
    ],
  },
  high: {
    label: "PREMIUM",
    colorClass: "text-red-400",
    bgClass: "bg-red-900/30",
    message:
      "Premium selections throughout. Ensure your contractor brief includes detailed specifications to match the quality of materials specified.",
    actions: [
      "Obtain at least 3 specialist contractor quotes to match your premium material specifications.",
      "Consider a value-engineering review to find where premium items can be substituted without compromising aesthetics.",
      "Schedule a project manager to coordinate the high-specification finishes.",
    ],
  },
};

// ─── 3. OVERVIEW MESSAGES (per room × selection count 0-5) ───────────────────
export const OVERVIEW_MESSAGES = {
  kitchen: {
    0: "No selections made yet. Start with your Kitchen flooring to set the tone for the entire space.",
    1: "Getting started on your Kitchen — 1 of 5 categories selected. Keep building to unlock your full design summary.",
    2: "Building momentum in your Kitchen — 2 of 5 categories selected. Your design direction is beginning to emerge.",
    3: "Halfway through your Kitchen selections — 3 of 5 categories chosen. Your palette is taking shape.",
    4: "Almost there — 4 of 5 Kitchen categories selected. One final choice to complete your scheme.",
    5: "All 5 Kitchen categories selected. Your complete design palette is ready for analysis.",
  },
  bathroom: {
    0: "No selections made yet. Begin with your Bathroom flooring or wall finish to set the mood.",
    1: "Your Bathroom journey has begun — 1 of 5 categories selected. Keep going to unlock insights.",
    2: "2 of 5 Bathroom categories selected. A solid foundation is forming.",
    3: "3 of 5 Bathroom categories selected. Your spa-inspired palette is emerging.",
    4: "4 of 5 Bathroom categories selected. Nearly complete — one more selection to go.",
    5: "All 5 Bathroom categories selected. Your full wet area palette is ready.",
  },
  living_room: {
    0: "No selections made yet. Start with your Living Room flooring or sofa to anchor the space.",
    1: "1 of 5 Living Room categories selected — a strong start.",
    2: "2 of 5 Living Room categories selected. Your comfort zone is beginning to form.",
    3: "3 of 5 Living Room categories selected. The living space is coming alive.",
    4: "4 of 5 Living Room categories selected. Almost complete.",
    5: "All 5 Living Room categories selected. Your full scheme is ready for review.",
  },
  bedroom: {
    0: "No selections made yet. Begin with your Bedroom wall finish — it sets the entire mood.",
    1: "1 of 5 Bedroom categories selected.",
    2: "2 of 5 Bedroom categories selected. Your sanctuary is taking shape.",
    3: "3 of 5 Bedroom categories selected. A restful palette is emerging.",
    4: "4 of 5 Bedroom categories selected. One final selection to complete your retreat.",
    5: "All 5 Bedroom categories selected. Your full bedroom palette is ready.",
  },
  laundry: {
    0: "No selections made yet. Start planning your Laundry — a functional space that can still shine.",
    1: "1 of 5 Laundry categories selected.",
    2: "2 of 5 Laundry categories selected. Function is meeting form.",
    3: "3 of 5 Laundry categories selected. Your practical palette is forming.",
    4: "4 of 5 Laundry categories selected. Nearly complete.",
    5: "All 5 Laundry categories selected. Your efficient and stylish laundry is fully planned.",
  },
};

// ─── 4. ACTION TEMPLATES (keyed by scenario) ─────────────────────────────────
// Used to build Recommended Actions list dynamically
export const ACTION_TEMPLATES = {
  // Missing group actions (key matches group name lowercase with spaces → underscores)
  missing_flooring:     "Select a flooring material — it anchors the room and ties all other selections together.",
  missing_wall_finish:  "Choose a wall finish — it sets the backdrop and colour tone for every other element.",
  missing_benchtop:     "Select a benchtop — one of the most visible and heavily used surfaces in the room.",
  missing_cabinetry:    "Choose cabinetry — it defines the room's storage presence and architectural character.",
  missing_lighting:     "Add a lighting selection — lighting dramatically shapes mood, ambiance, and functionality.",
  missing_vanity:       "Select a vanity — the centrepiece of any bathroom design.",
  missing_fixtures:     "Choose fixtures — the finishing hardware that ties your bathroom together.",
  missing_sofa:         "Select a sofa — the anchor piece of any living room.",
  missing_coffee_table: "Choose a coffee table — it completes the living room layout and grounds the sofa.",
  missing_bed_frame:    "Select a bed frame — it defines your bedroom's style and primary comfort.",
  missing_wardrobe:     "Choose a wardrobe solution — critical for both function and room proportion.",
  // General actions
  physical_samples:     "Request physical samples to verify colour and texture under your home's natural light.",
  contractor_quotes:    "Obtain at least 3 contractor quotes once all selections are confirmed.",
  premium_brief:        "Prepare a detailed specification brief for your contractor to match your premium material quality.",
  value_engineer:       "Consider a value-engineering review to identify where premium items can be substituted without compromising aesthetics.",
  lighting_upgrade:     "Invest in quality lighting — it delivers the highest return per dollar on perceived room quality.",
  maintenance_plan:     "Factor ongoing sealing and maintenance into your long-term budget for all natural stone selections.",
  wet_area_waterproof:  "Confirm all wet area surfaces are rated and waterproofed to Australian standards before tiling.",
  colour_samples:       "Order sample swatches and place them in the actual room before committing — colours shift under different light conditions.",
};

// ─── 5. AI SUMMARY RULES ─────────────────────────────────────────────────────
// type: "flag"    → shown under Compatibility Flags (warnings)
// type: "insight" → shown under Design Insights (positive/neutral observations)
// rooms: "all"    → applies to every room; or array of room ids
export const AI_SUMMARY_RULES = [

  // ── GLOBAL FLAGS ─────────────────────────────────────────────────────────

  {
    id: "dark_room_warning",
    type: "flag",
    rooms: "all",
    conditions: [
      { op: "any_in", values: ["dark", "dark_t", "dark_f", "navy", "mblack"], min: 2 },
    ],
    message:
      "Multiple dark finishes detected — the room may feel enclosed. Balance with light accents, mirrors, or additional lighting.",
  },
  {
    id: "marble_maintenance",
    type: "flag",
    rooms: "all",
    conditions: [
      { op: "any_contains", substring: "marble" },
    ],
    message:
      "Marble requires regular sealing and care. Factor ongoing maintenance into your long-term budget.",
  },
  {
    id: "missing_lighting_warning",
    type: "flag",
    rooms: "all",
    conditions: [
      { op: "group_missing", group: "lighting" },
    ],
    message:
      "No lighting selected — lighting strongly shapes ambiance and functionality. Add this to complete your scheme.",
  },
  {
    id: "all_premium_surfaces",
    type: "flag",
    rooms: "all",
    conditions: [
      {
        op: "any_in",
        values: [
          "marble", "marble_f", "marble_v", "marble_t", "granite", "stone",
          "hardwood", "nat_stone", "b_gold", "custom", "platform", "leather", "built_in",
        ],
        min: 3,
      },
    ],
    message:
      "Multiple premium selections identified — ensure installation quality and contractor experience matches the calibre of materials specified.",
  },
  {
    id: "all_light_finishes",
    type: "insight",
    rooms: "all",
    conditions: [
      { op: "any_in", values: ["white", "white_t", "white_g", "laminate", "chrome", "float_w"], min: 3 },
    ],
    message:
      "Many light-toned finishes selected — add one darker or textured element to create depth and visual interest.",
  },
  {
    id: "timber_marble_pairing",
    type: "insight",
    rooms: "all",
    conditions: [
      { op: "any_in", values: ["timber", "hardwood", "eng_t", "timber_b", "timber_t", "timber_v", "oak"], min: 1 },
      { op: "any_contains", substring: "marble" },
    ],
    message:
      "Timber and marble pair beautifully — confirm warm tones align across all finishes for full cohesion.",
  },
  {
    id: "vinyl_premium_bench_mismatch",
    type: "flag",
    rooms: "all",
    conditions: [
      { op: "group_in", group: "flooring", values: ["vinyl", "ceramic", "hybrid", "carpet"] },
      { op: "group_in", group: "benchtop", values: ["marble", "granite", "eng_stone"] },
    ],
    message:
      "Budget flooring paired with a premium benchtop may feel inconsistent. Consider upgrading flooring or choosing a mid-range benchtop.",
  },
  {
    id: "dark_floor_light_wall_contrast",
    type: "insight",
    rooms: "all",
    conditions: [
      { op: "group_in", group: "flooring", values: ["concrete", "granite", "hardwood"] },
      { op: "group_in", group: "wall", values: ["white", "white_t", "subway"] },
    ],
    message:
      "Dark flooring with light walls creates strong visual contrast — a classic and grounding combination.",
  },
  {
    id: "matte_black_white_contrast",
    type: "insight",
    rooms: "all",
    conditions: [
      { op: "group_is", group: "fixtures", value: "mblack" },
      { op: "group_in", group: "wall", values: ["white_t", "white"] },
    ],
    message:
      "Matte black fixtures against white creates a bold contemporary contrast — a confident design move.",
  },
  {
    id: "cove_lighting_dark_wall",
    type: "insight",
    rooms: "all",
    conditions: [
      { op: "group_is", group: "lighting", value: "cove" },
      { op: "group_in", group: "wall", values: ["dark", "dark_t", "dark_f", "navy"] },
    ],
    message:
      "Cove lighting against a dark wall creates a dramatic layered glow effect — very effective for ambiance.",
  },
  {
    id: "recessed_hard_floor_modern",
    type: "insight",
    rooms: "all",
    conditions: [
      { op: "group_is", group: "lighting", value: "recessed" },
      { op: "group_in", group: "flooring", values: ["concrete", "large_t", "hardwood", "timber", "marble_f"] },
    ],
    message:
      "Recessed downlights with hard flooring reinforce a clean, modern aesthetic throughout.",
  },

  // ── KITCHEN ──────────────────────────────────────────────────────────────

  {
    id: "kitchen_dark_cab_marble_bench",
    type: "insight",
    rooms: ["kitchen"],
    conditions: [
      { op: "group_in", group: "cabinetry", values: ["navy", "mblack"] },
      { op: "group_in", group: "benchtop", values: ["marble", "eng_stone"] },
    ],
    message:
      "Dark cabinetry with a marble or engineered stone benchtop is a timeless kitchen pairing. Consider brushed gold hardware to complete the palette.",
  },
  {
    id: "kitchen_oak_timber_bench_heavy",
    type: "flag",
    rooms: ["kitchen"],
    conditions: [
      { op: "group_is", group: "cabinetry", value: "oak" },
      { op: "group_is", group: "benchtop", value: "timber_b" },
    ],
    message:
      "Oak cabinetry with a timber benchtop risks a heavy all-timber appearance. Consider a contrasting benchtop — engineered stone or marble — to break it up.",
  },
  {
    id: "kitchen_sage_white_wall",
    type: "insight",
    rooms: ["kitchen"],
    conditions: [
      { op: "group_is", group: "cabinetry", value: "sage" },
      { op: "group_in", group: "wall", values: ["white", "subway"] },
    ],
    message:
      "Sage green cabinetry with white or subway tile walls is a fresh, nature-inspired palette — highly popular in contemporary kitchens.",
  },
  {
    id: "kitchen_pendant_stone_bench",
    type: "insight",
    rooms: ["kitchen"],
    conditions: [
      { op: "group_is", group: "lighting", value: "pendant" },
      { op: "group_in", group: "benchtop", values: ["marble", "granite", "eng_stone"] },
    ],
    message:
      "Pendant lighting over a stone benchtop creates an elegant focal point — ensure pendant scale is proportionate to the island length.",
  },
  {
    id: "kitchen_undercab_led",
    type: "insight",
    rooms: ["kitchen"],
    conditions: [
      { op: "group_is", group: "lighting", value: "undercab" },
    ],
    message:
      "Under-cabinet LED lighting adds warmth to the benchtop workspace — a high-value, low-cost addition that rewards practically every day.",
  },
  {
    id: "kitchen_stone_wall_premium_bench",
    type: "flag",
    rooms: ["kitchen"],
    conditions: [
      { op: "group_is", group: "wall", value: "stone" },
      { op: "group_in", group: "benchtop", values: ["marble", "granite", "eng_stone"] },
    ],
    message:
      "Stone wall cladding with a premium benchtop is an impressive combination — budget carefully as both carry significant material and labour costs.",
  },
  {
    id: "kitchen_white_gloss_subway_classic",
    type: "insight",
    rooms: ["kitchen"],
    conditions: [
      { op: "group_is", group: "cabinetry", value: "white_g" },
      { op: "group_is", group: "wall", value: "subway" },
    ],
    message:
      "White gloss cabinetry with subway tile is a classic kitchen combination — timeless, easy to clean, and always in strong demand.",
  },
  {
    id: "kitchen_marble_floor_marble_bench",
    type: "flag",
    rooms: ["kitchen"],
    conditions: [
      { op: "group_is", group: "flooring", value: "marble_f" },
      { op: "group_in", group: "benchtop", values: ["marble", "eng_stone"] },
    ],
    message:
      "Marble on both floor and benchtop creates a luxurious but visually busy space. Vary the veining or introduce a contrasting cabinetry tone to differentiate.",
  },
  {
    id: "kitchen_concrete_floor_dark_wall",
    type: "insight",
    rooms: ["kitchen"],
    conditions: [
      { op: "group_is", group: "flooring", value: "concrete" },
      { op: "group_is", group: "wall", value: "dark" },
    ],
    message:
      "Polished concrete with dark charcoal walls delivers an industrial-luxe kitchen feel — soften with warm timber accents and quality lighting.",
  },
  {
    id: "kitchen_navy_cab_timber_floor",
    type: "insight",
    rooms: ["kitchen"],
    conditions: [
      { op: "group_is", group: "cabinetry", value: "navy" },
      { op: "group_is", group: "flooring", value: "timber" },
    ],
    message:
      "Navy cabinetry with timber flooring is a warm, coastal-inspired pairing — add brushed brass hardware for full cohesion.",
  },
  {
    id: "kitchen_all_budget",
    type: "insight",
    rooms: ["kitchen"],
    conditions: [
      { op: "group_in", group: "flooring", values: ["vinyl", "ceramic"] },
      { op: "group_is", group: "benchtop", value: "laminate" },
      { op: "group_is", group: "cabinetry", value: "white_g" },
    ],
    message:
      "A fully budget-conscious kitchen — highly practical. Adding one premium element such as a stone benchtop or pendant light can dramatically uplift the result.",
  },
  {
    id: "kitchen_track_dark_cab",
    type: "insight",
    rooms: ["kitchen"],
    conditions: [
      { op: "group_is", group: "lighting", value: "track" },
      { op: "group_in", group: "cabinetry", values: ["mblack", "navy"] },
    ],
    message:
      "Track lighting with dark cabinetry creates a contemporary, gallery-like kitchen aesthetic.",
  },
  {
    id: "kitchen_granite_bench_stone_wall",
    type: "flag",
    rooms: ["kitchen"],
    conditions: [
      { op: "group_is", group: "benchtop", value: "granite" },
      { op: "group_is", group: "wall", value: "stone" },
    ],
    message:
      "Granite benchtop with stone wall cladding are both bold textures — ensure tones harmonise or you risk a competing, disjointed palette.",
  },
  {
    id: "kitchen_mblack_cab_white_wall",
    type: "insight",
    rooms: ["kitchen"],
    conditions: [
      { op: "group_is", group: "cabinetry", value: "mblack" },
      { op: "group_in", group: "wall", values: ["white", "subway"] },
    ],
    message:
      "Matte black cabinetry against white walls is a striking monochromatic contrast — one of the strongest contemporary kitchen combinations.",
  },
  {
    id: "kitchen_vinyl_floor_pendant",
    type: "insight",
    rooms: ["kitchen"],
    conditions: [
      { op: "group_is", group: "flooring", value: "vinyl" },
      { op: "group_is", group: "lighting", value: "pendant" },
    ],
    message:
      "Vinyl plank flooring is a practical budget choice — investing in quality pendant lighting will elevate the overall perceived finish.",
  },

  // ── BATHROOM ─────────────────────────────────────────────────────────────

  {
    id: "bathroom_gold_marble_vanity",
    type: "insight",
    rooms: ["bathroom"],
    conditions: [
      { op: "group_is", group: "fixtures", value: "b_gold" },
      { op: "group_is", group: "vanity", value: "marble_v" },
    ],
    message:
      "Brushed gold fixtures with a marble vanity top is a luxurious pairing — keep surrounding tiles neutral to let these hero elements shine.",
  },
  {
    id: "bathroom_terrazzo_wall",
    type: "insight",
    rooms: ["bathroom"],
    conditions: [
      { op: "group_is", group: "wall", value: "terrazzo" },
    ],
    message:
      "Terrazzo is a bold wall choice with strong visual texture — keep flooring and fixtures simple to avoid pattern overload.",
  },
  {
    id: "bathroom_mblack_dark_tile_cave",
    type: "flag",
    rooms: ["bathroom"],
    conditions: [
      { op: "group_is", group: "fixtures", value: "mblack" },
      { op: "group_is", group: "wall", value: "dark_t" },
    ],
    message:
      "Matte black fixtures with dark tiles creates a very moody bathroom — ensure lighting is strong enough to prevent the space feeling cave-like.",
  },
  {
    id: "bathroom_chrome_white_classic",
    type: "insight",
    rooms: ["bathroom"],
    conditions: [
      { op: "group_is", group: "fixtures", value: "chrome" },
      { op: "group_is", group: "wall", value: "white_t" },
    ],
    message:
      "Chrome fixtures with white tiles is a timeless bathroom combination — enduring, easy to maintain, and universally appealing.",
  },
  {
    id: "bathroom_sconce_marble_vanity",
    type: "insight",
    rooms: ["bathroom"],
    conditions: [
      { op: "group_is", group: "lighting", value: "sconce" },
      { op: "group_is", group: "vanity", value: "marble_v" },
    ],
    message:
      "Wall sconces beside a marble vanity create a spa-like, boutique hotel atmosphere — a genuinely premium touch.",
  },
  {
    id: "bathroom_nat_stone_floor_wall",
    type: "flag",
    rooms: ["bathroom"],
    conditions: [
      { op: "group_is", group: "flooring", value: "nat_stone" },
      { op: "group_is", group: "wall", value: "stone_w" },
    ],
    message:
      "Natural stone on both floor and walls is a high-end wet area finish — budget for professional sealing and waterproofing to fully protect the investment.",
  },
  {
    id: "bathroom_hex_mosaic_floor",
    type: "insight",
    rooms: ["bathroom"],
    conditions: [
      { op: "group_is", group: "flooring", value: "hex" },
    ],
    message:
      "Hex mosaic flooring adds character and visual texture — pair with a simple wall tile to let the pattern breathe.",
  },
  {
    id: "bathroom_large_tile_float_vanity",
    type: "insight",
    rooms: ["bathroom"],
    conditions: [
      { op: "group_is", group: "flooring", value: "large_t" },
      { op: "group_is", group: "vanity", value: "float_w" },
    ],
    message:
      "Large format tiles with a floating white vanity create a spacious, uncluttered bathroom — excellent for maximising the feeling of size.",
  },
  {
    id: "bathroom_brushed_nickel_versatile",
    type: "insight",
    rooms: ["bathroom"],
    conditions: [
      { op: "group_is", group: "fixtures", value: "b_nickel" },
    ],
    message:
      "Brushed nickel is a versatile mid-range fixture finish — pairs confidently with both warm and cool toned tiles.",
  },
  {
    id: "bathroom_gold_dark_tile_drama",
    type: "insight",
    rooms: ["bathroom"],
    conditions: [
      { op: "group_is", group: "fixtures", value: "b_gold" },
      { op: "group_is", group: "wall", value: "dark_t" },
    ],
    message:
      "Brushed gold against dark tiles creates a dramatic, jewel-box contrast — ensure your lighting plan highlights the gold finish effectively.",
  },
  {
    id: "bathroom_timber_vanity_wet_area",
    type: "flag",
    rooms: ["bathroom"],
    conditions: [
      { op: "group_is", group: "vanity", value: "timber_v" },
    ],
    message:
      "A timber finish vanity adds warmth to a bathroom — confirm the product is rated for wet area use and specify appropriate sealing.",
  },
  {
    id: "bathroom_recessed_large_tile",
    type: "insight",
    rooms: ["bathroom"],
    conditions: [
      { op: "group_is", group: "lighting", value: "recessed" },
      { op: "group_in", group: "flooring", values: ["large_t", "marble_f"] },
    ],
    message:
      "Recessed downlights with large format or marble tiles emphasise clean geometry — a considered contemporary bathroom.",
  },
  {
    id: "bathroom_hex_floor_stone_wall",
    type: "flag",
    rooms: ["bathroom"],
    conditions: [
      { op: "group_is", group: "flooring", value: "hex" },
      { op: "group_is", group: "wall", value: "stone_w" },
    ],
    message:
      "Hex mosaic floor with natural stone walls introduces two strong textures — carefully confirm they read as complementary, not competing.",
  },
  {
    id: "bathroom_gold_white_tile",
    type: "insight",
    rooms: ["bathroom"],
    conditions: [
      { op: "group_is", group: "fixtures", value: "b_gold" },
      { op: "group_is", group: "wall", value: "white_t" },
    ],
    message:
      "Brushed gold fixtures on white tiles is a timeless luxury combination — warm, bright, and highly sellable.",
  },
  {
    id: "bathroom_terrazzo_mblack",
    type: "insight",
    rooms: ["bathroom"],
    conditions: [
      { op: "group_is", group: "wall", value: "terrazzo" },
      { op: "group_is", group: "fixtures", value: "mblack" },
    ],
    message:
      "Terrazzo walls with matte black fixtures is a bold, design-forward combination — a statement bathroom with strong visual identity.",
  },

  // ── LIVING ROOM ──────────────────────────────────────────────────────────

  {
    id: "living_carpet_sofa_warmth",
    type: "insight",
    rooms: ["living_room"],
    conditions: [
      { op: "group_is", group: "flooring", value: "carpet" },
    ],
    message:
      "Carpet adds warmth and acoustic comfort to a living room — ensure the tone complements your sofa and wall finish selection.",
  },
  {
    id: "living_leather_dark_wall",
    type: "insight",
    rooms: ["living_room"],
    conditions: [
      { op: "group_is", group: "sofa", value: "leather" },
      { op: "group_is", group: "wall", value: "dark_f" },
    ],
    message:
      "A leather sofa against a dark feature wall creates a moody, sophisticated living space — add warm lighting to keep it inviting.",
  },
  {
    id: "living_boucle_rattan_organic",
    type: "insight",
    rooms: ["living_room"],
    conditions: [
      { op: "group_is", group: "sofa", value: "boucle" },
      { op: "group_is", group: "table", value: "rattan" },
    ],
    message:
      "Boucle sofa with a rattan coffee table creates a warm, earthy organic aesthetic — complement with natural timber and woven accessories.",
  },
  {
    id: "living_marble_table_leather",
    type: "insight",
    rooms: ["living_room"],
    conditions: [
      { op: "group_is", group: "table", value: "marble_t" },
      { op: "group_is", group: "sofa", value: "leather" },
    ],
    message:
      "A marble coffee table with a leather sofa is a luxurious living room pairing — balance with softer textiles like a wool rug and linen cushions.",
  },
  {
    id: "living_statement_pendant_marble",
    type: "insight",
    rooms: ["living_room"],
    conditions: [
      { op: "group_is", group: "lighting", value: "pendant" },
      { op: "group_is", group: "table", value: "marble_t" },
    ],
    message:
      "A statement pendant above a marble coffee table creates a strong focal point — height and scale need careful consideration.",
  },
  {
    id: "living_wallpaper_feature",
    type: "insight",
    rooms: ["living_room"],
    conditions: [
      { op: "group_is", group: "wall", value: "wallpaper" },
    ],
    message:
      "Wallpaper makes a bold statement in a living room — apply to a single feature wall and keep surrounding surfaces neutral.",
  },
  {
    id: "living_lime_wash_artisan",
    type: "insight",
    rooms: ["living_room"],
    conditions: [
      { op: "group_is", group: "wall", value: "lime" },
    ],
    message:
      "Lime wash walls add artisanal texture and warmth — a highly sought-after finish in contemporary interiors.",
  },
  {
    id: "living_hardwood_boucle_premium",
    type: "insight",
    rooms: ["living_room"],
    conditions: [
      { op: "group_is", group: "flooring", value: "hardwood" },
      { op: "group_is", group: "sofa", value: "boucle" },
    ],
    message:
      "Hardwood timber flooring with a boucle sofa creates premium, layered warmth — one of the most coveted contemporary living room combinations.",
  },
  {
    id: "living_carpet_fabric_soft",
    type: "insight",
    rooms: ["living_room"],
    conditions: [
      { op: "group_is", group: "flooring", value: "carpet" },
      { op: "group_is", group: "sofa", value: "fabric" },
    ],
    message:
      "Carpet with a fabric sofa creates full upholstered softness — ideal for family living, but consider adding a hard surface accent for visual contrast.",
  },
  {
    id: "living_glass_table_white_minimal",
    type: "insight",
    rooms: ["living_room"],
    conditions: [
      { op: "group_is", group: "table", value: "glass_t" },
      { op: "group_is", group: "wall", value: "white" },
    ],
    message:
      "A glass coffee table with white walls maximises light and creates an open, minimal aesthetic — ideal for smaller living spaces.",
  },
  {
    id: "living_modular_recessed_contemporary",
    type: "insight",
    rooms: ["living_room"],
    conditions: [
      { op: "group_is", group: "sofa", value: "modular" },
      { op: "group_is", group: "lighting", value: "recessed" },
    ],
    message:
      "A modular sofa with recessed lighting creates a clean, contemporary living arrangement — flexible, family-friendly, and easy to live with.",
  },
  {
    id: "living_floor_lamp_warm_grey",
    type: "insight",
    rooms: ["living_room"],
    conditions: [
      { op: "group_is", group: "lighting", value: "floor_l" },
      { op: "group_is", group: "wall", value: "warm_g" },
    ],
    message:
      "A floor lamp with warm grey walls creates a cosy, intimate living atmosphere — perfect for relaxed entertaining.",
  },
  {
    id: "living_polished_concrete_rug",
    type: "insight",
    rooms: ["living_room"],
    conditions: [
      { op: "group_is", group: "flooring", value: "concrete" },
    ],
    message:
      "Polished concrete in a living room delivers a striking minimalist foundation — add a large area rug to soften acoustics and add warmth.",
  },
  {
    id: "living_eng_timber_modular",
    type: "insight",
    rooms: ["living_room"],
    conditions: [
      { op: "group_is", group: "flooring", value: "eng_t" },
      { op: "group_is", group: "sofa", value: "modular" },
    ],
    message:
      "Engineered timber flooring with a modular sofa is a practical and versatile combination — durable, contemporary, and easy to update over time.",
  },
  {
    id: "living_rattan_lime_wash",
    type: "insight",
    rooms: ["living_room"],
    conditions: [
      { op: "group_is", group: "table", value: "rattan" },
      { op: "group_is", group: "wall", value: "lime" },
    ],
    message:
      "Rattan with lime wash walls is a cohesive organic palette — layer with natural linen and dried botanicals to complete the look.",
  },

  // ── BEDROOM ──────────────────────────────────────────────────────────────

  {
    id: "bedroom_navy_platform_hotel",
    type: "insight",
    rooms: ["bedroom"],
    conditions: [
      { op: "group_is", group: "wall", value: "navy" },
      { op: "group_is", group: "bed", value: "platform" },
    ],
    message:
      "Deep navy walls with a platform bed creates a moody, hotel-inspired atmosphere. Add warm bedside lighting to soften the drama.",
  },
  {
    id: "bedroom_terracotta_warmth",
    type: "insight",
    rooms: ["bedroom"],
    conditions: [
      { op: "group_is", group: "wall", value: "terra" },
    ],
    message:
      "Terracotta is warm and earthy — pair with natural timber and linen tones for a cohesive, organic bedroom sanctuary.",
  },
  {
    id: "bedroom_terracotta_timber_floor",
    type: "insight",
    rooms: ["bedroom"],
    conditions: [
      { op: "group_is", group: "wall", value: "terra" },
      { op: "group_in", group: "flooring", values: ["timber", "eng_t"] },
    ],
    message:
      "Terracotta walls with timber flooring is a full organic palette — layer with woven textures and natural linen to complete the look.",
  },
  {
    id: "bedroom_built_in_dark_wall",
    type: "insight",
    rooms: ["bedroom"],
    conditions: [
      { op: "group_is", group: "wardrobe", value: "built_in" },
      { op: "group_in", group: "wall", values: ["navy", "dark_f"] },
    ],
    message:
      "Built-in wardrobe with a dark feature wall creates a premium, suite-like bedroom — plan internal wardrobe lighting for practicality.",
  },
  {
    id: "bedroom_cove_navy_drama",
    type: "insight",
    rooms: ["bedroom"],
    conditions: [
      { op: "group_is", group: "lighting", value: "cove" },
      { op: "group_is", group: "wall", value: "navy" },
    ],
    message:
      "Cove lighting with navy walls produces a dramatic, layered glow — a hotel-suite atmosphere that is very sought-after.",
  },
  {
    id: "bedroom_wallpaper_upholstered",
    type: "insight",
    rooms: ["bedroom"],
    conditions: [
      { op: "group_is", group: "wall", value: "wallpaper" },
      { op: "group_is", group: "bed", value: "uphol" },
    ],
    message:
      "Textured wallpaper with an upholstered bed creates layered, tactile luxury — keep other surfaces simple to let these elements lead.",
  },
  {
    id: "bedroom_metal_bed_light_wall_cold",
    type: "insight",
    rooms: ["bedroom"],
    conditions: [
      { op: "group_is", group: "bed", value: "metal" },
      { op: "group_in", group: "wall", values: ["white", "soft_g"] },
    ],
    message:
      "A metal bed frame with light walls creates a clean, minimal bedroom — add warm textiles to prevent the space feeling cold.",
  },
  {
    id: "bedroom_carpet_comfort",
    type: "insight",
    rooms: ["bedroom"],
    conditions: [
      { op: "group_is", group: "flooring", value: "carpet" },
    ],
    message:
      "Carpet in a bedroom adds warmth and acoustic softness underfoot — an excellent choice for comfort and noise reduction.",
  },
  {
    id: "bedroom_platform_recessed_minimal",
    type: "insight",
    rooms: ["bedroom"],
    conditions: [
      { op: "group_is", group: "bed", value: "platform" },
      { op: "group_is", group: "lighting", value: "recessed" },
    ],
    message:
      "A platform bed with recessed downlights creates a sleek, architectural bedroom — a well-considered contemporary design.",
  },
  {
    id: "bedroom_soft_grey_bedside_pendants",
    type: "insight",
    rooms: ["bedroom"],
    conditions: [
      { op: "group_is", group: "wall", value: "soft_g" },
      { op: "group_is", group: "lighting", value: "bs_pend" },
    ],
    message:
      "Soft grey walls with bedside pendants creates a serene, spa-like retreat — a calming and highly liveable combination.",
  },
  {
    id: "bedroom_sliding_wardrobe_eng_timber",
    type: "insight",
    rooms: ["bedroom"],
    conditions: [
      { op: "group_is", group: "wardrobe", value: "sliding" },
      { op: "group_in", group: "flooring", values: ["eng_t", "hybrid"] },
    ],
    message:
      "Sliding wardrobe doors with engineered timber flooring is a cohesive contemporary pairing — keep hardware finishes consistent throughout.",
  },
  {
    id: "bedroom_freestanding_wardrobe_scale",
    type: "insight",
    rooms: ["bedroom"],
    conditions: [
      { op: "group_is", group: "wardrobe", value: "freest" },
    ],
    message:
      "A freestanding wardrobe offers flexible placement — consider scale carefully relative to ceiling height to avoid a cramped feel.",
  },
  {
    id: "bedroom_solid_timber_premium_bed",
    type: "insight",
    rooms: ["bedroom"],
    conditions: [
      { op: "group_is", group: "flooring", value: "timber" },
      { op: "group_in", group: "bed", values: ["uphol", "platform"] },
    ],
    message:
      "Solid timber flooring with a premium bed frame creates a high-quality foundation — a strong investment for long-term resale value.",
  },
  {
    id: "bedroom_cove_soft_grey",
    type: "insight",
    rooms: ["bedroom"],
    conditions: [
      { op: "group_is", group: "lighting", value: "cove" },
      { op: "group_is", group: "wall", value: "soft_g" },
    ],
    message:
      "Cove lighting with soft grey walls creates a gentle, wraparound glow — a calming effect ideal for winding down.",
  },
  {
    id: "bedroom_hybrid_floor_modern",
    type: "insight",
    rooms: ["bedroom"],
    conditions: [
      { op: "group_is", group: "flooring", value: "hybrid" },
    ],
    message:
      "Hybrid flooring is a practical, waterproof choice for bedrooms — durable, cost-effective, and available in a wide range of timber looks.",
  },

  // ── LAUNDRY ───────────────────────────────────────────────────────────────

  {
    id: "laundry_custom_joinery_value",
    type: "insight",
    rooms: ["laundry"],
    conditions: [
      { op: "group_is", group: "cabinetry", value: "custom" },
    ],
    message:
      "Custom joinery in a laundry maximises storage efficiency and adds measurable resale value — a smart investment in a high-use space.",
  },
  {
    id: "laundry_custom_stone_premium",
    type: "insight",
    rooms: ["laundry"],
    conditions: [
      { op: "group_is", group: "cabinetry", value: "custom" },
      { op: "group_is", group: "benchtop", value: "stone" },
    ],
    message:
      "Custom joinery with a stone benchtop elevates the laundry to a premium utility space — a compelling feature for prospective buyers.",
  },
  {
    id: "laundry_all_budget",
    type: "insight",
    rooms: ["laundry"],
    conditions: [
      { op: "group_in", group: "flooring", values: ["vinyl", "ceramic"] },
      { op: "group_is", group: "benchtop", value: "laminate" },
      { op: "group_is", group: "cabinetry", value: "white_l" },
    ],
    message:
      "A fully budget-conscious laundry — highly practical and easy to maintain. Savings here can be redirected to more visible areas of the home.",
  },
  {
    id: "laundry_timber_timber_heavy",
    type: "flag",
    rooms: ["laundry"],
    conditions: [
      { op: "group_is", group: "cabinetry", value: "timber_v" },
      { op: "group_is", group: "benchtop", value: "timber" },
    ],
    message:
      "Timber veneer cabinetry with a timber benchtop may feel heavy in a laundry. Consider varying tones or introducing a contrasting element.",
  },
  {
    id: "laundry_pendant_elevated",
    type: "insight",
    rooms: ["laundry"],
    conditions: [
      { op: "group_is", group: "lighting", value: "pendant" },
    ],
    message:
      "A pendant in a laundry is an elevated design touch — select a simple, durable fitting suited to the functional demands of the space.",
  },
  {
    id: "laundry_dark_wall_task_light",
    type: "flag",
    rooms: ["laundry"],
    conditions: [
      { op: "group_is", group: "wall", value: "dark" },
    ],
    message:
      "Dark paint in a laundry creates a dramatic utility space — ensure task lighting is sufficiently bright for practical day-to-day use.",
  },
  {
    id: "laundry_concrete_custom_industrial",
    type: "insight",
    rooms: ["laundry"],
    conditions: [
      { op: "group_is", group: "flooring", value: "concrete" },
      { op: "group_is", group: "cabinetry", value: "custom" },
    ],
    message:
      "Polished concrete flooring with custom joinery creates an industrial-premium laundry — a boutique finish for a highly functional space.",
  },
  {
    id: "laundry_tile_splashback_practical",
    type: "insight",
    rooms: ["laundry"],
    conditions: [
      { op: "group_is", group: "wall", value: "tile_s" },
    ],
    message:
      "A tile splashback is both practical and decorative — a simple way to introduce pattern in a laundry without committing to a full feature wall.",
  },
  {
    id: "laundry_stone_bench_durable",
    type: "insight",
    rooms: ["laundry"],
    conditions: [
      { op: "group_is", group: "benchtop", value: "stone" },
    ],
    message:
      "A stone benchtop in a laundry is a durable and elegant upgrade — stain and moisture resistant when properly sealed.",
  },
  {
    id: "laundry_timber_cab_stone_bench",
    type: "insight",
    rooms: ["laundry"],
    conditions: [
      { op: "group_is", group: "cabinetry", value: "timber_v" },
      { op: "group_is", group: "benchtop", value: "stone" },
    ],
    message:
      "Timber veneer cabinetry with a stone benchtop in a laundry is a refined combination — warm and durable in equal measure.",
  },
  {
    id: "laundry_white_lam_downlights",
    type: "insight",
    rooms: ["laundry"],
    conditions: [
      { op: "group_is", group: "cabinetry", value: "white_l" },
      { op: "group_is", group: "lighting", value: "downlights" },
    ],
    message:
      "White laminate cabinetry with downlights is a clean, bright laundry solution — practical, easy to clean, and timeless.",
  },
];

export const AI_RULES = [

  // ── DARK ROOM WARNING ──────────────────────────────────────
  {
    id: 'dark_room',
    type: 'flag',
    check: (sel) => {
      const DARKS = ['dark', 'dark_t', 'dark_f', 'navy', 'mblack'];
      return Object.values(sel).filter(v => DARKS.includes(v)).length >= 2;
    },
    message: 'Multiple dark finishes detected — the room may feel enclosed. Balance with light accents, mirrors, or extra lighting.',
  },

  // ── MARBLE MAINTENANCE ─────────────────────────────────────
  {
    id: 'marble_maintenance',
    type: 'flag',
    check: (sel) => Object.values(sel).some(v => v.includes('marble')),
    message: 'Marble requires regular sealing and care. Factor ongoing maintenance into your long-term budget.',
  },

  // ── MISSING LIGHTING ───────────────────────────────────────
  {
    id: 'missing_lighting',
    type: 'insight',
    check: (sel) => !sel['lighting'],
    message: 'No lighting selected — lighting strongly shapes ambiance and functionality. Add this to complete your scheme.',
  },

  // ── TIMBER + MARBLE PAIRING ────────────────────────────────
  {
    id: 'timber_marble_pairing',
    type: 'insight',
    check: (sel) => {
      const TIMBERS = ['timber', 'hardwood', 'eng_t', 'timber_b', 'timber_t', 'timber_v'];
      const hasTimber = Object.values(sel).some(v => TIMBERS.includes(v));
      const hasMarble = Object.values(sel).some(v => v.includes('marble'));
      return hasTimber && hasMarble;
    },
    message: 'Timber and marble pair beautifully — confirm warm tones align across finishes for cohesion.',
  },

  // ── MATTE BLACK + WHITE CONTRAST ───────────────────────────
  {
    id: 'matte_black_white_contrast',
    type: 'insight',
    check: (sel) => sel['fixtures'] === 'mblack' && ['white_t', 'white'].includes(sel['wall']),
    message: 'Matte black fixtures against white creates a bold contemporary contrast — a confident design move.',
  },

  // ── KITCHEN: DARK CABINETRY + MARBLE BENCHTOP ──────────────
  {
    id: 'kitchen_dark_cab_marble',
    type: 'insight',
    rooms: ['kitchen'],
    check: (sel) => sel['benchtop']?.includes('marble') && ['navy', 'mblack'].includes(sel['cabinetry']),
    message: 'Dark cabinetry with marble benchtop is timeless. Consider brushed gold hardware to complete the palette.',
  },

  // ── LIVING ROOM: CARPET ────────────────────────────────────
  {
    id: 'living_carpet',
    type: 'insight',
    rooms: ['living'],
    check: (sel) => sel['flooring'] === 'carpet',
    message: 'Carpet adds warmth and acoustic comfort — ensure the tone complements your sofa selection.',
  },

  // ── ALL LIGHT FINISHES ─────────────────────────────────────
  {
    id: 'all_light',
    type: 'insight',
    check: (sel) => {
      const LIGHTS = ['white', 'white_t', 'white_g', 'laminate', 'chrome'];
      return Object.values(sel).filter(v => LIGHTS.includes(v)).length >= 3;
    },
    message: 'Many light-toned finishes selected — add one darker or textured element to create depth and visual interest.',
  },

  // ── HIGH CONTRAST: DARK FLOOR + WHITE WALL ─────────────────
  {
    id: 'dark_floor_light_wall',
    type: 'insight',
    check: (sel) => {
      const DARK_FLOORS = ['concrete', 'dark', 'granite'];
      const LIGHT_WALLS = ['white', 'white_t', 'subway'];
      return DARK_FLOORS.includes(sel['flooring']) && LIGHT_WALLS.includes(sel['wall']);
    },
    message: 'Dark flooring with light walls creates strong visual contrast — a classic and grounding combination.',
  },

  // ── BATHROOM: BRUSHED GOLD + MARBLE ────────────────────────
  {
    id: 'bathroom_gold_marble',
    type: 'insight',
    rooms: ['bathroom'],
    check: (sel) => sel['fixtures'] === 'b_gold' && sel['vanity']?.includes('marble'),
    message: 'Brushed gold fixtures with a marble vanity is a luxurious pairing — keep other elements neutral to let these shine.',
  },

  // ── BATHROOM: TERRAZZO WALL ─────────────────────────────────
  {
    id: 'bathroom_terrazzo',
    type: 'insight',
    rooms: ['bathroom'],
    check: (sel) => sel['wall'] === 'terrazzo',
    message: 'Terrazzo is a bold wall choice — keep flooring and fixtures simple to avoid visual clutter.',
  },

  // ── BEDROOM: DARK WALL + PLATFORM BED ──────────────────────
  {
    id: 'bedroom_dark_platform',
    type: 'insight',
    rooms: ['bedroom'],
    check: (sel) => sel['wall'] === 'navy' && sel['bed'] === 'platform',
    message: 'Deep navy walls with a platform bed creates a moody, hotel-like atmosphere. Add warm lighting to soften it.',
  },

  // ── BEDROOM: TERRACOTTA WALL ───────────────────────────────
  {
    id: 'bedroom_terracotta',
    type: 'insight',
    rooms: ['bedroom'],
    check: (sel) => sel['wall'] === 'terra',
    message: 'Terracotta is warm and earthy — pair with natural timber and linen tones for a cohesive organic feel.',
  },

  // ── KITCHEN: ALL PREMIUM ───────────────────────────────────
  {
    id: 'kitchen_all_premium',
    type: 'flag',
    rooms: ['kitchen'],
    check: (sel) => {
      const premiums = ['marble', 'marble_f', 'granite', 'stone'];
      return Object.values(sel).filter(v => premiums.includes(v)).length >= 2;
    },
    message: 'Multiple premium stone surfaces selected — ensure your cabinetry and joinery quality matches to avoid an inconsistent finish.',
  },

  // ── LAUNDRY: CUSTOM JOINERY ────────────────────────────────
  {
    id: 'laundry_custom_joinery',
    type: 'insight',
    rooms: ['laundry'],
    check: (sel) => sel['cabinetry'] === 'custom',
    message: 'Custom joinery in a laundry is a smart investment — maximises storage and adds significant resale value.',
  },

  // ── VINYL + STONE BENCHTOP ─────────────────────────────────
  {
    id: 'vinyl_stone_mismatch',
    type: 'flag',
    check: (sel) => {
      const hasCheapFloor = ['vinyl', 'ceramic', 'hybrid'].includes(sel['flooring']);
      const hasExpensiveBench = ['marble', 'granite', 'eng_stone'].includes(sel['benchtop']);
      return hasCheapFloor && hasExpensiveBench;
    },
    message: 'Budget flooring paired with a premium benchtop may feel inconsistent. Consider upgrading flooring or choosing a mid-range benchtop.',
  },

  // ── COVE LIGHTING + DARK WALL ──────────────────────────────
  {
    id: 'cove_dark_wall',
    type: 'insight',
    check: (sel) => {
      const DARKS = ['dark', 'dark_t', 'dark_f', 'navy'];
      return sel['lighting'] === 'cove' && DARKS.includes(sel['wall']);
    },
    message: 'Cove lighting against a dark wall creates a dramatic, layered glow effect — very effective for ambiance.',
  },

];
