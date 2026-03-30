import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@rehab.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@rehab.com",
      passwordHash: adminPassword,
      role: "admin",
    },
  });
  console.log(`Created admin user: ${admin.email}`);

  // Create clinician user
  const clinicianPassword = await bcrypt.hash("clinician123", 10);
  const clinician = await prisma.user.upsert({
    where: { email: "clinician@rehab.com" },
    update: {},
    create: {
      name: "Dr. Smith",
      email: "clinician@rehab.com",
      passwordHash: clinicianPassword,
      role: "clinician",
    },
  });
  console.log(`Created clinician user: ${clinician.email}`);

  // Staff members with 4-digit PIN codes
  const staffMembers = [
    { name: "Justin", email: "justin@rehab.com", pin: "2847", profession: "physiotherapist" },
    { name: "Luyolo", email: "luyolo@rehab.com", pin: "5193", profession: "physiotherapist" },
    { name: "Tasneem", email: "tasneem@rehab.com", pin: "7362", profession: "physiotherapist" },
    { name: "Zoe", email: "zoe@rehab.com", pin: "4081", profession: "biokineticist" },
    { name: "Admin", email: "admin@rehab.com", pin: "9999", profession: "physiotherapist" },
  ];

  for (const staff of staffMembers) {
    const hashedPin = await bcrypt.hash(staff.pin, 10);
    const user = await prisma.user.upsert({
      where: { email: staff.email },
      update: { passwordHash: hashedPin, profession: staff.profession },
      create: {
        name: staff.name,
        email: staff.email,
        passwordHash: hashedPin,
        role: staff.email === "admin@rehab.com" ? "admin" : "clinician",
        profession: staff.profession,
      },
    });
    console.log(`Created staff: ${user.name} (${user.email}) — PIN: ${staff.pin}`);
  }

  // Sample exercises
  const exercises = [
    // Shoulder exercises
    {
      name: "Shoulder External Rotation",
      bodyRegion: "Shoulder",
      category: "Strength",
      difficulty: "Beginner",
      equipment: "Resistance band",
      instructions:
        "Stand with your elbow bent at 90 degrees and tucked against your side. Hold a resistance band attached to a door handle at elbow height. Rotate your forearm outward, keeping your elbow pinned to your side. Slowly return to the starting position.",
      defaultSets: 3,
      defaultReps: 12,
      defaultHold: null,
      defaultRest: 60,
      imageUrl: null,
      notes: "Avoid compensating with trunk rotation. Keep shoulder blades retracted.",
    },
    {
      name: "Pendulum Swings",
      bodyRegion: "Shoulder",
      category: "ROM",
      difficulty: "Beginner",
      equipment: "None",
      instructions:
        "Lean forward and support yourself with your unaffected arm on a table. Let the affected arm hang freely. Gently swing the arm in small circles, gradually increasing the diameter. Perform clockwise and counterclockwise motions.",
      defaultSets: 2,
      defaultReps: 15,
      defaultHold: null,
      defaultRest: 30,
      imageUrl: null,
      notes: "Use body momentum rather than active muscle contraction. Good for early post-operative rehabilitation.",
    },
    {
      name: "Wall Slides",
      bodyRegion: "Shoulder",
      category: "Mobility",
      difficulty: "Intermediate",
      equipment: "None",
      instructions:
        "Stand facing a wall with your forearms against it, elbows at shoulder height. Slowly slide your arms upward along the wall as high as comfortable, keeping your forearms in contact with the wall. Slowly return to the starting position.",
      defaultSets: 3,
      defaultReps: 10,
      defaultHold: 5,
      defaultRest: 60,
      imageUrl: null,
      notes: "Maintain contact with the wall throughout the movement. Stop if sharp pain occurs.",
    },
    {
      name: "Scapular Squeezes",
      bodyRegion: "Shoulder",
      category: "Strength",
      difficulty: "Beginner",
      equipment: "None",
      instructions:
        "Sit or stand with good posture. Squeeze your shoulder blades together as if trying to hold a pencil between them. Hold the squeeze, then slowly release. Keep your shoulders down and away from your ears throughout.",
      defaultSets: 3,
      defaultReps: 15,
      defaultHold: 5,
      defaultRest: 45,
      imageUrl: null,
      notes: "Focus on lower trapezius activation. Excellent for postural correction.",
    },

    // Knee exercises
    {
      name: "Straight Leg Raises",
      bodyRegion: "Knee",
      category: "Strength",
      difficulty: "Beginner",
      equipment: "None",
      instructions:
        "Lie on your back with one leg bent and the other straight. Tighten the quadriceps of the straight leg and lift it to the height of the opposite knee. Hold briefly at the top, then slowly lower. Keep the knee fully extended throughout.",
      defaultSets: 3,
      defaultReps: 10,
      defaultHold: 3,
      defaultRest: 60,
      imageUrl: null,
      notes: "Foundational exercise post-ACL or total knee replacement. Add ankle weights for progression.",
    },
    {
      name: "Quad Sets",
      bodyRegion: "Knee",
      category: "Strength",
      difficulty: "Beginner",
      equipment: "Rolled towel",
      instructions:
        "Sit with your leg extended and a small rolled towel under your knee. Press the back of your knee down into the towel by tightening your quadriceps. Hold the contraction, then release. You should see your kneecap move upward.",
      defaultSets: 3,
      defaultReps: 10,
      defaultHold: 5,
      defaultRest: 30,
      imageUrl: null,
      notes: "Essential early rehab exercise for quad activation after knee surgery.",
    },
    {
      name: "Hamstring Curls",
      bodyRegion: "Knee",
      category: "Strength",
      difficulty: "Intermediate",
      equipment: "Ankle weights",
      instructions:
        "Stand holding onto a chair or counter for balance. Slowly bend one knee, bringing your heel toward your buttock. Hold at the top of the movement, then slowly lower. Keep your thighs aligned and avoid swinging.",
      defaultSets: 3,
      defaultReps: 12,
      defaultHold: 2,
      defaultRest: 60,
      imageUrl: null,
      notes: "Progress from bodyweight to ankle weights. Maintain upright posture throughout.",
    },
    {
      name: "Step-Ups",
      bodyRegion: "Knee",
      category: "Functional",
      difficulty: "Intermediate",
      equipment: "Step or platform (6-8 inches)",
      instructions:
        "Stand in front of a step. Place your affected foot entirely on the step. Push through this leg to step up, bringing the other foot to the step. Step back down leading with the unaffected leg. Control the descent.",
      defaultSets: 3,
      defaultReps: 10,
      defaultHold: null,
      defaultRest: 90,
      imageUrl: null,
      notes: "Start with a low step and progress height as tolerated. Ensure the knee tracks over the second toe.",
    },

    // Hip exercises
    {
      name: "Clamshells",
      bodyRegion: "Hip",
      category: "Strength",
      difficulty: "Beginner",
      equipment: "Resistance band (optional)",
      instructions:
        "Lie on your side with knees bent to 45 degrees, feet together. Keeping your feet in contact, raise your top knee as far as possible without rotating your pelvis. Pause at the top, then slowly lower. A resistance band above the knees adds difficulty.",
      defaultSets: 3,
      defaultReps: 15,
      defaultHold: 2,
      defaultRest: 45,
      imageUrl: null,
      notes: "Targets the gluteus medius. Avoid rolling the pelvis backward during the movement.",
    },
    {
      name: "Hip Bridges",
      bodyRegion: "Hip",
      category: "Strength",
      difficulty: "Beginner",
      equipment: "None",
      instructions:
        "Lie on your back with knees bent and feet flat on the floor, hip-width apart. Squeeze your glutes and lift your hips off the floor until your body forms a straight line from shoulders to knees. Hold at the top, then slowly lower.",
      defaultSets: 3,
      defaultReps: 12,
      defaultHold: 3,
      defaultRest: 60,
      imageUrl: null,
      notes: "Avoid hyperextending the lower back. Progress to single-leg bridges when ready.",
    },
    {
      name: "Side-Lying Hip Abduction",
      bodyRegion: "Hip",
      category: "Strength",
      difficulty: "Beginner",
      equipment: "None",
      instructions:
        "Lie on your side with both legs straight, bottom leg slightly bent for stability. Keeping the top leg straight and toes pointed forward, lift the leg toward the ceiling approximately 30-45 degrees. Hold briefly, then slowly lower.",
      defaultSets: 3,
      defaultReps: 12,
      defaultHold: 2,
      defaultRest: 45,
      imageUrl: null,
      notes: "Keep the hip stacked; avoid rolling forward or backward. Add ankle weights for progression.",
    },

    // Ankle exercises
    {
      name: "Ankle Pumps",
      bodyRegion: "Ankle",
      category: "ROM",
      difficulty: "Beginner",
      equipment: "None",
      instructions:
        "Sit or lie down with your leg elevated. Slowly point your toes away from you (plantarflexion), then pull your toes toward you (dorsiflexion). Move through the full available range of motion in a controlled manner.",
      defaultSets: 3,
      defaultReps: 20,
      defaultHold: null,
      defaultRest: 30,
      imageUrl: null,
      notes: "Excellent for reducing swelling post-injury or surgery. Can be performed frequently throughout the day.",
    },
    {
      name: "Calf Raises",
      bodyRegion: "Ankle",
      category: "Strength",
      difficulty: "Intermediate",
      equipment: "None",
      instructions:
        "Stand on both feet near a wall or counter for balance. Rise up onto your toes as high as possible, squeezing the calf muscles. Hold briefly at the top, then slowly lower back down. For added challenge, perform on a step with heels hanging off the edge.",
      defaultSets: 3,
      defaultReps: 15,
      defaultHold: 2,
      defaultRest: 60,
      imageUrl: null,
      notes: "Progress to single-leg calf raises. Ensure controlled eccentric (lowering) phase.",
    },
    {
      name: "Balance Board Training",
      bodyRegion: "Ankle",
      category: "Balance",
      difficulty: "Advanced",
      equipment: "Balance board or wobble board",
      instructions:
        "Stand on the balance board with feet shoulder-width apart. Try to maintain balance without letting the edges of the board touch the ground. Start with both feet, then progress to single-leg stance. Maintain for the prescribed hold time.",
      defaultSets: 3,
      defaultReps: 5,
      defaultHold: 30,
      defaultRest: 60,
      imageUrl: null,
      notes: "Ensure safety by having a stable surface nearby for support. Critical for ankle sprain rehabilitation and proprioception retraining.",
    },

    // Spine exercises
    {
      name: "Cat-Cow Stretch",
      bodyRegion: "Spine",
      category: "Mobility",
      difficulty: "Beginner",
      equipment: "Yoga mat",
      instructions:
        "Start on your hands and knees with wrists under shoulders and knees under hips. For Cat: Exhale and round your spine toward the ceiling, tucking chin to chest. For Cow: Inhale and arch your back, lifting your head and tailbone toward the ceiling. Flow smoothly between positions.",
      defaultSets: 2,
      defaultReps: 10,
      defaultHold: null,
      defaultRest: 30,
      imageUrl: null,
      notes: "Move with breath. Excellent for spinal mobility and warming up the back.",
    },
    {
      name: "Bird Dog",
      bodyRegion: "Spine",
      category: "Strength",
      difficulty: "Intermediate",
      equipment: "Yoga mat",
      instructions:
        "Start on your hands and knees in a tabletop position. Simultaneously extend your right arm forward and left leg backward until both are parallel to the floor. Keep your hips level and core engaged. Hold, then return and switch sides.",
      defaultSets: 3,
      defaultReps: 8,
      defaultHold: 5,
      defaultRest: 60,
      imageUrl: null,
      notes: "Focus on maintaining a neutral spine. Avoid rotation of the pelvis. A McGill-recommended core stability exercise.",
    },
    {
      name: "Dead Bug",
      bodyRegion: "Spine",
      category: "Strength",
      difficulty: "Intermediate",
      equipment: "Yoga mat",
      instructions:
        "Lie on your back with arms extended toward the ceiling and knees bent at 90 degrees. Slowly lower your right arm overhead and extend your left leg toward the floor simultaneously. Keep your lower back pressed into the mat. Return and repeat on the opposite side.",
      defaultSets: 3,
      defaultReps: 8,
      defaultHold: 3,
      defaultRest: 60,
      imageUrl: null,
      notes: "If the lower back lifts off the mat, reduce the range of motion. Essential core anti-extension exercise.",
    },
    {
      name: "Prone Back Extensions",
      bodyRegion: "Spine",
      category: "Strength",
      difficulty: "Intermediate",
      equipment: "Yoga mat",
      instructions:
        "Lie face down with your hands placed beside your shoulders or at your temples. Slowly lift your upper body off the floor by extending your back. Lift only to a comfortable height. Hold briefly, then slowly lower back down.",
      defaultSets: 3,
      defaultReps: 10,
      defaultHold: 3,
      defaultRest: 60,
      imageUrl: null,
      notes: "Keep the movement controlled. Avoid pushing up with the arms; use the back extensors. Contraindicated for some disc conditions.",
    },

    // Core exercises
    {
      name: "Plank",
      bodyRegion: "Core",
      category: "Strength",
      difficulty: "Intermediate",
      equipment: "Yoga mat",
      instructions:
        "Start in a forearm plank position with elbows directly under shoulders, body forming a straight line from head to heels. Engage your core by drawing your navel toward your spine. Maintain the position without letting your hips sag or pike up.",
      defaultSets: 3,
      defaultReps: 1,
      defaultHold: 30,
      defaultRest: 60,
      imageUrl: null,
      notes: "Modify on knees if needed. Focus on quality of position over duration. Breathe normally throughout.",
    },
    {
      name: "Side Plank",
      bodyRegion: "Core",
      category: "Strength",
      difficulty: "Advanced",
      equipment: "Yoga mat",
      instructions:
        "Lie on your side with your elbow directly under your shoulder and feet stacked. Lift your hips off the ground, creating a straight line from head to feet. Hold the position with your core engaged. Keep your top hip stacked directly above the bottom hip.",
      defaultSets: 3,
      defaultReps: 1,
      defaultHold: 20,
      defaultRest: 60,
      imageUrl: null,
      notes: "Modify by bending the bottom knee. Targets the obliques and gluteus medius. Important for lateral trunk stability.",
    },
  ];

  for (const exercise of exercises) {
    await prisma.exercise.create({
      data: exercise,
    });
  }

  console.log(`Created ${exercises.length} sample exercises.`);
  console.log("Seeding complete!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
