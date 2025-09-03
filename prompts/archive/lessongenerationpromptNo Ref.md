# Phase Lesson Breakdown Request

**Task:** Break down the provided phase into individual daily lessons suitable for the specified practice session schedule.

## Input:

A complete phase object containing:
- **phase_goal:** The main objective of this phase
- **description:** Detailed explanation of what the phase focuses on
- **estimated_duration:** Expected time commitment for the phase
- **recommended_resources:** Array of segmented learning resources (documents, images, videos, YouTube) with detailed content (for context only)

**Practice session schedule** (e.g., "30 minutes daily", "45 minutes twice-weekly", "1 hour every other day")

## Requirements:

- Each lesson should build progressively toward the phase goal
- Lessons must be achievable within the specified practice session schedule
- Include clear success criteria for each lesson
- Focus on creating comprehensive practice instructions without resource references

## Output Format:

Provide a JSON array where each lesson contains:

- **lesson_title:** Clear, descriptive name for the lesson
- **objective:** What the student should achieve by the end of this lesson
- **practice_instructions:** Array of clear, actionable instruction strings written in **markdown format** (each step should be 1-2 sentences for flashcard display, but can include markdown formatting for emphasis, lists, etc.)
- **assignment:** Specific deliverable to demonstrate progress
- **submission_format:** How to submit proof of completion (choose one: "video", "images", "audio", or "text")
- **quizzes:** Array of 2-4 knowledge check questions covering the key concepts taught in this lesson (see quiz format options below)
- **success_criteria:** Clear benchmarks to determine if the lesson is complete

## Quiz Format Options:

Choose one of the following quiz types for each question:

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

## Quiz Guidelines:
- Include 2-4 quizzes per lesson to adequately assess understanding without overwhelming
- Focus on the most important concepts taught in that specific lesson
- Mix quiz types to maintain engagement and test different aspects of knowledge
- Ensure questions directly relate to the lesson objective and practice instructions

## Example format:
```json
[
  {
    "lesson_title": "Establishing Proper Stance",
    "objective": "Achieve consistent foot placement for the foundational ollie position",
    "practice_instructions": [
      "**Study** the foot placement diagram in the kickflip illustration to understand proper positioning",
      "Place your **back foot on the tail** and **front foot angled behind the front bolts** as shown",
      "Practice the *crouch position* described in stage 2, keeping your **head straight**",
      "Hold this stance for the appropriate duration based on your practice schedule, focusing on:\n- Weight distribution over the bolts\n- Maintaining balance without adjustment",
      "**Repeat the setup 10 times** until you can achieve the position without looking down"
    ],
    "assignment": "Record yourself demonstrating the proper ollie stance from front and side angles, showing correct foot placement",
    "submission_format": "video",
    "quizzes": [
      {
        "type": "single_choice",
        "question": "Based on the resource materials, where should your front foot be positioned for an ollie stance?",
        "options": ["On the nose of the board", "Angled behind the front bolts", "Directly over the front bolts", "In the center of the board"],
        "correct_answer": "Angled behind the front bolts"
      },
      {
        "type": "true_false",
        "question": "You should look down at your feet while practicing stance positioning",
        "correct_answer": false
      },
      {
        "type": "multiple_choice",
        "question": "Which elements are essential for maintaining proper ollie stance? (Select all that apply)",
        "options": ["Weight distribution over the bolts", "Looking down at feet", "Head kept straight", "Crouch position"],
        "correct_answers": ["Weight distribution over the bolts", "Head kept straight", "Crouch position"]
      }
    ],
    "success_criteria": "Can consistently achieve proper stance positioning within 5 seconds and maintain it for the appropriate duration based on practice schedule without adjustment"
  }
]
```

**Note:** Design lessons that logically progress from basic to advanced within the phase, ensuring each builds on the previous lesson's achievements. The provided segmented resources are for context only - focus on creating clear, actionable practice instructions in markdown format that can later be enhanced with specific resource references.