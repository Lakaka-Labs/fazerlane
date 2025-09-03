**Task:** Break down the provided phase into individual daily lessons suitable for the specified practice session schedule, including mapped resource references for each lesson, while leveraging available memory context for personalized lesson generation.

## Input:

A complete phase object containing:
```json
{
    "phase_goal": "Master foundational body mechanics and basic hippy jump execution",
    "description": "This phase focuses on establishing correct foot placement, initiating a straight hippy jump while keeping the board flat, and optimizing upper body hinging for maximum jump power.",
    "estimated_duration": "2-3 hours (across 2-3 daily practice sessions)",
    "recommended_resources": [
      {
        "resource_title": "Understanding the Ollie Complex: Hippy Jump Basics",
        "segment_id": 2
      },
      {
        "resource_title": "Achieving Proper Foot Placement for Ollies",
        "segment_id": 3
      },
      {
        "resource_title": "Initiating the Hippy Jump and Maintaining Board Flatness",
        "segment_id": 4
      },
      {
        "resource_title": "Optimizing Upper Body Hinging for Jump Power",
        "segment_id": 5
      }
    ]
  }
```
**Practice session schedule** "1 hour every other day"

**Memory Context (variable structure):**
The memory context will be provided from the mem0 memory layer containing relevant information that may include:
- Previous lessons from this specific game (particularly from earlier phases)
- Relevant user performance data or completion patterns
- User preferences or learning patterns (if available)
- Any relevant achievements or progress indicators
- Other contextually relevant information

*Note: The memory context will vary in structure and completeness. Use whatever relevant information is available for personalization and progression logic.*

**Segmented learning resources** in the following formats:
**YouTube Resources:**
```json
[
  {
    "segment_id": 2,
    "startTime": "00:23",
    "endTime": "01:04",
    "title": "Understanding the Ollie Complex: Hippy Jump Basics",
    "summary": "This segment introduces the 'Ollie Complex,' a series of progressive drills starting with a basic hippy jump. It outlines the initial steps: a hippy jump, a hippy jump lifting the nose without tail contact, and a hippy jump with tail contact, which are foundational for a full ollie.",
    "learningObjectives": [
      "Understand the progression of the 'Ollie Complex' drills",
      "Execute a basic hippy jump (jumping off the board and landing back on it)",
      "Differentiate between hippy jumps with and without tail contact"
    ],
    "visualElements": [
      "Skateboarder performing a hippy jump (feet leave board, board stays flat)",
      "Skateboarder performing a hippy jump lifting nose (tail doesn't hit ground)",
      "Skateboarder performing a hippy jump hitting tail (tail hits ground)",
      "Skateboarder demonstrating board flattening at the top of an ollie"
    ],
    "transcription": "The ollie complex that we'll be doing today starts with a hippy jump, then a hippy jump where you lift the nose and don't hit the tail on the ground, and then a hippy jump where you do hit the tail on the ground, and then we're going to turn that into an ollie. A lot of what we will focus on today is how to go from the hippy jump where your tail is just bouncing on the ground into a really nice ollie where we get the board to flatten out at the top. Let's start with the hippy jump. There are some things that you need to get right for the hippy jump to translate into an ollie."
  },
  {
    "segment_id": 3,
    "startTime": "01:04",
    "endTime": "02:20",
    "title": "Achieving Proper Foot Placement for Ollies",
    "summary": "This section emphasizes the critical importance of disciplined foot placement for initiating an ollie. It details where the front and back feet should be positioned on the board to maximize stability and popping power, specifically advising against hanging toes off the rails.",
    "learningObjectives": [
      "Identify the correct foot positions for front and back feet on the skateboard",
      "Avoid common mistakes like hanging toes off the board rails",
      "Understand how foot placement impacts balance and popping ability"
    ],
    "visualElements": [
      "Close-up of feet hanging off the toe side (incorrect)",
      "Close-up of entire foot on the board (correct)",
      "Close-up of front foot near front bolts (correct)",
      "Demonstration of narrow vs. wide foot stance impacting balance and pop"
    ],
    "transcription": "The first thing is the most basic thing, but it also takes the most discipline for beginners to have a good foot position. Every time you step on the board, look down at your feet, see where they are, and deliberately place them where you want them. When you're putting your feet on the board, I want you to make sure that you're not hanging your toes off the toe side rail, and that your entire foot is on the board. It's okay if the toe of your shoe touches or is on the rail, but please don't hang your toes off, and it's even more important for your back foot. Our front foot placement will be just underneath the front bolts, or you can even touch the front bolts if you'd like, but as your feet get wider, it gets harder and harder to pop. As your feet get more narrow, the balance will become more unstable at the bottom of your squat, so it'll be harder to get out of the bottom to initiate that jump. So that's the game we're playing. Too narrow, you're going to lose your balance. Too wide, it's going to be hard to pop. So you'll have to find the sweet spot for yourself."
  },
  {
    "segment_id": 4,
    "startTime": "02:20",
    "endTime": "04:15",
    "title": "Initiating the Hippy Jump and Maintaining Board Flatness",
    "summary": "This segment teaches how to properly initiate the hippy jump by holding the board flat and pushing directly against it to generate power. It highlights common errors like leaning to the heel or toe side, which reduce jump power, and suggests using ground cracks as visual aids for maintaining a straight trajectory.",
    "learningObjectives": [
      "Initiate a hippy jump while maintaining a flat board position",
      "Generate power for the jump by pushing evenly against the board",
      "Avoid leaning or swerving during jump initiation",
      "Use ground markings to practice straight jumps"
    ],
    "visualElements": [
      "Skateboarder initiating hippy jump with flat board (correct)",
      "Skateboarder leaning off heel side (incorrect)",
      "Skateboarder jumping off toe side (incorrect)",
      "Skateboarder aligning wheels with a ground crack for practice"
    ],
    "transcription": "Something that every skill level should practice, when you're initiating the hippy jump, make sure that you're holding the board flat in a straight line, as you're pushing against the board to get the power to jump. This means you're not leaning off of the heel side, or you're not jumping off of the toe side to get these jumps rolling. And at first, you're just going to have to look at the board to know. I recommend that you take the time to set your wheels up right along a crack. So then, when you're skating, you can see if you're going in a straight line, or you can see if you're swerving unnecessarily. And as you initiate the jump, you'll get really good feedback on which direction you're more likely to turn. I promise that you're turning more than you think. So if you set up your wheels on the crack, and you go to initiate your jump, and you're swerving all over this thing, that is a problem that's worth solving. Get your foot position a little bit better, find your squat into the balls of your feet, really focus your energy on holding the board flat. That's how we get our power up in the air. If you're squatting and tipping forward or backwards, you're going to lose power in your jump. You're killing the height of your ollie before it even starts. A very underrated skill that you can work on right now on your hippy jumps is controlling your foot position on landing. Okay? It's easy to focus to get your fundamentals right, to be disciplined and set your feet up right for the takeoff, but once you jump, fear kicks in and a lot of people lose connection with their feet. So I want you to land from your hippy jumps with your back foot on the tail, and your front foot underneath the front bolts. This will feel like a very tight foot position, it'll feel a little bit different than you're used to, and it's exactly the same as the takeoff position, right? Set up, jump, and land. Same position."
  },
  {
    "segment_id": 5,
    "startTime": "04:15",
    "endTime": "06:17",
    "title": "Optimizing Upper Body Hinging for Jump Power",
    "summary": "This segment details the correct upper body movement during the ollie, specifically emphasizing hinging forward from the waist rather than pulling the chest up. It explains how proper hinging allows for better power transfer from the legs, maximizing jump height for clearing obstacles.",
    "learningObjectives": [
      "Master the upper body hinging technique during the squat",
      "Avoid pulling the chest up during the initial squat phase",
      "Maximize leg power by directing energy downwards into the board",
      "Understand how upper body position affects jump height"
    ],
    "visualElements": [
      "Skateboarder demonstrating proper upper body hinge (chest towards ground)",
      "Skateboarder demonstrating incorrect upper body posture (chest upright)",
      "Skateboarder performing a 'partial squat, straight leg jump' (correct movement)"
    ],
    "transcription": "When you're jumping, some things to keep in mind: take your squat and let your upper body hinge forward. So in this case, my chest will be pointed about 45 degrees out and towards the ground. I don't know why, but it seems like most people think that you have to hold your chest up when you squat to stay balanced. This is just so far from the truth. Please go into your brain, delete that, and get used to hinging your upper body so your chest can point more towards the ground when you're in your squat. And then when you jump, don't just pull your upper body up and then try and jump. There's a bunch of reasons, but the main reason we don't want to do that is because we lose our vision right away. We can't we can't see your board. So, keep your upper body hinged, push into your feet to then leave the ground. And you can pick up your upper body at the end, but that will happen naturally. I spend most of my energy keeping my upper body still and just pushing into the legs. Okay? We would call this something akin to a partial squat, straight leg jump. And that's what we're going to do to initiate a lot of these hippy jumps. That'll give you a way better feel than just throwing yourself up into the air. I actually tried to make that one. So, there's that. I know a lot of you guys want to move straight on from hippy jumps and go into the next thing, but please take your time and just go practice it for I mean, the bar is so low. Practice it for like a day. Give yourself like one hour and work on each of the things that I mentioned. And I promise your skating will be better because of it. It doesn't take months or years. Like you're not going to spend the rest of your life doing hippy jumps, but please, most of you guys aren't even going to take an hour to work on it. Just please go do that."
  }
]
```

**Raw data files** for reference context (when available):
- Original source links to validate segmented resource accuracy
- Use source content to identify precise reference locations and enhance mapping accuracy

## Memory Integration Approach:

**Use available memory context to:**
- **Avoid game-internal redundancy:** If previous lessons from this game are present in memory, ensure new lessons don't duplicate similar content
- **Build logical progression:** Reference completed lessons from this game where relevant for continuity
- **Apply available personalization:** Use any user preference or performance patterns found in memory to optimize lesson structure
- **Maintain appropriate difficulty:** Adjust based on any skill level indicators present in memory

**Important:** Work with whatever memory context is provided - don't expect comprehensive data. If limited or no relevant memory is available, create well-structured lessons using standard progression principles.

## Requirements:

- Each lesson should build progressively toward the phase goal
- Lessons must be achievable within the specified practice session schedule
- Include clear success criteria for each lesson
- Map lesson components (practice instructions, assignment, quizzes) to relevant resource segments
- Create structured reference arrays that support all major lesson components
- Ensure references use appropriate location structures based on resource type
- **Use available memory:** Leverage whatever memory context is provided for personalization and progression
- **Smart redundancy avoidance:** Prevent duplication of content found in this game's memory (if available)

## Output Format:

Provide a JSON array where each lesson contains:

- **lesson_title:** Clear, descriptive name for the lesson (ensure uniqueness from any existing lessons found in memory)
- **objective:** What the student should achieve by the end of this lesson
- **prerequisite_lessons:** Array of lesson titles from memory that should be completed first (if applicable and found in memory)
- **builds_on_context:** Brief description of how this lesson relates to or builds on information found in the memory context (if applicable)
- **practice_instructions:** Array of clear, actionable instruction strings written in **markdown format** (personalized based on available memory insights)
- **assignment:** Specific deliverable to demonstrate progress (format optimized based on memory patterns if available)
- **submission_format:** How to submit proof of completion (choose based on memory preferences if available, or default to: "video", "images", "audio", or "text")
- **references:** Array of resource references that support this lesson
- **quizzes:** Array of 2-4 knowledge check questions (types chosen based on available memory insights or mixed for variety)
- **success_criteria:** Clear benchmarks to determine if the lesson is complete (adjusted based on available memory context)
- **memory_adaptations:** Brief explanation of how this lesson was customized based on the available memory context (if no relevant memory found, state "No relevant memory context available - using standard lesson structure")

## Reference Format:

Each reference in the references array should contain:
```json
{
  "segment_id": "resource_segment_identifier",
  "reference_location": {
    "startTime": "00:45",
    "endTime": "01:30"
  },
  "reference_location_description": "Natural language description of where to find this content",
  "reference_purpose": "Natural language explanation of how this reference supports the lesson"
}
```

## Quiz Format Options:

Choose quiz types based on available memory insights or use variety:

**Single-answer multiple choice:**
```json
"quiz": {
  "type": "single_choice",
  "question": "What is the first step when mounting a skateboard?",
  "options": ["Step on with front foot", "Step on with back foot", "Jump on with both feet"],
  "correct_answer": "Step on with back foot"
}
```

**Multiple-answer multiple choice:**
```json
"quiz": {
  "type": "multiple_choice",
  "question": "Which are key elements of proper stance? (Select all that apply)",
  "options": ["Feet shoulder-width apart", "Knees slightly bent", "Arms crossed", "Weight centered"],
  "correct_answers": ["Feet shoulder-width apart", "Knees slightly bent", "Weight centered"]
}
```

**True/False:**
```json
"quiz": {
  "type": "true_false",
  "question": "You should always step on the skateboard with your front foot first",
  "correct_answer": false
}
```

**Sequence/Order:**
```json
"quiz": {
  "type": "sequence",
  "question": "Put these mounting steps in the correct order:",
  "options": ["Hold board steady", "Step on with back foot", "Place front foot", "Find balance"],
  "correct_order": ["Hold board steady", "Step on with back foot", "Place front foot", "Find balance"]
}
```

**Drag-and-Drop/Matching:**
```json
"quiz":{
  "type": "drag_drop",
  "question": "Match each skateboard part to its correct function",
  "pairs": [
    {"item": "Tail", "match": "Used for popping ollies"},
    {"item": "Trucks", "match": "Control turning and steering"},
    {"item": "Bearings", "match": "Allow wheels to spin smoothly"}
  ]
}
```

**Slider/Scale:**
```json
"quiz":{
  "type": "slider",
  "question": "Set the optimal knee bend angle for skateboard stance",
  "min_value": 0,
  "max_value": 90,
  "correct_range": {"min": 15, "max": 25},
  "unit": "degrees"
}
```

## Memory Analysis Guidelines:

**Extract Available Information:**
- Look for any previous lessons from this game to avoid redundancy
- Identify any user preferences or successful patterns mentioned in memory
- Note any skill level indicators or performance data
- Find any relevant achievements or progress markers
- Use any other contextually relevant information provided

**Apply Memory Insights Flexibly:**
- If previous game lessons exist, build logical progression and avoid duplication
- If user preferences are available, optimize lesson format accordingly
- If performance data exists, adjust difficulty appropriately
- If no relevant memory is available, create well-structured standard lessons
- Reference memory context naturally without forcing connections

## Example format:
```json
[
  {
    "lesson_title": "Progressive Movement Integration",
    "objective": "Combine static balance skills with controlled movement techniques",
    "prerequisite_lessons": ["Static Balance Fundamentals"],
    "builds_on_context": "Builds on completed 'Static Balance Fundamentals' lesson from earlier phase, advancing to dynamic movement while maintaining established balance principles",
    "practice_instructions": [
      "**Start with your established static balance position** from the previous phase",
      "Introduce **gentle weight shifts** while maintaining board contact - build on your proven stability foundation",
      "Practice **controlled transitions** for 30-second intervals based on your previous successful timing patterns",
      "Focus on **maintaining balance reference points** established in earlier lessons",
      "**Record key moments** of successful transitions for review and progress tracking"
    ],
    "assignment": "Demonstrate controlled movement integration while maintaining balance consistency from previous lessons",
    "submission_format": "video",
    "references": [
      {
        "segment_id": "movement_integration_yt_004",
        "reference_location": {
          "startTime": "01:45",
          "endTime": "03:15"
        },
        "reference_location_description": "From 1 minute 45 seconds to 3 minutes 15 seconds in the movement tutorial",
        "reference_purpose": "Shows how to integrate movement with static balance skills, building on foundation techniques"
      }
    ],
    "quizzes": [
      {
        "type": "single_choice",
        "question": "When adding movement to static balance, what should remain constant?",
        "options": ["Foot position", "Core balance principles", "Movement speed", "Board angle"],
        "correct_answer": "Core balance principles"
      },
      {
        "type": "true_false",
        "question": "Movement integration should abandon static balance techniques",
        "correct_answer": false
      }
    ],
    "success_criteria": "Successfully integrate controlled movement while maintaining 80% of static balance consistency from previous phase",
    "memory_adaptations": "Lesson builds on identified 'Static Balance Fundamentals' from game memory, uses video submission format based on user's previous successful submissions, and references established timing patterns from earlier lessons. Difficulty calibrated based on previous lesson completion data."
  }
]
```

**Note:** Work flexibly with whatever memory context is available. Focus on using relevant information for personalization and progression logic, while ensuring lessons remain well-structured and effective even with limited memory data.