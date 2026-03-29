export interface SymptomProfile {
  location: string;
  description: string;
  symptoms: string[];
  aggravating: string[];
  easing: string[];
}

export interface DifferentialResult {
  condition: string;
  confidence: "High" | "Moderate" | "Low";
  reasoning: string;
  keyIndicators: string[];
  redFlags?: string[];
}

const LOCATION_KEYWORDS: Record<string, string[]> = {
  shoulder: ["shoulder", "rotator", "deltoid", "acromion", "scapula", "supraspinatus"],
  knee: ["knee", "patella", "kneecap", "patellar", "meniscus", "acl", "mcl", "pcl"],
  hip: ["hip", "groin", "glute", "gluteal", "trochanter", "buttock"],
  ankle: ["ankle", "achilles", "calcaneal", "malleolus"],
  foot: ["foot", "heel", "plantar", "arch", "toe", "metatarsal"],
  neck: ["neck", "cervical", "trap", "trapezius"],
  "lower back": ["lower back", "low back", "lumbar", "sacral", "sacroiliac", "si joint"],
  "upper back": ["upper back", "thoracic", "mid back", "rib"],
  elbow: ["elbow", "forearm", "lateral epicondyle", "medial epicondyle"],
  wrist: ["wrist", "hand", "carpal", "thumb", "finger"],
  head: ["head", "headache", "dizzy", "dizziness", "concussion"],
};

interface ConditionProfile {
  condition: string;
  locations: string[];
  keywords: string[];
  symptomMatches: string[];
  aggravatingMatches: string[];
  easingMatches: string[];
  redFlags?: string[];
}

const CONDITIONS: ConditionProfile[] = [
  // Shoulder
  {
    condition: "Rotator Cuff Tendinopathy",
    locations: ["shoulder"],
    keywords: ["overhead", "reaching", "lifting", "gradual", "ache", "weak"],
    symptomMatches: ["pain with movement", "weakness", "pain at night", "difficulty overhead", "dull ache"],
    aggravatingMatches: ["overhead", "lifting", "reaching", "lying on side", "behind back"],
    easingMatches: ["rest", "ice", "arm by side"],
  },
  {
    condition: "Rotator Cuff Tear",
    locations: ["shoulder"],
    keywords: ["sudden", "fall", "weakness", "cannot lift", "pop", "tear", "trauma"],
    symptomMatches: ["sudden pain", "weakness", "cannot lift arm", "pain at night", "loss of strength"],
    aggravatingMatches: ["overhead", "lifting", "any movement"],
    easingMatches: ["support arm", "rest"],
    redFlags: ["Sudden onset of inability to lift arm after trauma — consider imaging."],
  },
  {
    condition: "Frozen Shoulder (Adhesive Capsulitis)",
    locations: ["shoulder"],
    keywords: ["stiff", "frozen", "cannot move", "restricted", "gradual", "tightening", "diabetic"],
    symptomMatches: ["stiffness", "loss of range of motion", "pain at rest", "difficulty reaching"],
    aggravatingMatches: ["any movement", "reaching behind", "overhead", "dressing"],
    easingMatches: ["heat", "gentle movement"],
  },
  {
    condition: "Shoulder Impingement",
    locations: ["shoulder"],
    keywords: ["pinch", "impinge", "arc", "painful arc", "catching", "overhead"],
    symptomMatches: ["pain with movement", "catching", "clicking", "overhead pain"],
    aggravatingMatches: ["overhead", "reaching", "60-120 degrees"],
    easingMatches: ["rest", "arm by side", "ice"],
  },
  // Knee
  {
    condition: "ACL Tear / Sprain",
    locations: ["knee"],
    keywords: ["pop", "twist", "gave way", "unstable", "swelling", "sport", "pivot", "landing"],
    symptomMatches: ["instability", "swelling", "giving way", "pop", "unable to weight bear"],
    aggravatingMatches: ["pivoting", "twisting", "cutting", "landing"],
    easingMatches: ["rest", "bracing", "ice"],
    redFlags: ["Acute knee effusion with mechanism of twisting/pivoting — rule out ligament rupture."],
  },
  {
    condition: "Meniscus Tear",
    locations: ["knee"],
    keywords: ["twist", "lock", "locking", "catching", "click", "squat", "giving way"],
    symptomMatches: ["locking", "catching", "clicking", "swelling", "pain with twisting"],
    aggravatingMatches: ["squatting", "twisting", "stairs", "deep flexion"],
    easingMatches: ["rest", "straightening knee", "ice"],
  },
  {
    condition: "Patellofemoral Pain Syndrome",
    locations: ["knee"],
    keywords: ["front", "anterior", "kneecap", "stairs", "sitting", "runner", "squat"],
    symptomMatches: ["front knee pain", "pain with stairs", "pain sitting", "crepitus", "grinding"],
    aggravatingMatches: ["stairs", "squatting", "sitting long periods", "running", "kneeling"],
    easingMatches: ["straightening knee", "rest", "walking flat"],
  },
  {
    condition: "Knee Osteoarthritis",
    locations: ["knee"],
    keywords: ["stiff", "morning", "old", "age", "wear", "grinding", "crepitus", "gradual", "bone on bone"],
    symptomMatches: ["stiffness", "crepitus", "morning stiffness", "swelling", "grinding"],
    aggravatingMatches: ["prolonged walking", "stairs", "weight-bearing", "cold weather"],
    easingMatches: ["heat", "gentle movement", "rest", "warm-up"],
  },
  // Hip
  {
    condition: "Hip Osteoarthritis",
    locations: ["hip"],
    keywords: ["stiff", "morning", "groin", "age", "limp", "grinding", "reduced movement"],
    symptomMatches: ["groin pain", "stiffness", "reduced range", "limp", "morning stiffness"],
    aggravatingMatches: ["walking", "stairs", "getting up", "sitting to standing"],
    easingMatches: ["gentle movement", "heat", "rest"],
  },
  {
    condition: "Hip Labral Tear",
    locations: ["hip"],
    keywords: ["catch", "click", "groin", "sharp", "deep", "twist"],
    symptomMatches: ["catching", "clicking", "groin pain", "sharp pain", "locking"],
    aggravatingMatches: ["deep flexion", "twisting", "pivoting", "sitting cross-legged"],
    easingMatches: ["rest", "avoiding provocative positions"],
  },
  {
    condition: "Greater Trochanteric Pain Syndrome",
    locations: ["hip"],
    keywords: ["outside", "lateral", "side", "lying", "bursitis", "trochanter"],
    symptomMatches: ["lateral hip pain", "pain lying on side", "ache", "tenderness outside hip"],
    aggravatingMatches: ["lying on affected side", "stairs", "walking", "crossing legs"],
    easingMatches: ["rest", "pillow between knees", "ice"],
  },
  // Ankle / Foot
  {
    condition: "Lateral Ankle Sprain",
    locations: ["ankle"],
    keywords: ["roll", "inversion", "twist", "swollen", "bruise", "step off"],
    symptomMatches: ["swelling", "bruising", "pain with walking", "instability"],
    aggravatingMatches: ["weight-bearing", "walking on uneven ground", "turning"],
    easingMatches: ["rest", "ice", "elevation", "compression"],
  },
  {
    condition: "Achilles Tendinopathy",
    locations: ["ankle"],
    keywords: ["achilles", "heel", "stiff morning", "running", "calf", "gradual", "thickened"],
    symptomMatches: ["morning stiffness", "pain with walking", "heel pain", "stiffness after rest"],
    aggravatingMatches: ["running", "jumping", "stairs", "walking uphill", "first steps morning"],
    easingMatches: ["warming up", "gentle calf stretch", "rest"],
  },
  {
    condition: "Plantar Fasciitis",
    locations: ["foot", "ankle"],
    keywords: ["heel", "plantar", "first step", "morning", "arch", "bottom of foot"],
    symptomMatches: ["heel pain", "morning pain", "first step pain", "arch pain"],
    aggravatingMatches: ["first steps", "standing long periods", "walking barefoot", "running"],
    easingMatches: ["rest", "arch support", "shoes", "stretching calf"],
  },
  // Neck
  {
    condition: "Cervical Radiculopathy",
    locations: ["neck"],
    keywords: ["arm", "radiating", "numb", "tingling", "pins", "needles", "shooting", "nerve"],
    symptomMatches: ["radiating pain", "numbness", "tingling", "weakness in arm", "shooting pain"],
    aggravatingMatches: ["looking up", "turning head", "coughing", "sneezing"],
    easingMatches: ["rest", "hand on head", "supported neck"],
    redFlags: ["Progressive neurological deficit (weakness, numbness) — consider urgent imaging."],
  },
  {
    condition: "Cervical Strain / Whiplash",
    locations: ["neck"],
    keywords: ["accident", "whiplash", "stiff", "car", "rear-end", "neck pain", "headache"],
    symptomMatches: ["neck stiffness", "headache", "pain with movement", "muscle spasm"],
    aggravatingMatches: ["turning head", "looking up/down", "driving", "screen work"],
    easingMatches: ["heat", "gentle movement", "rest", "support"],
  },
  // Lower Back
  {
    condition: "Lumbar Disc Herniation",
    locations: ["lower back"],
    keywords: ["disc", "sciatica", "leg pain", "shooting", "bending", "numbness", "tingling", "radiating"],
    symptomMatches: ["radiating pain", "leg pain", "numbness", "tingling", "back pain", "sciatica"],
    aggravatingMatches: ["bending forward", "sitting", "coughing", "sneezing", "lifting"],
    easingMatches: ["standing", "walking", "lying down", "extension"],
    redFlags: ["Bilateral leg symptoms, saddle numbness, or bladder/bowel changes — refer urgently (cauda equina)."],
  },
  {
    condition: "Non-Specific Low Back Pain",
    locations: ["lower back"],
    keywords: ["back pain", "stiff", "ache", "sore", "lifting", "general"],
    symptomMatches: ["stiffness", "aching", "pain with movement", "muscle spasm"],
    aggravatingMatches: ["prolonged sitting", "bending", "lifting", "twisting"],
    easingMatches: ["movement", "walking", "heat", "changing position"],
  },
  {
    condition: "Lumbar Spinal Stenosis",
    locations: ["lower back"],
    keywords: ["leg", "walking", "claudication", "older", "narrowing", "both legs", "standing"],
    symptomMatches: ["leg pain walking", "numbness", "heaviness legs", "relief sitting"],
    aggravatingMatches: ["walking", "standing", "extension"],
    easingMatches: ["sitting", "bending forward", "leaning on cart", "flexion"],
    redFlags: ["Progressive bilateral leg weakness — consider advanced imaging."],
  },
  {
    condition: "Sciatica",
    locations: ["lower back", "hip"],
    keywords: ["shooting", "leg", "buttock", "nerve", "radiating", "down leg", "piriformis"],
    symptomMatches: ["shooting pain", "leg pain", "buttock pain", "tingling", "numbness"],
    aggravatingMatches: ["sitting", "bending", "driving", "coughing"],
    easingMatches: ["walking", "lying down", "changing position"],
  },
  // Elbow
  {
    condition: "Tennis Elbow (Lateral Epicondylalgia)",
    locations: ["elbow"],
    keywords: ["outside", "lateral", "grip", "tennis", "typing", "mouse", "lifting", "wrist extension"],
    symptomMatches: ["pain gripping", "weakness gripping", "lateral elbow pain", "pain with wrist extension"],
    aggravatingMatches: ["gripping", "lifting", "typing", "turning doorknob", "shaking hands"],
    easingMatches: ["rest", "forearm brace", "avoiding gripping"],
  },
  {
    condition: "Golfer's Elbow (Medial Epicondylalgia)",
    locations: ["elbow"],
    keywords: ["inside", "medial", "grip", "golf", "throwing", "wrist flexion"],
    symptomMatches: ["medial elbow pain", "pain gripping", "weakness"],
    aggravatingMatches: ["gripping", "wrist flexion", "throwing", "pulling"],
    easingMatches: ["rest", "ice", "avoiding gripping"],
  },
  // Wrist
  {
    condition: "Carpal Tunnel Syndrome",
    locations: ["wrist"],
    keywords: ["numb", "tingling", "night", "pins", "needles", "thumb", "index", "middle", "typing"],
    symptomMatches: ["numbness", "tingling", "night pain", "weakness in hand", "dropping things"],
    aggravatingMatches: ["typing", "gripping", "driving", "night time", "sustained postures"],
    easingMatches: ["shaking hand out", "wrist splint", "rest"],
  },
  {
    condition: "De Quervain's Tenosynovitis",
    locations: ["wrist"],
    keywords: ["thumb", "radial", "mother", "baby", "lifting", "snapping"],
    symptomMatches: ["thumb pain", "wrist pain", "pain gripping", "swelling at thumb base"],
    aggravatingMatches: ["gripping", "lifting", "thumb movements", "wringing"],
    easingMatches: ["rest", "splinting thumb", "ice"],
  },
];

const RED_FLAGS_GENERAL = [
  { keywords: ["night sweats", "weight loss", "fever"], flag: "Unexplained weight loss, night sweats, or fever — screen for systemic or malignant causes." },
  { keywords: ["bowel", "bladder", "incontinence", "saddle"], flag: "Bowel/bladder dysfunction or saddle anaesthesia — urgent referral for cauda equina syndrome." },
  { keywords: ["bilateral weakness", "both legs weak", "both arms"], flag: "Bilateral neurological symptoms — consider central nervous system pathology." },
  { keywords: ["chest pain", "shortness of breath", "cardiac"], flag: "Chest pain with shortness of breath — rule out cardiac or pulmonary causes before musculoskeletal treatment." },
];

function scoreCondition(
  profile: ConditionProfile,
  input: SymptomProfile
): number {
  let score = 0;
  const inputLower = input.description.toLowerCase();
  const locationLower = input.location.toLowerCase();
  const allSymptoms = input.symptoms.map((s) => s.toLowerCase());
  const allAgg = input.aggravating.map((s) => s.toLowerCase());
  const allEase = input.easing.map((s) => s.toLowerCase());

  // Location match (big weight)
  for (const loc of profile.locations) {
    const locKeywords = LOCATION_KEYWORDS[loc] || [loc];
    if (locKeywords.some((kw) => locationLower.includes(kw) || inputLower.includes(kw))) {
      score += 30;
      break;
    }
  }

  // Keyword matches from description
  for (const kw of profile.keywords) {
    if (inputLower.includes(kw.toLowerCase())) {
      score += 5;
    }
  }

  // Symptom matches
  for (const sm of profile.symptomMatches) {
    if (allSymptoms.some((s) => s.includes(sm) || sm.includes(s)) || inputLower.includes(sm)) {
      score += 8;
    }
  }

  // Aggravating matches
  for (const am of profile.aggravatingMatches) {
    if (allAgg.some((a) => a.includes(am) || am.includes(a)) || inputLower.includes(am)) {
      score += 4;
    }
  }

  // Easing matches
  for (const em of profile.easingMatches) {
    if (allEase.some((e) => e.includes(em) || em.includes(e)) || inputLower.includes(em)) {
      score += 3;
    }
  }

  return score;
}

export function generateDifferentials(input: SymptomProfile): {
  differentials: DifferentialResult[];
  generalRedFlags: string[];
} {
  const scored = CONDITIONS.map((c) => ({
    profile: c,
    score: scoreCondition(c, input),
  }))
    .filter((c) => c.score > 10)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const maxScore = scored[0]?.score || 1;

  const differentials: DifferentialResult[] = scored.map((s) => {
    const ratio = s.score / maxScore;
    const confidence: "High" | "Moderate" | "Low" =
      ratio > 0.75 ? "High" : ratio > 0.45 ? "Moderate" : "Low";

    // Build reasoning from what matched
    const matchedKeywords = s.profile.keywords.filter((kw) =>
      input.description.toLowerCase().includes(kw.toLowerCase())
    );
    const matchedSymptoms = s.profile.symptomMatches.filter(
      (sm) =>
        input.symptoms.some(
          (is) => is.toLowerCase().includes(sm) || sm.includes(is.toLowerCase())
        ) || input.description.toLowerCase().includes(sm)
    );

    const indicators = [...new Set([...matchedKeywords, ...matchedSymptoms])].slice(0, 5);

    let reasoning = `Matches based on `;
    const parts: string[] = [];
    if (indicators.length > 0) parts.push(`symptoms (${indicators.join(", ")})`);
    if (s.profile.locations.some((l) => input.location.toLowerCase().includes(l)))
      parts.push("location");
    reasoning += parts.join(" and ") || "general symptom pattern";
    reasoning += ".";

    return {
      condition: s.profile.condition,
      confidence,
      reasoning,
      keyIndicators: indicators,
      redFlags: s.profile.redFlags,
    };
  });

  // Check general red flags
  const allText = `${input.description} ${input.symptoms.join(" ")} ${input.aggravating.join(" ")}`.toLowerCase();
  const generalRedFlags: string[] = [];
  for (const rf of RED_FLAGS_GENERAL) {
    if (rf.keywords.some((kw) => allText.includes(kw))) {
      generalRedFlags.push(rf.flag);
    }
  }

  return { differentials, generalRedFlags };
}
