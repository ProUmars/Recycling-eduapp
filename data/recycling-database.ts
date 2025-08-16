export const recyclingDatabase: Record<string, any> = {
  plastic: {
    instructions: {
      recyclable: "Rinse the container thoroughly to remove any food residue. Check for the recycling number on the bottom. Place in your recycling bin with the cap on if accepted locally.",
      nonRecyclable: "This type of plastic cannot be recycled in regular programs. Check for special drop-off locations for plastic bags and films at grocery stores. Consider reusing or reducing use.",
    },
    impact: "Plastic recycling prevents ocean pollution and reduces petroleum consumption. Each ton of recycled plastic saves 5,774 kWh of energy.",
  },
  paper: {
    instructions: {
      recyclable: "Keep paper clean and dry. Remove any plastic windows from envelopes. Flatten cardboard boxes and remove tape. Bundle similar items together if required by your local program.",
      nonRecyclable: "Contaminated paper cannot be recycled. Compost food-soiled paper if possible. Shredded paper may need special handling - check local guidelines.",
    },
    impact: "Paper recycling saves trees and reduces landfill waste. One ton of recycled paper saves 17 trees and 7,000 gallons of water.",
  },
  glass: {
    instructions: {
      recyclable: "Rinse glass containers and remove lids. Sort by color if required. Do not break glass unless necessary. Place carefully in recycling bin to avoid injury to workers.",
      nonRecyclable: "Window glass, mirrors, and ceramics have different melting points and cannot be recycled with container glass. Dispose in regular trash or check for special programs.",
    },
    impact: "Glass is 100% recyclable and can be recycled endlessly without quality loss. Recycling glass reduces raw material extraction.",
  },
  metal: {
    instructions: {
      recyclable: "Rinse metal cans and containers. Aluminum foil should be clean and balled up to at least 2 inches. Steel and aluminum can be recycled together in most programs.",
      nonRecyclable: "Paint cans must be completely empty or dried out. Hazardous material containers need special disposal. Large metal items may require special pickup.",
    },
    impact: "Metal recycling is highly efficient. Recycling aluminum saves 95% of the energy needed to produce new aluminum from raw materials.",
  },
  organic: {
    instructions: {
      recyclable: "Collect food scraps in a kitchen caddy. If you have curbside composting, follow local guidelines. For home composting, maintain proper green to brown ratio.",
      nonRecyclable: "Pet waste, diseased plants, and treated wood should not be composted. Meat and dairy may attract pests - check local rules.",
    },
    impact: "Composting reduces methane emissions from landfills and creates valuable soil amendment, completing the natural nutrient cycle.",
  },
  electronic: {
    instructions: {
      recyclable: "Never put e-waste in regular recycling. Find certified e-waste recyclers or retailer take-back programs. Remove personal data and batteries first.",
      nonRecyclable: "Damaged electronics with leaking batteries need special handling. Medical equipment may have biohazard concerns. Contact specialized disposal services.",
    },
    impact: "E-waste contains precious metals and rare earth elements. Proper recycling recovers these materials and prevents toxic substances from entering the environment.",
  },
  hazardous: {
    instructions: {
      recyclable: "Never put hazardous materials in regular recycling. Locate household hazardous waste collection events or permanent drop-off sites in your area.",
      nonRecyclable: "Unknown chemicals, medical waste, and asbestos require professional disposal. Contact your local waste management for guidance.",
    },
    impact: "Proper hazardous waste disposal prevents contamination of water supplies and soil, protecting both human health and ecosystems.",
  },
  mixed: {
    instructions: {
      recyclable: "Items made of multiple materials may need to be separated. Check if components can be recycled individually.",
      nonRecyclable: "Mixed material items often cannot be recycled. Consider ways to reuse or repurpose before disposal.",
    },
    impact: "Reducing mixed material waste through conscious purchasing decisions has the greatest environmental benefit.",
  },
};