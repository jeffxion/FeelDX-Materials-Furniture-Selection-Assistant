export const ROOMS=[
  {id:'kitchen',label:'Kitchen',emoji:'🍳'},
  {id:'bathroom',label:'Bathroom',emoji:'🛁'},
  {id:'living_room',label:'Living Room',emoji:'🛋️'},
  {id:'bedroom',label:'Bedroom',emoji:'🛏️'},
  {id:'laundry',label:'Laundry',emoji:'🧺'},
];

export const MAT={
  kitchen:[
    {group:'Flooring',key:'flooring',opts:[
      {id:'timber',label:'Timber',cost:2,color:'#c4995e'},
      {id:'ceramic',label:'Ceramic Tile',cost:1,color:'#b0b8c8'},
      {id:'vinyl',label:'Vinyl Plank',cost:1,color:'#8fa88a'},
      {id:'concrete',label:'Polished Concrete',cost:2,color:'#9a9a9a'},
      {id:'marble_f',label:'Marble',cost:3,color:'#ede6dc'},
    ]},
    {group:'Wall Finish',key:'wall',opts:[
      {id:'white',label:'White Paint',cost:1,color:'#f0f0f0'},
      {id:'subway',label:'Subway Tile',cost:1,color:'#e8e8e2'},
      {id:'dark',label:'Dark Charcoal',cost:1,color:'#3a3a3a',dk:1},
      {id:'stone',label:'Stone Cladding',cost:3,color:'#a09278'},
    ]},
    {group:'Benchtop',key:'benchtop',opts:[
      {id:'laminate',label:'Laminate',cost:1,color:'#d4c8b8'},
      {id:'marble',label:'Marble',cost:3,color:'#ede6dc'},
      {id:'eng_stone',label:'Engineered Stone',cost:2,color:'#c8c0b8'},
      {id:'timber_b',label:'Timber',cost:2,color:'#b8864a'},
      {id:'granite',label:'Granite',cost:3,color:'#787060'},
    ]},
    {group:'Cabinetry',key:'cabinetry',opts:[
      {id:'white_g',label:'White Gloss',cost:1,color:'#f5f5f5'},
      {id:'oak',label:'Oak Veneer',cost:2,color:'#c8a060'},
      {id:'navy',label:'Navy Blue',cost:2,color:'#2a3a5a',dk:1},
      {id:'mblack',label:'Matte Black',cost:2,color:'#2a2a2a',dk:1},
      {id:'sage',label:'Sage Green',cost:2,color:'#7a9178'},
    ]},
    {group:'Lighting',key:'lighting',opts:[
      {id:'pendant',label:'Pendant Lights',cost:2,color:'#f0d090'},
      {id:'recessed',label:'Recessed Downlights',cost:1,color:'#f5f5e8'},
      {id:'undercab',label:'Under-Cabinet LED',cost:1,color:'#fff0c0'},
      {id:'track',label:'Track Lighting',cost:2,color:'#d8d0b8'},
    ]},
  ],
  bathroom:[
    {group:'Flooring',key:'flooring',opts:[
      {id:'marble_f',label:'Marble',cost:3,color:'#e8e0d8'},
      {id:'hex',label:'Hex Mosaic',cost:2,color:'#b0c4b4'},
      {id:'large_t',label:'Large Format Tile',cost:2,color:'#c8c8c0'},
      {id:'nat_stone',label:'Natural Stone',cost:3,color:'#b4a898'},
    ]},
    {group:'Wall Finish',key:'wall',opts:[
      {id:'white_t',label:'White Tile',cost:1,color:'#f0f0f0'},
      {id:'terrazzo',label:'Terrazzo',cost:3,color:'#d4c8c0'},
      {id:'dark_t',label:'Dark Tile',cost:2,color:'#3a3a3a',dk:1},
      {id:'stone_w',label:'Natural Stone',cost:3,color:'#b8ac9a'},
    ]},
    {group:'Vanity',key:'vanity',opts:[
      {id:'float_w',label:'Floating White',cost:2,color:'#f5f5f5'},
      {id:'timber_v',label:'Timber Finish',cost:2,color:'#b8864a'},
      {id:'marble_v',label:'Marble Top',cost:3,color:'#ede6dc'},
    ]},
    {group:'Fixtures',key:'fixtures',opts:[
      {id:'chrome',label:'Chrome',cost:1,color:'#c8d0d8'},
      {id:'mblack',label:'Matte Black',cost:2,color:'#2a2a2a',dk:1},
      {id:'b_gold',label:'Brushed Gold',cost:3,color:'#c8a030'},
      {id:'b_nickel',label:'Brushed Nickel',cost:2,color:'#b0b0b0'},
    ]},
    {group:'Lighting',key:'lighting',opts:[
      {id:'vanity_l',label:'Vanity Strip Light',cost:1,color:'#f0d090'},
      {id:'recessed',label:'Recessed Downlights',cost:1,color:'#f5f5e8'},
      {id:'sconce',label:'Wall Sconces',cost:2,color:'#d8c090'},
    ]},
  ],
  living_room:[
    {group:'Flooring',key:'flooring',opts:[
      {id:'hardwood',label:'Hardwood Timber',cost:3,color:'#a07040'},
      {id:'eng_t',label:'Engineered Timber',cost:2,color:'#b8905a'},
      {id:'carpet',label:'Carpet',cost:1,color:'#c0b4a0'},
      {id:'concrete',label:'Polished Concrete',cost:2,color:'#9a9a9a'},
      {id:'large_t',label:'Large Tile',cost:2,color:'#c8c8c0'},
    ]},
    {group:'Wall Finish',key:'wall',opts:[
      {id:'white',label:'White Paint',cost:1,color:'#f0f0f0'},
      {id:'warm_g',label:'Warm Grey',cost:1,color:'#b0a898'},
      {id:'dark_f',label:'Dark Feature Wall',cost:1,color:'#2a2a2a',dk:1},
      {id:'lime',label:'Lime Wash',cost:2,color:'#d8d0c0'},
      {id:'wallpaper',label:'Wallpaper',cost:2,color:'#c8b8d0'},
    ]},
    {group:'Sofa',key:'sofa',opts:[
      {id:'fabric',label:'Fabric Sofa',cost:2,color:'#9aa0b0'},
      {id:'leather',label:'Leather Sofa',cost:3,color:'#8a6040'},
      {id:'boucle',label:'Boucle Sofa',cost:3,color:'#d4ccc0'},
      {id:'modular',label:'Modular Sofa',cost:2,color:'#a8b4a0'},
    ]},
    {group:'Coffee Table',key:'table',opts:[
      {id:'timber_t',label:'Timber',cost:2,color:'#b08040'},
      {id:'marble_t',label:'Marble',cost:3,color:'#ede6dc'},
      {id:'glass_t',label:'Glass',cost:2,color:'#a8c0d0'},
      {id:'rattan',label:'Rattan',cost:1,color:'#c8a878'},
    ]},
    {group:'Lighting',key:'lighting',opts:[
      {id:'floor_l',label:'Floor Lamp',cost:1,color:'#f0d090'},
      {id:'pendant',label:'Statement Pendant',cost:3,color:'#d8b860'},
      {id:'recessed',label:'Recessed Lighting',cost:2,color:'#f5f5e8'},
      {id:'wall_l',label:'Wall Lights',cost:2,color:'#e0c880'},
    ]},
  ],
  bedroom:[
    {group:'Flooring',key:'flooring',opts:[
      {id:'carpet',label:'Carpet',cost:1,color:'#c0b4a0'},
      {id:'timber',label:'Timber',cost:3,color:'#a07040'},
      {id:'eng_t',label:'Engineered Timber',cost:2,color:'#b8905a'},
      {id:'hybrid',label:'Hybrid Flooring',cost:1,color:'#9a8a78'},
    ]},
    {group:'Wall Finish',key:'wall',opts:[
      {id:'white',label:'White Paint',cost:1,color:'#f0f0f0'},
      {id:'soft_g',label:'Soft Grey',cost:1,color:'#c0b8b0'},
      {id:'navy',label:'Deep Navy',cost:1,color:'#1a2a4a',dk:1},
      {id:'terra',label:'Terracotta',cost:1,color:'#c07050'},
      {id:'wallpaper',label:'Textured Wallpaper',cost:2,color:'#d0c8b8'},
    ]},
    {group:'Bed Frame',key:'bed',opts:[
      {id:'uphol',label:'Upholstered',cost:2,color:'#9aa0b0'},
      {id:'timber_b',label:'Timber Frame',cost:2,color:'#b08040'},
      {id:'metal',label:'Metal Frame',cost:1,color:'#909090'},
      {id:'platform',label:'Platform Bed',cost:3,color:'#5a5a5a',dk:1},
    ]},
    {group:'Wardrobe',key:'wardrobe',opts:[
      {id:'built_in',label:'Built-In',cost:3,color:'#e8e0d8'},
      {id:'sliding',label:'Sliding Doors',cost:2,color:'#c8c0b8'},
      {id:'freest',label:'Freestanding',cost:1,color:'#b8a898'},
    ]},
    {group:'Lighting',key:'lighting',opts:[
      {id:'bs_pend',label:'Bedside Pendants',cost:2,color:'#f0d090'},
      {id:'recessed',label:'Recessed Downlights',cost:1,color:'#f5f5e8'},
      {id:'bs_lamp',label:'Bedside Lamps',cost:1,color:'#e8c870'},
      {id:'cove',label:'Cove Lighting',cost:2,color:'#fff0c0'},
    ]},
  ],
  laundry:[
    {group:'Flooring',key:'flooring',opts:[
      {id:'ceramic',label:'Ceramic Tile',cost:1,color:'#b0b8c8'},
      {id:'vinyl',label:'Vinyl',cost:1,color:'#8fa88a'},
      {id:'concrete',label:'Polished Concrete',cost:2,color:'#9a9a9a'},
    ]},
    {group:'Wall Finish',key:'wall',opts:[
      {id:'white',label:'White Paint',cost:1,color:'#f0f0f0'},
      {id:'tile_s',label:'Tile Splashback',cost:1,color:'#d8d8d8'},
      {id:'dark',label:'Dark Paint',cost:1,color:'#3a3a3a',dk:1},
    ]},
    {group:'Cabinetry',key:'cabinetry',opts:[
      {id:'white_l',label:'White Laminate',cost:1,color:'#f5f5f5'},
      {id:'timber_v',label:'Timber Veneer',cost:2,color:'#b8864a'},
      {id:'custom',label:'Custom Joinery',cost:3,color:'#6a7880'},
    ]},
    {group:'Benchtop',key:'benchtop',opts:[
      {id:'laminate',label:'Laminate',cost:1,color:'#d4c8b8'},
      {id:'stone',label:'Stone',cost:2,color:'#c8c0b8'},
      {id:'timber',label:'Timber',cost:2,color:'#b8864a'},
    ]},
    {group:'Lighting',key:'lighting',opts:[
      {id:'fluoro',label:'Fluorescent Strip',cost:1,color:'#f5f5e8'},
      {id:'downlights',label:'Downlights',cost:1,color:'#f0ece0'},
      {id:'pendant',label:'Pendant',cost:2,color:'#f0d090'},
    ]},
  ],
};

export const COST_CONFIG = {
  low: {
    label: "Low Cost",
    color: "text-green-400",
    bg: "bg-green-900/30",
    message: "Budget-friendly selections throughout. Consider upgrading one hero surface — benchtop or flooring — to elevate the overall finish.",
  },
  medium: {
    label: "Mid Range",
    color: "text-yellow-400",
    bg: "bg-yellow-900/30",
    message: "A well-balanced mid-range selection. Remaining spend is best directed at high-visibility elements like hardware and lighting.",
  },
  high: {
    label: "Premium",
    color: "text-red-400",
    bg: "bg-red-900/30",
    message: "Premium selections throughout. Ensure your contractor brief includes detailed specifications to match the quality of materials specified.",
  },
};