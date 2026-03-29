export type Profession = "physiotherapist" | "biokineticist";

export interface ProtocolInput {
  condition?: string;
  moi?: string;
  duration?: string;
  acuity?: string;
  symptoms?: string[];
  notes?: string;
  profession?: Profession;
}

export interface Treatment {
  modality: string;
  description: string;
  frequency: string;
  duration: string;
  notes?: string;
  exercises?: RehabExercise[];
}

export interface RehabExercise {
  name: string;
  sets: string;
  reps: string;
  notes?: string;
}

export interface GeneratedProtocol {
  name: string;
  treatments: Treatment[];
  topSuggested: TopSuggested[];
}

export interface TopSuggested {
  modality: string;
  reason: string;
}

// Maps body region keywords in conditions to relevant treatments
const CONDITION_REGION: Record<string, string> = {
  "rotator cuff": "shoulder",
  "frozen shoulder": "shoulder",
  "shoulder impingement": "shoulder",
  "shoulder instability": "shoulder",
  "labral tear": "shoulder",
  "ac joint": "shoulder",
  "slap": "shoulder",
  "acl": "knee",
  "mcl": "knee",
  "meniscus": "knee",
  "patellofemoral": "knee",
  "patellar": "knee",
  "it band": "knee",
  "knee osteoarthritis": "knee",
  "total knee": "knee",
  "total hip": "hip",
  "hip labral": "hip",
  "hip impingement": "hip",
  "fai": "hip",
  "trochanteric": "hip",
  "hip osteoarthritis": "hip",
  "lateral ankle": "ankle",
  "achilles": "ankle",
  "plantar fasci": "foot",
  "ankle fracture": "ankle",
  "cervical": "neck",
  "whiplash": "neck",
  "lumbar": "lower back",
  "low back": "lower back",
  "spinal stenosis": "lower back",
  "spondylolisthesis": "lower back",
  "sciatica": "lower back",
  "thoracic outlet": "upper back",
  "tennis elbow": "elbow",
  "lateral epicondyl": "elbow",
  "golfer's elbow": "elbow",
  "medial epicondyl": "elbow",
  "carpal tunnel": "wrist",
  "de quervain": "wrist",
  "concussion": "head",
};

const REGION_EXERCISES: Record<string, RehabExercise[]> = {
  shoulder: [
    { name: "Pendulum Swings", sets: "3", reps: "30 sec each direction", notes: "Keep arm relaxed" },
    { name: "Wall Slides", sets: "3", reps: "10-15" },
    { name: "External Rotation with Band", sets: "3", reps: "12-15", notes: "Elbow tucked at side" },
    { name: "Internal Rotation with Band", sets: "3", reps: "12-15" },
    { name: "Scapular Squeezes", sets: "3", reps: "10", notes: "Hold 5 seconds" },
    { name: "Prone Y-T-W Raises", sets: "2", reps: "8 each", notes: "Light weight or bodyweight" },
    { name: "Side-Lying External Rotation", sets: "3", reps: "12" },
    { name: "Isometric Shoulder Flexion", sets: "3", reps: "10", notes: "Hold 5-10 seconds" },
  ],
  knee: [
    { name: "Straight Leg Raises", sets: "3", reps: "12-15" },
    { name: "Quad Sets", sets: "3", reps: "10", notes: "Hold 5-10 seconds" },
    { name: "Heel Slides", sets: "3", reps: "12-15" },
    { name: "Terminal Knee Extensions", sets: "3", reps: "12", notes: "Use band" },
    { name: "Wall Sits", sets: "3", reps: "20-30 sec hold" },
    { name: "Step-Ups", sets: "3", reps: "10 each leg", notes: "Low step, progress height" },
    { name: "Clamshells", sets: "3", reps: "15", notes: "Band above knees" },
    { name: "Single Leg Balance", sets: "3", reps: "30 sec each", notes: "Progress to unstable surface" },
  ],
  hip: [
    { name: "Clamshells", sets: "3", reps: "15 each side" },
    { name: "Bridges", sets: "3", reps: "12-15" },
    { name: "Side-Lying Hip Abduction", sets: "3", reps: "12-15" },
    { name: "Hip Flexor Stretch", sets: "3", reps: "30 sec hold each side" },
    { name: "Piriformis Stretch", sets: "3", reps: "30 sec hold each side" },
    { name: "Single Leg Deadlift", sets: "3", reps: "10 each", notes: "Bodyweight to start" },
    { name: "Monster Walks", sets: "3", reps: "10 steps each direction", notes: "Band above ankles" },
    { name: "Fire Hydrants", sets: "3", reps: "12 each side" },
  ],
  ankle: [
    { name: "Ankle Alphabet", sets: "2", reps: "Full A-Z", notes: "Trace letters with big toe" },
    { name: "Towel Scrunches", sets: "3", reps: "15" },
    { name: "Calf Raises (Bilateral)", sets: "3", reps: "15", notes: "Progress to single leg" },
    { name: "Ankle Dorsiflexion Stretch", sets: "3", reps: "30 sec hold" },
    { name: "Single Leg Balance", sets: "3", reps: "30 sec each" },
    { name: "Band Eversion/Inversion", sets: "3", reps: "12 each direction" },
    { name: "Heel Walks", sets: "3", reps: "20 steps" },
    { name: "BOSU Ball Balance", sets: "3", reps: "30 sec", notes: "When tolerated" },
  ],
  foot: [
    { name: "Towel Scrunches", sets: "3", reps: "15" },
    { name: "Marble Pickups", sets: "2", reps: "10" },
    { name: "Calf Raises", sets: "3", reps: "15" },
    { name: "Plantar Fascia Stretch", sets: "3", reps: "30 sec hold", notes: "Pull toes toward shin" },
    { name: "Frozen Bottle Roll", sets: "2", reps: "2-3 min", notes: "Doubles as cryotherapy" },
    { name: "Eccentric Calf Drops", sets: "3", reps: "12", notes: "Off step edge" },
  ],
  neck: [
    { name: "Chin Tucks", sets: "3", reps: "10", notes: "Hold 5 seconds" },
    { name: "Cervical Isometrics (4 directions)", sets: "2", reps: "10 each", notes: "Hold 5 seconds" },
    { name: "Upper Trapezius Stretch", sets: "3", reps: "30 sec each side" },
    { name: "Levator Scapulae Stretch", sets: "3", reps: "30 sec each side" },
    { name: "Scapular Retractions", sets: "3", reps: "10", notes: "Squeeze shoulder blades together" },
    { name: "Deep Neck Flexor Activation", sets: "3", reps: "10", notes: "Hold 10 seconds" },
  ],
  "lower back": [
    { name: "Cat-Cow Stretches", sets: "3", reps: "10" },
    { name: "Bird-Dogs", sets: "3", reps: "10 each side" },
    { name: "Dead Bugs", sets: "3", reps: "10 each side" },
    { name: "Pelvic Tilts", sets: "3", reps: "12" },
    { name: "Bridges", sets: "3", reps: "12-15" },
    { name: "Side Plank (Modified)", sets: "3", reps: "20-30 sec each side" },
    { name: "Knee-to-Chest Stretch", sets: "3", reps: "30 sec each side" },
    { name: "Prone Press-Ups (McKenzie)", sets: "3", reps: "10", notes: "If centralizing" },
  ],
  "upper back": [
    { name: "Thoracic Foam Roll Extension", sets: "2", reps: "10" },
    { name: "Open Book Rotations", sets: "3", reps: "10 each side" },
    { name: "Chin Tucks", sets: "3", reps: "10" },
    { name: "Scapular Wall Slides", sets: "3", reps: "10" },
    { name: "Pec Doorway Stretch", sets: "3", reps: "30 sec" },
    { name: "Rows with Band", sets: "3", reps: "12" },
  ],
  elbow: [
    { name: "Wrist Extensor Stretch", sets: "3", reps: "30 sec", notes: "Arm straight, palm down" },
    { name: "Wrist Flexor Stretch", sets: "3", reps: "30 sec" },
    { name: "Eccentric Wrist Extensions", sets: "3", reps: "12", notes: "Slow lowering" },
    { name: "Supination/Pronation with Weight", sets: "3", reps: "12" },
    { name: "Grip Strengthening (Putty/Ball)", sets: "3", reps: "10", notes: "5 sec hold" },
    { name: "Tyler Twist (FlexBar)", sets: "3", reps: "10", notes: "If available" },
  ],
  wrist: [
    { name: "Tendon Gliding Exercises", sets: "3", reps: "10 each position" },
    { name: "Nerve Gliding (Median Nerve)", sets: "3", reps: "10", notes: "Gentle, pain-free range" },
    { name: "Wrist Flexion/Extension Stretch", sets: "3", reps: "30 sec each" },
    { name: "Grip Strengthening", sets: "3", reps: "10" },
    { name: "Thumb Opposition Exercises", sets: "2", reps: "10 each finger" },
    { name: "Wrist Circles", sets: "2", reps: "10 each direction" },
  ],
  head: [
    { name: "Diaphragmatic Breathing", sets: "3", reps: "10 breaths", notes: "5 sec in, 5 sec out" },
    { name: "Gentle Cervical ROM", sets: "2", reps: "5 each direction", notes: "Sub-symptom threshold" },
    { name: "Eye Tracking (Smooth Pursuit)", sets: "2", reps: "10", notes: "Follow finger H-pattern" },
    { name: "Walking Program", sets: "1", reps: "10-20 min", notes: "Sub-symptom threshold" },
    { name: "Balance Training", sets: "3", reps: "30 sec", notes: "Tandem stance, eyes open/closed" },
  ],
};

function getRegion(condition: string): string | null {
  const lower = condition.toLowerCase();
  for (const [keyword, region] of Object.entries(CONDITION_REGION)) {
    if (lower.includes(keyword)) return region;
  }
  return null;
}

export function generateProtocol(input: ProtocolInput): GeneratedProtocol {
  const treatments: Treatment[] = [];
  const region = input.condition ? getRegion(input.condition) : null;
  const isAcute = input.acuity === "acute" || input.acuity === "post-op";
  const isChronic = input.acuity === "chronic";
  const isSubacute = input.acuity === "subacute";
  const symptoms = input.symptoms || [];
  const isBio = input.profession === "biokineticist";
  const isPhysio = !isBio;

  const hasSwelling = symptoms.some((s) => s.toLowerCase().includes("swelling"));
  const hasPain = symptoms.some((s) => s.toLowerCase().includes("pain"));
  const hasStiffness = symptoms.some((s) => s.toLowerCase().includes("stiffness"));
  const hasRomLoss = symptoms.some((s) => s.toLowerCase().includes("range of motion"));
  const hasNumbness = symptoms.some((s) => s.toLowerCase().includes("numbness") || s.toLowerCase().includes("tingling"));
  const hasMuscleSpasm = symptoms.some((s) => s.toLowerCase().includes("spasm"));

  // === PHYSIO-ONLY MODALITIES ===
  // Biokineticists skip straight to rehab exercises below

  if (isPhysio) {
    // 1. Cryotherapy / Icing - acute, swelling, post-op, pain
    if (isAcute || hasSwelling || input.acuity === "post-op") {
      treatments.push({
        modality: "Cryotherapy / Icing",
        description: "Apply ice pack wrapped in towel to affected area to reduce inflammation and provide pain relief.",
        frequency: isAcute ? "Every 2-3 hours" : "2-3x daily",
        duration: "15-20 minutes per session",
        notes: hasSwelling
          ? "Elevate the area during icing. Combine with compression if appropriate."
          : "Protect skin with towel barrier. Monitor for adverse reactions.",
      });
    }

    // 2. Heat Therapy - chronic, stiffness, muscle spasm
    if ((isChronic || isSubacute || hasStiffness || hasMuscleSpasm) && !isAcute && !hasSwelling) {
      treatments.push({
        modality: "Heat Therapy",
        description: "Apply moist heat to affected area to increase blood flow, relax muscles, and improve tissue extensibility.",
        frequency: "Before treatment sessions or 2-3x daily",
        duration: "15-20 minutes",
        notes: hasMuscleSpasm
          ? "Focus on muscle belly. Follow with gentle stretching."
          : "Use prior to manual therapy or exercise for best results.",
      });
    }

    // 3. Manual Therapy / Deep Tissue
    if (hasStiffness || hasRomLoss || hasMuscleSpasm || hasPain) {
      treatments.push({
        modality: "Deep Tissue Massage / Manual Therapy",
        description: isAcute
          ? "Gentle soft tissue mobilization around the affected area. Avoid aggressive deep pressure on acute tissues."
          : "Deep tissue massage and myofascial release to address muscle tension, trigger points, and soft tissue restrictions.",
        frequency: "2-3x per week",
        duration: "15-20 minutes per session",
        notes: isAcute
          ? "Grade I-II mobilizations only. Progress as tolerated."
          : hasMuscleSpasm
          ? "Focus on trigger points and tight bands. Combine with heat pre-treatment."
          : "Progress pressure based on patient tolerance.",
      });
    }

    // 4. Dry Needling - chronic pain, trigger points, muscle spasm, stiffness
    if ((isChronic || isSubacute || hasMuscleSpasm) && !isAcute && region !== "head") {
      treatments.push({
        modality: "Dry Needling",
        description: "Intramuscular stimulation targeting myofascial trigger points to reduce pain, release tension, and restore muscle function.",
        frequency: "1-2x per week",
        duration: "10-15 minutes",
        notes: "Patient may experience post-needling soreness for 24-48 hours. Apply heat after session if needed.",
      });
    }

    // 5. Shockwave Therapy - tendinopathies, chronic conditions, calcification
    if (isChronic || input.condition?.toLowerCase().includes("tendinop") || input.condition?.toLowerCase().includes("plantar") || input.condition?.toLowerCase().includes("epicondyl")) {
      treatments.push({
        modality: "Shockwave Therapy (ESWT)",
        description: "Extracorporeal shockwave therapy to stimulate healing response, increase blood flow, and break down calcification or scar tissue.",
        frequency: "1x per week",
        duration: "3-5 minutes per treatment zone, 4-6 sessions total",
        notes: "Avoid NSAIDs 48 hours before/after. Patient may feel temporary increase in soreness.",
      });
    }

    // 6. Bioflex Laser Therapy - pain, inflammation, tissue healing
    if (hasPain || hasSwelling || isAcute || input.acuity === "post-op") {
      treatments.push({
        modality: "Bioflex Laser Therapy",
        description: "Bioflex low-level laser therapy (LLLT) combining superluminous and laser diodes to accelerate tissue healing, reduce inflammation, and provide deep analgesic effects.",
        frequency: "2-3x per week",
        duration: "20-30 minutes per treatment area (multi-phase protocol)",
        notes: isAcute
          ? "Safe to use in acute phase. Begin with lower power settings and progress. Focus on anti-inflammatory protocol."
          : "Full Bioflex protocol: superluminous array followed by laser probe to target deeper structures. Can combine with other modalities.",
      });
    }

    // 7. TENS - pain management
    if (hasPain && !hasNumbness) {
      treatments.push({
        modality: "TENS (Transcutaneous Electrical Nerve Stimulation)",
        description: "Electrical stimulation for pain modulation via the gate control mechanism.",
        frequency: "As needed, up to 3x daily",
        duration: "20-30 minutes per session",
        notes: "Patient can use portable unit at home. Adjust intensity to comfortable tingling sensation.",
      });
    }

    // 8. Therapeutic Ultrasound - deep tissue heating, chronic
    if ((isChronic || isSubacute) && hasStiffness && region !== "head") {
      treatments.push({
        modality: "Therapeutic Ultrasound",
        description: "Deep tissue heating to improve tissue extensibility, increase blood flow, and promote healing.",
        frequency: "2-3x per week",
        duration: "5-8 minutes per area",
        notes: "Use continuous mode for thermal effects, pulsed mode for non-thermal healing effects.",
      });
    }

    // 9. Taping - instability, acute support
    if (symptoms.some((s) => s.toLowerCase().includes("instability")) || isAcute) {
      treatments.push({
        modality: "Taping / Bracing",
        description: "Kinesiology taping or rigid taping to provide support, proprioceptive feedback, and reduce load on affected structures.",
        frequency: "As needed, reapply every 3-5 days",
        duration: "Continuous wear during activities",
        notes: "Educate patient on skin care and signs of irritation. Progress to weaning as stability improves.",
      });
    }

    // 10. Stretching Program - physio
    if (hasStiffness || hasRomLoss) {
      treatments.push({
        modality: "Stretching Program",
        description: "Targeted static and dynamic stretching protocol to restore flexibility and range of motion.",
        frequency: "Daily, 2x per day if tolerated",
        duration: "10-15 minutes per session",
        notes: isAcute
          ? "Gentle static holds only. Stay within pain-free range."
          : "Progress from static to dynamic stretching. Include PNF stretching where appropriate.",
      });
    }
  }

  // === REHAB EXERCISES — both professions ===
  const exerciseList = region ? (REGION_EXERCISES[region] || []) : [];

  // Filter exercises based on acuity
  let selectedExercises = exerciseList;
  if (isAcute) {
    selectedExercises = exerciseList.slice(0, Math.min(5, exerciseList.length));
  } else if (isChronic && exerciseList.length > 4) {
    selectedExercises = exerciseList;
  }

  // Bio: add stretching as a separate modality since they focus on exercise-based rehab
  if (isBio && (hasStiffness || hasRomLoss || selectedExercises.length > 0)) {
    treatments.push({
      modality: "Stretching Program",
      description: "Targeted static and dynamic stretching protocol to restore flexibility, improve range of motion, and prepare for exercise.",
      frequency: "Daily, incorporated into warm-up and cool-down",
      duration: "10-15 minutes per session",
      notes: isAcute
        ? "Gentle static holds only (20-30 seconds). Stay within pain-free range."
        : "Progress from static to dynamic stretching. Incorporate PNF techniques where appropriate.",
    });
  }

  if (selectedExercises.length > 0) {
    treatments.push({
      modality: "Rehabilitation Exercises",
      description: isBio
        ? isAcute
          ? "Gentle, progressive exercise program focused on restoring functional movement patterns within pain-free range."
          : isChronic
          ? "Comprehensive exercise-based rehabilitation program targeting strength, endurance, functional capacity, and return to activity."
          : "Targeted exercise rehabilitation program to restore strength, mobility, and functional capacity."
        : isAcute
        ? "Gentle, pain-free exercises focused on maintaining range of motion and preventing deconditioning."
        : isChronic
        ? "Progressive strengthening and functional exercises to restore full capacity and prevent recurrence."
        : "Targeted exercises to restore strength, mobility, and function.",
      frequency: isBio
        ? isAcute ? "2-3x per week" : "3-5x per week"
        : isAcute ? "1-2x daily" : "Daily or as prescribed",
      duration: isBio ? "30-45 minutes per session" : "20-30 minutes per session",
      notes: isBio
        ? isAcute
          ? "All exercises performed within pain-free range. Monitor load and volume carefully. Progress when symptoms allow."
          : "Periodise training load. Track progression via sets/reps/resistance. Include functional movement screening."
        : isAcute
        ? "All exercises should be performed within pain-free range. Stop if pain increases."
        : "Progress resistance and complexity as tolerated. Maintain proper form throughout.",
      exercises: selectedExercises,
    });
  }

  // Build protocol name
  const professionLabel = isBio ? "Biokinetics" : "Physiotherapy";
  let protocolName = `${professionLabel} Protocol`;
  if (input.condition) {
    protocolName = `${input.condition} — ${professionLabel} Protocol`;
    if (input.acuity) {
      const acuityLabel = input.acuity.charAt(0).toUpperCase() + input.acuity.slice(1);
      protocolName += ` (${acuityLabel})`;
    }
  }

  // Determine top suggested treatments based on condition, acuity, and symptoms
  const topSuggested: TopSuggested[] = [];

  for (const t of treatments) {
    const mod = t.modality;

    // Rehab is always top for bio
    if (isBio && mod === "Rehabilitation Exercises") {
      topSuggested.push({
        modality: mod,
        reason: "Core of biokinetics treatment — exercise-based rehabilitation is your primary intervention.",
      });
    }

    // Shockwave for tendinopathies
    if (mod === "Shockwave Therapy (ESWT)" && (input.condition?.toLowerCase().includes("tendinop") || input.condition?.toLowerCase().includes("plantar") || input.condition?.toLowerCase().includes("epicondyl"))) {
      topSuggested.push({
        modality: mod,
        reason: "Strong evidence for tendinopathies and chronic enthesopathies. Stimulates tissue remodelling.",
      });
    }

    // Bioflex for acute/post-op
    if (mod === "Bioflex Laser Therapy" && (isAcute || input.acuity === "post-op")) {
      topSuggested.push({
        modality: mod,
        reason: "Excellent for acute inflammation and post-surgical recovery. Accelerates cellular healing with minimal risk.",
      });
    }

    // Deep tissue for chronic pain/spasm
    if (mod === "Deep Tissue Massage / Manual Therapy" && (hasMuscleSpasm || (isChronic && hasPain))) {
      topSuggested.push({
        modality: mod,
        reason: "Directly addresses muscle tension and trigger points. High patient satisfaction for pain relief.",
      });
    }

    // Dry needling for chronic trigger points
    if (mod === "Dry Needling" && hasMuscleSpasm) {
      topSuggested.push({
        modality: mod,
        reason: "Targets myofascial trigger points directly. Fast-acting for muscle spasm and referred pain patterns.",
      });
    }

    // Cryotherapy for acute swelling
    if (mod === "Cryotherapy / Icing" && isAcute && hasSwelling) {
      topSuggested.push({
        modality: mod,
        reason: "First-line treatment for acute injury with swelling. Controls inflammation and reduces pain.",
      });
    }

    // Rehab for physio chronic
    if (isPhysio && mod === "Rehabilitation Exercises" && isChronic) {
      topSuggested.push({
        modality: mod,
        reason: "Long-term recovery depends on progressive loading. Most important modality for chronic conditions.",
      });
    }

    if (topSuggested.length >= 3) break;
  }

  // If we have fewer than 2, add first treatment as a suggestion
  if (topSuggested.length === 0 && treatments.length > 0) {
    topSuggested.push({
      modality: treatments[0].modality,
      reason: "Primary recommended treatment based on your clinical input.",
    });
  }

  return { name: protocolName, treatments, topSuggested };
}
